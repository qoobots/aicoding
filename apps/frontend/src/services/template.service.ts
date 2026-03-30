import axios from 'axios';

const BASE_URL = '/api/templates';

export interface Template {
  id: string;
  name: string;
  displayName: string;
  type: string;
  category: string;
  description: string;
  content: string;
  example?: any;
  variables?: Record<string, any>;
  status: string;
  source: string;
  version: number;
  author?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface QueryParams {
  type?: string;
  category?: string;
  status?: string;
  keyword?: string;
  source?: string;
  pageNum?: number;
  pageSize?: number;
}

export interface PageResponse<T> {
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  code: number;
  data?: T;
  message?: string;
  error?: string;
  timestamp?: number;
}

export const templateService = {
  async getAll(params: QueryParams = {}): Promise<PageResponse<Template>> {
    const response = await axios.get<ApiResponse<PageResponse<Template>>>(BASE_URL, { params });
    return response.data.data!;
  },

  async getById(id: string): Promise<Template> {
    const response = await axios.get<ApiResponse<Template>>(`${BASE_URL}/${id}`);
    return response.data.data!;
  },

  async create(data: Partial<Template>): Promise<Template> {
    const response = await axios.post<ApiResponse<Template>>(BASE_URL, data);
    return response.data.data!;
  },

  async update(id: string, data: Partial<Template>): Promise<Template> {
    const response = await axios.put<ApiResponse<Template>>(`${BASE_URL}/${id}`, data);
    return response.data.data!;
  },

  async remove(id: string): Promise<void> {
    await axios.delete(`${BASE_URL}/${id}`);
  },

  async render(
    templateId: string,
    context: Record<string, any> = {}
  ): Promise<{ code: string; template: Template }> {
    const response = await axios.post<ApiResponse<{ code: string; template: Template }>>(
      `${BASE_URL}/render`,
      { templateId, context }
    );
    return response.data.data!;
  },

  async findByType(type: string): Promise<Template[]> {
    const response = await axios.get<ApiResponse<Template[]>>(`${BASE_URL}/type/${type}`);
    return response.data.data!;
  },

  async findByCategory(category: string): Promise<Template[]> {
    const response = await axios.get<ApiResponse<Template[]>>(`${BASE_URL}/category/${category}`);
    return response.data.data!;
  },
};
