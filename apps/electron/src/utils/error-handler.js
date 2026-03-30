'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ErrorHandler = void 0;
const electron_1 = require('electron');
const logger_1 = require('./logger');
class ErrorHandler {
  static handle(error, context) {
    logger_1.logger.error(`[${context || 'Unknown'}] ${error.message}`);
    logger_1.logger.error(error.stack || '');
    const mainWindow = electron_1.BrowserWindow.getAllWindows()[0];
    if (mainWindow) {
      electron_1.dialog.showErrorBox(
        context || '发生错误',
        `${error.message}\n\n详细信息请查看控制台日志。`
      );
    }
  }
  static async handleErrorWithDialog(error, context, mainWindow) {
    logger_1.logger.error(`[${context || 'Unknown'}] ${error.message}`);
    if (!mainWindow) {
      mainWindow = electron_1.BrowserWindow.getAllWindows()[0];
    }
    if (mainWindow) {
      const result = await electron_1.dialog.showMessageBox(mainWindow, {
        type: 'error',
        title: context || '发生错误',
        message: error.message,
        buttons: ['关闭', '查看详情'],
        defaultId: 0,
        cancelId: 0,
      });
      if (result.response === 1) {
        await electron_1.dialog.showMessageBox(mainWindow, {
          type: 'error',
          title: '错误详情',
          message: error.stack || '无堆栈信息',
        });
      }
    }
  }
  static isNetworkError(error) {
    return (
      error.code === 'ENOTFOUND' ||
      error.code === 'ECONNREFUSED' ||
      error.code === 'ETIMEDOUT' ||
      error.code === 'ECONNRESET' ||
      error.message?.includes('Network Error')
    );
  }
  static isAuthError(error) {
    return (
      error.code === 'AUTH_FAILED' ||
      error.code === 'UNAUTHORIZED' ||
      error.message?.includes('Authentication failed')
    );
  }
}
exports.ErrorHandler = ErrorHandler;
//# sourceMappingURL=error-handler.js.map
