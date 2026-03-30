import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { AIProvider, ChatMessage } from '../ai.service';

interface OpenAIChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

@Injectable()
export class OpenAIProvider implements AIProvider {
  name = 'openai';
  private apiKey: string;
  private baseURL: string;
  private model: string;
  private httpClient: AxiosInstance;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get('OPENAI_API_KEY', '');
    this.baseURL = this.configService.get('OPENAI_BASE_URL', 'https://api.openai.com/v1');
    this.model = this.configService.get('OPENAI_MODEL', 'gpt-4');

    this.httpClient = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      timeout: 60000,
    });
  }

  async generateCode(prompt: string, context?: any): Promise<string> {
    try {
      const systemPrompt = this.buildSystemPrompt(context);
      const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ];

      const response = await this.httpClient.post<OpenAIChatResponse>('/chat/completions', {
        model: this.model,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        temperature: 0.7,
        max_tokens: 4000,
      });

      return response.data.choices[0].message.content || '';
    } catch (error: any) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }

  async chat(messages: ChatMessage[]): Promise<string> {
    try {
      const response = await this.httpClient.post<OpenAIChatResponse>('/chat/completions', {
        model: this.model,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        temperature: 0.7,
        max_tokens: 2000,
      });

      return response.data.choices[0].message.content || '';
    } catch (error: any) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }

  private buildSystemPrompt(context?: any): string {
    let systemPrompt = `你是一个专业的代码生成助手，擅长生成高质量的代码。

你的任务：
1. 根据用户的需求生成规范的代码
2. 代码应该包含适当的注释和文档
3. 遵循最佳实践和设计模式
4. 包含必要的错误处理
5. 代码格式应该规范、易读

返回格式：
- 直接返回生成的代码
- 使用代码块标记（\`\`\`）包裹代码
- 不要返回额外的解释文字，除非被要求`;

    if (context) {
      systemPrompt += `\\n\\n上下文信息：\\n${JSON.stringify(context, null, 2)}`;
    }

    return systemPrompt;
  }
}
