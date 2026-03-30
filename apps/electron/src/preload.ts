import { contextBridge, ipcRenderer } from 'electron';

/**
 * 暴露安全的API给渲染进程
 */
contextBridge.exposeInMainWorld('electronAPI', {
  // ========== 文件操作 ==========

  /**
   * 选择目录
   */
  selectDirectory: (): Promise<string | null> => {
    return ipcRenderer.invoke('select-directory');
  },

  /**
   * 选择文件
   */
  selectFile: (options?: Electron.OpenDialogOptions): Promise<string | null> => {
    return ipcRenderer.invoke('select-file', options);
  },

  /**
   * 显示保存对话框
   */
  showSaveDialog: (options?: Electron.SaveDialogOptions): Promise<string | null> => {
    return ipcRenderer.invoke('show-save-dialog', options);
  },

  // ========== 对话框 ==========

  /**
   * 显示消息对话框
   */
  showMessageBox: (
    options: Electron.MessageBoxOptions
  ): Promise<Electron.MessageBoxReturnValue> => {
    return ipcRenderer.invoke('show-message-box', options);
  },

  /**
   * 显示错误对话框
   */
  showErrorBox: (title: string, content: string): Promise<void> => {
    return ipcRenderer.invoke('show-error-box', title, content);
  },

  // ========== 系统操作 ==========

  /**
   * 打开外部链接
   */
  openExternal: (url: string): Promise<void> => {
    return ipcRenderer.invoke('open-external', url);
  },

  /**
   * 在浏览器中打开URL
   */
  openUrlInBrowser: (url: string): Promise<void> => {
    return ipcRenderer.invoke('open-url-in-browser', url);
  },

  // ========== 应用信息 ==========

  /**
   * 获取应用版本
   */
  getAppVersion: (): Promise<string> => {
    return ipcRenderer.invoke('get-app-version');
  },

  /**
   * 获取应用路径
   */
  getAppPath: (name: 'home' | 'appData' | 'userData' | 'temp' | 'documents'): Promise<string> => {
    return ipcRenderer.invoke('get-app-path', name);
  },

  // ========== 事件监听 ==========

  /**
   * 监听事件
   */
  on: (channel: string, callback: (...args: any[]) => void): void => {
    ipcRenderer.on(channel, (_, ...args) => callback(...args));
  },

  /**
   * 移除事件监听
   */
  off: (channel: string, callback: (...args: any[]) => void): void => {
    ipcRenderer.removeListener(channel, callback);
  },

  /**
   * 发送消息到主进程
   */
  send: (channel: string, ...args: any[]): void => {
    ipcRenderer.send(channel, ...args);
  },

  /**
   * 调用主进程方法
   */
  invoke: (channel: string, ...args: any[]): Promise<any> => {
    return ipcRenderer.invoke(channel, ...args);
  },
});

/**
 * TypeScript类型定义
 */
export type ElectronAPI = typeof electronAPI;
