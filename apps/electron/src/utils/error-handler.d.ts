import { BrowserWindow } from 'electron';
export declare class ErrorHandler {
  static handle(error: Error, context?: string): void;
  static handleErrorWithDialog(
    error: Error,
    context?: string,
    mainWindow?: BrowserWindow | null
  ): Promise<void>;
  static isNetworkError(error: any): boolean;
  static isAuthError(error: any): boolean;
}
//# sourceMappingURL=error-handler.d.ts.map
