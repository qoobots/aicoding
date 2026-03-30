import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AIService } from './ai.service';
import { AIController } from './ai.controller';
import { OpenAIProvider } from './providers/openai.provider';
import { ClaudeProvider } from './providers/claude.provider';

@Module({
  imports: [ConfigModule],
  controllers: [AIController],
  providers: [AIService, OpenAIProvider, ClaudeProvider],
  exports: [AIService],
})
export class AIModule implements OnModuleInit {
  constructor(
    private aiService: AIService,
    private openaiProvider: OpenAIProvider,
    private claudeProvider: ClaudeProvider
  ) {}

  onModuleInit() {
    // 注册AI提供者
    this.aiService.registerProvider(this.openaiProvider);
    this.aiService.registerProvider(this.claudeProvider);
  }
}
