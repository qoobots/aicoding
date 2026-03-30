import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type { Project, ProjectConfig, PageResult, ApiResponse } from '@shared/types';

class ProjectService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: '/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 请求拦截器
    this.client.interceptors.request.use(
      (config) => config,
      (error) => Promise.reject(error)
    );

    // 响应拦截器
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        console.error('API请求错误:', error);
        return Promise.reject(error);
      }
    );
  }

  // 获取项目列表
  async getProjects(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<ApiResponse<PageResult<Project>>> {
    return this.client.get('/projects', { params });
  }

  // 创建项目
  async create(config: ProjectConfig): Promise<ApiResponse<Project>> {
    return this.client.post('/projects', config);
  }

  // 更新项目
  async update(id: string, data: Partial<ProjectConfig>): Promise<ApiResponse<Project>> {
    return this.client.put(`/projects/${id}`, data);
  }

  // 删除项目
  async delete(id: string): Promise<ApiResponse<void>> {
    return this.client.delete(`/projects/${id}`);
  }

  // 获取项目详情
  async getById(id: string): Promise<ApiResponse<Project>> {
    return this.client.get(`/projects/${id}`);
  }
}

export const projectService = new ProjectService();
