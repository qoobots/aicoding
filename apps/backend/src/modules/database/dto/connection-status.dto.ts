/**
 * 数据库连接状态
 */
export enum ConnectionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error',
  TESTING = 'testing',
}

export interface ConnectionHealthCheck {
  status: ConnectionStatus;
  message: string;
  lastChecked: Date;
  responseTime?: number;
}

export class HealthCheckResultDto {
  status!: ConnectionStatus;
  message!: string;
  lastChecked!: Date;
  responseTime?: number;
}
