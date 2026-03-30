/**
 * 错误处理工具
 */

import { dialog, BrowserWindow } from 'electron';
import { logger } from './logger';

export class ErrorHandler {
  static handle(error: Error, context?: string): void {
    logger.error(`[${context || 'Unknown'}] ${error.message}`);
    logger.error(error.stack || '');

    // 如果有主窗口,显示错误对话框
    const mainWindow = BrowserWindow.getAllWindows()[0];
    if (mainWindow) {
      dialog.showErrorBox(context || '发生错误', `${error.message}\n\n详细信息请查看控制台日志。`);
    }
  }

  static async handleErrorWithDialog(
    error: Error,
    context?: string,
    mainWindow?: BrowserWindow | null
  ): Promise<void> {
    logger.error(`[${context || 'Unknown'}] ${error.message}`);

    if (!mainWindow) {
      mainWindow = BrowserWindow.getAllWindows()[0];
    }

    if (mainWindow) {
      const result = await dialog.showMessageBox(mainWindow!, {
        type: 'error',
        title: context || '发生错误',
        message: error.message,
        buttons: ['关闭', '查看详情'],
        defaultId: 0,
        cancelId: 0,
      });

      if (result.response === 1) {
        // 显示详细错误信息
        await dialog.showMessageBox(mainWindow!, {
          type: 'error',
          title: '错误详情',
          message: error.stack || '无堆栈信息',
        });
      }
    }
  }

  static isNetworkError(error: any): boolean {
    return (
      error.code === 'ENOTFOUND' ||
      error.code === 'ECONNREFUSED' ||
      error.code === 'ETIMEDOUT' ||
      error.code === 'ECONNRESET' ||
      error.message?.includes('Network Error')
    );
  }

  static isAuthError(error: any): boolean {
    return (
      error.code === 'AUTH_FAILED' ||
      error.code === 'UNAUTHORIZED' ||
      error.message?.includes('Authentication failed')
    );
  }
}
