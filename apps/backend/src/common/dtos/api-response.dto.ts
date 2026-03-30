/**
 * 统一API响应DTO
 */

export class ApiResponse<T = any> {
  code!: number;
  data?: T;
  message?: string;
  error?: string;
  timestamp: number;

  constructor(partial: Partial<ApiResponse<T>>) {
    Object.assign(this, partial);
    this.timestamp = Date.now();
  }

  static success<T>(data?: T, message?: string): ApiResponse<T> {
    return new ApiResponse({
      code: 0,
      data,
      message,
    });
  }

  static error(error: string): ApiResponse {
    return new ApiResponse({
      code: -1,
      error,
    });
  }
}

/**
 * 分页响应DTO
 */
export class PageResponse<T = any> {
  list!: T[];
  total!: number;
  pageNum!: number;
  pageSize!: number;
  totalPages!: number;

  constructor(partial: Partial<PageResponse<T>>) {
    Object.assign(this, partial);
  }

  static success<T>(list: T[], total: number, pageNum: number, pageSize: number): PageResponse<T> {
    return new PageResponse({
      list,
      total,
      pageNum,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  }
}
