'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const electron_1 = require('electron');
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
  selectDirectory: () => {
    return electron_1.ipcRenderer.invoke('select-directory');
  },
  selectFile: (options) => {
    return electron_1.ipcRenderer.invoke('select-file', options);
  },
  showSaveDialog: (options) => {
    return electron_1.ipcRenderer.invoke('show-save-dialog', options);
  },
  showMessageBox: (options) => {
    return electron_1.ipcRenderer.invoke('show-message-box', options);
  },
  showErrorBox: (title, content) => {
    return electron_1.ipcRenderer.invoke('show-error-box', title, content);
  },
  openExternal: (url) => {
    return electron_1.ipcRenderer.invoke('open-external', url);
  },
  openUrlInBrowser: (url) => {
    return electron_1.ipcRenderer.invoke('open-url-in-browser', url);
  },
  getAppVersion: () => {
    return electron_1.ipcRenderer.invoke('get-app-version');
  },
  getAppPath: (name) => {
    return electron_1.ipcRenderer.invoke('get-app-path', name);
  },
  on: (channel, callback) => {
    electron_1.ipcRenderer.on(channel, (_, ...args) => callback(...args));
  },
  off: (channel, callback) => {
    electron_1.ipcRenderer.removeListener(channel, callback);
  },
  send: (channel, ...args) => {
    electron_1.ipcRenderer.send(channel, ...args);
  },
  invoke: (channel, ...args) => {
    return electron_1.ipcRenderer.invoke(channel, ...args);
  },
});
//# sourceMappingURL=preload.js.map
