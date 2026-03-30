'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const electron_1 = require('electron');
const path_1 = __importDefault(require('path'));
const child_process_1 = require('child_process');
let nestjsProcess = null;
let mainWindow = null;
async function startNestJS() {
  const isDev = process.env.NODE_ENV === 'development';
  const backendPath = isDev
    ? path_1.default.join(__dirname, '../../backend')
    : path_1.default.join(__dirname, '../backend');
  const nodePath = process.execPath;
  const args = [];
  if (isDev) {
    args.push('npm', 'run', 'start:dev');
  } else {
    args.push(path_1.default.join(backendPath, 'dist/main.js'));
  }
  console.log('启动NestJS后端...');
  console.log('工作目录:', backendPath);
  console.log('命令:', nodePath, args.join(' '));
  if (!isDev) {
    nestjsProcess = (0, child_process_1.spawn)('node', args, {
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'production',
      },
      cwd: path_1.default.dirname(args[0]),
    });
  }
  if (nestjsProcess) {
    nestjsProcess.on('error', (err) => {
      console.error('NestJS启动失败:', err);
    });
    nestjsProcess.on('exit', (code) => {
      console.log(`NestJS进程退出,代码: ${code}`);
      if (mainWindow && code !== 0 && code !== null) {
        electron_1.dialog.showErrorBox('NestJS后端错误', `后端服务异常退出,代码: ${code}`);
      }
    });
    console.log('等待NestJS启动...');
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log('NestJS后端已启动');
  } else {
    console.warn('开发环境: 请手动启动后端服务 (cd backend && npm run start:dev)');
  }
}
function createWindow() {
  mainWindow = new electron_1.BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 1200,
    minHeight: 800,
    show: false,
    backgroundColor: '#1e1e1e',
    webPreferences: {
      preload: path_1.default.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webSecurity: true,
    },
    icon: path_1.default.join(__dirname, '../assets/icon.png'),
  });
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path_1.default.join(__dirname, '../frontend/dist/index.html'));
  }
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    electron_1.shell.openExternal(url);
    return { action: 'deny' };
  });
}
function registerIPCHandlers() {
  electron_1.ipcMain.handle('select-directory', async () => {
    const result = await electron_1.dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory', 'createDirectory'],
      title: '选择目录',
    });
    return result.filePaths[0] || null;
  });
  electron_1.ipcMain.handle('select-file', async (_, options) => {
    const result = await electron_1.dialog.showOpenDialog(mainWindow, {
      ...options,
      properties: options.properties || ['openFile'],
    });
    return result.filePaths[0] || null;
  });
  electron_1.ipcMain.handle('show-save-dialog', async (_, options) => {
    const result = await electron_1.dialog.showSaveDialog(mainWindow, options);
    return result.filePath || null;
  });
  electron_1.ipcMain.handle('show-message-box', async (_, options) => {
    const result = await electron_1.dialog.showMessageBox(mainWindow, options);
    return result;
  });
  electron_1.ipcMain.handle('show-error-box', async (_, title, content) => {
    await electron_1.dialog.showErrorBox(title, content);
  });
  electron_1.ipcMain.handle('open-external', async (_, url) => {
    await electron_1.shell.openExternal(url);
  });
  electron_1.ipcMain.handle('open-url-in-browser', async (_, url) => {
    await electron_1.shell.openExternal(url);
  });
  electron_1.ipcMain.handle('get-app-version', async () => {
    return electron_1.app.getVersion();
  });
  electron_1.ipcMain.handle('get-app-path', async (_, name) => {
    return electron_1.app.getPath(name);
  });
}
electron_1.app.whenReady().then(async () => {
  console.log('AI编程平台启动中...');
  console.log('环境:', process.env.NODE_ENV || 'development');
  console.log('版本:', electron_1.app.getVersion());
  console.log('Electron:', process.versions.electron);
  console.log('Node.js:', process.versions.node);
  console.log('平台:', process.platform);
  console.log('架构:', process.arch);
  registerIPCHandlers();
  await startNestJS();
  createWindow();
});
electron_1.app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    electron_1.app.quit();
  }
});
electron_1.app.on('activate', () => {
  if (electron_1.BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
electron_1.app.on('before-quit', () => {
  console.log('应用退出前清理...');
  if (nestjsProcess) {
    console.log('停止NestJS后端...');
    nestjsProcess.kill();
    nestjsProcess = null;
    console.log('NestJS后端已停止');
  }
});
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
  if (mainWindow) {
    electron_1.dialog.showErrorBox('未捕获的异常', error.message);
  }
});
process.on('unhandledRejection', (reason) => {
  console.error('未处理的Promise拒绝:', reason);
});
//# sourceMappingURL=main.js.map
