/**
 * 数据库错误处理器
 */
export class DatabaseErrorHandler {
  /**
   * 解析数据库错误并返回用户友好的消息
   */
  static parseError(error: any): string {
    const code = error.code;
    const message = error.message || '';

    // MySQL 错误码
    if (code) {
      switch (code) {
        case 'ECONNREFUSED':
          return '数据库连接被拒绝，请检查数据库服务是否启动';
        case 'ER_ACCESS_DENIED_ERROR':
          return '用户名或密码错误，请检查凭据';
        case 'ER_BAD_DB_ERROR':
          return '数据库不存在，请检查数据库名称';
        case 'ENOTFOUND':
          return '无法找到数据库主机，请检查主机地址';
        case 'ETIMEDOUT':
          return '连接超时，请检查网络连接和防火墙设置';
        case 'EHOSTUNREACH':
          return '主机不可达，请检查网络连接';
        default:
          return this.parseGenericError(error);
      }
    }

    return this.parseGenericError(error);
  }

  /**
   * 解析通用错误
   */
  private static parseGenericError(error: any): string {
    const message = error.message || '';

    // PostgreSQL 错误
    if (message.includes('password authentication failed')) {
      return '用户名或密码错误，请检查凭据';
    }
    if (message.includes('database') && message.includes('does not exist')) {
      return '数据库不存在，请检查数据库名称';
    }
    if (message.includes('connection refused')) {
      return '数据库连接被拒绝，请检查数据库服务是否启动';
    }
    if (message.includes('timeout') || message.includes('timed out')) {
      return '连接超时，请检查网络连接和防火墙设置';
    }

    // Oracle 错误
    if (message.includes('ORA-01017')) {
      return '用户名或密码错误，请检查凭据';
    }
    if (message.includes('ORA-12154')) {
      return 'TNS 服务名无法解析，请检查连接配置';
    }

    // 通用错误
    if (message.includes('ENOTFOUND') || message.includes('getaddrinfo')) {
      return '无法找到数据库主机，请检查主机地址';
    }

    // 返回原始错误（截断过长的消息）
    return message.length > 100 ? message.substring(0, 100) + '...' : message;
  }

  /**
   * 检查错误是否可重试
   */
  static isRetryable(error: any): boolean {
    const code = error.code;

    // 网络相关的错误可以重试
    const retryableCodes = ['ETIMEDOUT', 'ECONNRESET', 'EPIPE', 'ECONNREFUSED'];
    return retryableCodes.includes(code);
  }
}
