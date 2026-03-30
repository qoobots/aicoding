import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron';
import path from 'path';
import { spawn, ChildProcess } from 'child_process';
import { URL } from 'url';

let nestjsProcess: ChildProcess | null = null;
let mainWindow: BrowserWindow | null = null;

// 启动NestJS后端服务
async function startNestJS(): Promise<void> {
  const isDev = process.env.NODE_ENV === 'development';

  const backendPath = isDev
    ? path.join(__dirname, '../../backend')
    : path.join(__dirname, '../backend');

  const nodePath = process.execPath;

  const args: string[] = [];

  if (isDev) {
    args.push('npm', 'run', 'start:dev');
    // 开发环境下使用npm脚本
  } else {
    args.push(path.join(backendPath, 'dist/main.js'));
  }

  console.log('启动NestJS后端...');
  console.log('工作目录:', backendPath);
  console.log('命令:', nodePath, args.join(' '));

  // 生产环境直接运行node命令
  if (!isDev) {
    nestjsProcess = spawn('node', args, {
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'production',
      },
      cwd: path.dirname(args[0]),
    });
  }

  if (nestjsProcess) {
    nestjsProcess.on('error', (err: Error) => {
      console.error('NestJS启动失败:', err);
    });

    nestjsProcess.on('exit', (code: number | null) => {
      console.log(`NestJS进程退出,代码: ${code}`);
      if (mainWindow && code !== 0 && code !== null) {
        dialog.showErrorBox('NestJS后端错误', `后端服务异常退出,代码: ${code}`);
      }
    });

    // 等待后端启动
    console.log('等待NestJS启动...');
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log('NestJS后端已启动');
  } else {
    // 开发环境提示用户手动启动后端
    console.warn('开发环境: 请手动启动后端服务 (cd backend && npm run start:dev)');
  }
}

// 创建主窗口
function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 1200,
    minHeight: 800,
    show: false,
    backgroundColor: '#1e1e1e',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webSecurity: true,
    },
    icon: path.join(__dirname, '../assets/icon.png'),
  });

  // 开发环境加载dev server,生产环境加载打包后的文件
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../frontend/dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // 阻止新窗口打开
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// 注册IPC处理器
function registerIPCHandlers(): void {
  // 选择目录
  ipcMain.handle('select-directory', async () => {
    const result = await dialog.showOpenDialog(mainWindow!, {
      properties: ['openDirectory', 'createDirectory'],
      title: '选择目录',
    });
    return result.filePaths[0] || null;
  });

  // 选择文件
  ipcMain.handle('select-file', async (_, options: Electron.OpenDialogOptions) => {
    const result = await dialog.showOpenDialog(mainWindow!, {
      ...options,
      properties: options.properties || ['openFile'],
    });
    return result.filePaths[0] || null;
  });

  // 保存文件对话框
  ipcMain.handle('show-save-dialog', async (_, options: Electron.SaveDialogOptions) => {
    const result = await dialog.showSaveDialog(mainWindow!, options);
    return result.filePath || null;
  });

  // 消息对话框
  ipcMain.handle('show-message-box', async (_, options: Electron.MessageBoxOptions) => {
    const result = await dialog.showMessageBox(mainWindow!, options);
    return result;
  });

  // 错误对话框
  ipcMain.handle('show-error-box', async (_, title: string, content: string) => {
    await dialog.showErrorBox(title, content);
  });

  // 打开外部链接
  ipcMain.handle('open-external', async (_, url: string) => {
    await shell.openExternal(url);
  });

  // 在默认浏览器中打开URL
  ipcMain.handle('open-url-in-browser', async (_, url: string) => {
    await shell.openExternal(url);
  });

  // 获取应用版本
  ipcMain.handle('get-app-version', async () => {
    return app.getVersion();
  });

  // 获取应用路径
  ipcMain.handle(
    'get-app-path',
    async (_, name: 'home' | 'appData' | 'userData' | 'temp' | 'documents') => {
      return app.getPath(name);
    }
  );
}

// 应用启动
app.whenReady().then(async () => {
  console.log('AI编程平台启动中...');
  console.log('环境:', process.env.NODE_ENV || 'development');
  console.log('版本:', app.getVersion());
  console.log('Electron:', process.versions.electron);
  console.log('Node.js:', process.versions.node);
  console.log('平台:', process.platform);
  console.log('架构:', process.arch);

  // 注册IPC处理器
  registerIPCHandlers();

  // 启动NestJS后端
  await startNestJS();

  // 创建主窗口
  createWindow();
});

// 所有窗口关闭时退出应用(macOS除外)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// macOS点击Dock图标时重新创建窗口
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 应用退出前清理
app.on('before-quit', () => {
  console.log('应用退出前清理...');

  // 停止NestJS后端
  if (nestjsProcess) {
    console.log('停止NestJS后端...');
    nestjsProcess.kill();
    nestjsProcess = null;
    console.log('NestJS后端已停止');
  }
});

// 处理未捕获的异常
process.on('uncaughtException', (error: Error) => {
  console.error('未捕获的异常:', error);

  if (mainWindow) {
    dialog.showErrorBox('未捕获的异常', error.message);
  }
});

process.on('unhandledRejection', (reason: any) => {
  console.error('未处理的Promise拒绝:', reason);
});
