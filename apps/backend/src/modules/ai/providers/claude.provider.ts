import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { AIProvider, ChatMessage } from '../ai.service';

interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ClaudeResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  model: string;
  stop_reason: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

@Injectable()
export class ClaudeProvider implements AIProvider {
  name = 'claude';
  private apiKey: string;
  private baseURL: string;
  private model: string;
  private httpClient: AxiosInstance;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get('CLAUDE_API_KEY', '');
    this.baseURL = this.configService.get('CLAUDE_BASE_URL', 'https://api.anthropic.com/v1');
    this.model = this.configService.get('CLAUDE_MODEL', 'claude-3-opus-20240229');

    this.httpClient = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      timeout: 60000,
    });
  }

  async generateCode(prompt: string, context?: any): Promise<string> {
    try {
      const systemPrompt = this.buildSystemPrompt(context);
      const messages: ClaudeMessage[] = [{ role: 'user', content: systemPrompt + '\n\n' + prompt }];

      const response = await this.httpClient.post<ClaudeResponse>('/messages', {
        model: this.model,
        max_tokens: 4000,
        messages: messages,
      });

      return response.data.content[0].text || '';
    } catch (error: any) {
      throw new Error(`Claude API error: ${error.message}`);
    }
  }

  async chat(messages: ChatMessage[]): Promise<string> {
    try {
      const claudeMessages: ClaudeMessage[] = messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }));

      const systemMessage = messages.find((m) => m.role === 'system');
      const requestBody: any = {
        model: this.model,
        max_tokens: 2000,
        messages: claudeMessages,
      };

      if (systemMessage) {
        requestBody.system = systemMessage.content;
      }

      const response = await this.httpClient.post<ClaudeResponse>('/messages', requestBody);

      return response.data.content[0].text || '';
    } catch (error: any) {
      throw new Error(`Claude API error: ${error.message}`);
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
      systemPrompt += `\n\n上下文信息：\n${JSON.stringify(context, null, 2)}`;
    }

    return systemPrompt;
  }
}
