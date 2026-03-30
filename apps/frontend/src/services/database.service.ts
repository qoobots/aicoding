import axios, { AxiosInstance } from 'axios';
import type { DatabaseConnection, TableSchema, ColumnSchema } from '@shared/types';

class DatabaseService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: '/api/database',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        console.error('API请求错误:', error);
        return Promise.reject(error);
      }
    );
  }

  // 获取所有数据库连接
  async getConnections(): Promise<any> {
    return this.client.get('/connections');
  }

  // 根据ID获取数据库连接
  async getConnectionById(id: string): Promise<any> {
    return this.client.get(`/connections/${id}`);
  }

  // 创建数据库连接
  async createConnection(data: Partial<DatabaseConnection>): Promise<any> {
    return this.client.post('/connections', data);
  }

  // 更新数据库连接
  async updateConnection(id: string, data: Partial<DatabaseConnection>): Promise<any> {
    return this.client.put(`/connections/${id}`, data);
  }

  // 删除数据库连接
  async deleteConnection(id: string): Promise<any> {
    return this.client.delete(`/connections/${id}`);
  }

  // 测试数据库连接
  async testConnection(id: string): Promise<any> {
    return this.client.post(`/connections/${id}/test`);
  }

  // 获取数据库所有表
  async getTables(id: string): Promise<any> {
    return this.client.get(`/connections/${id}/tables`);
  }

  // 获取表结构
  async getTableSchema(id: string, tableName: string): Promise<any> {
    return this.client.get(`/connections/${id}/tables/${tableName}/schema`);
  }
}

export const databaseService = new DatabaseService();
