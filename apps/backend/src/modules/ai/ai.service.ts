import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface AIProvider {
  name: string;
  generateCode(prompt: string, context?: any): Promise<string>;
  chat(messages: ChatMessage[]): Promise<string>;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface CodeGenerationRequest {
  language: string;
  framework?: string;
  description: string;
  context?: string;
  template?: string;
}

export interface CodeGenerationResponse {
  code: string;
  explanation?: string;
  language: string;
}

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private providers: Map<string, AIProvider>;
  private defaultProvider: string;

  constructor(private configService: ConfigService) {
    this.providers = new Map();
    this.defaultProvider = this.configService.get('AI_DEFAULT_PROVIDER', 'openai');
  }

  async generateCode(request: CodeGenerationRequest): Promise<CodeGenerationResponse> {
    const provider = this.providers.get(this.defaultProvider);

    if (!provider) {
      throw new Error(`AI provider '${this.defaultProvider}' not found`);
    }

    const prompt = this.buildPrompt(request);
    const code = await provider.generateCode(prompt, request.context);

    return {
      code,
      language: request.language,
      explanation: this.generateExplanation(code),
    };
  }

  async chat(messages: ChatMessage[]): Promise<string> {
    const provider = this.providers.get(this.defaultProvider);

    if (!provider) {
      throw new Error(`AI provider '${this.defaultProvider}' not found`);
    }

    return await provider.chat(messages);
  }

  registerProvider(provider: AIProvider): void {
    this.providers.set(provider.name, provider);
    this.logger.log(`Registered AI provider: ${provider.name}`);
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  private buildPrompt(request: CodeGenerationRequest): string {
    const { language, framework, description, context, template } = request;

    let prompt = `请生成${language}代码：\n`;
    prompt += `描述：${description}\n`;

    if (framework) {
      prompt += `框架：${framework}\n`;
    }

    if (context) {
      prompt += `上下文：\n${context}\n`;
    }

    if (template) {
      prompt += `参考模板：\n${template}\n`;
    }

    prompt += `\n要求：\n`;
    prompt += `- 代码格式规范\n`;
    prompt += `- 添加必要的注释\n`;
    prompt += `- 遵循最佳实践\n`;
    prompt += `- 包含错误处理\n`;

    return prompt;
  }

  private generateExplanation(code: string): string {
    return `已生成代码，代码长度：${code.length}字符`;
  }
}
