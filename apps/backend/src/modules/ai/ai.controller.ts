import { Controller, Post, Body, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AIService } from './ai.service';
import { CodeGenerationRequest, CodeGenerationResponse, ChatMessage } from './ai.service';
import { ApiResponse } from '../../common/dtos/api-response.dto';

@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  async generateCode(
    @Body() request: CodeGenerationRequest
  ): Promise<ApiResponse<CodeGenerationResponse>> {
    const result = await this.aiService.generateCode(request);
    return ApiResponse.success(result);
  }

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  async chat(@Body() messages: ChatMessage[]): Promise<ApiResponse<string>> {
    const result = await this.aiService.chat(messages);
    return ApiResponse.success(result);
  }

  @Get('providers')
  @HttpCode(HttpStatus.OK)
  async getProviders(): Promise<ApiResponse<string[]>> {
    const providers = this.aiService.getAvailableProviders();
    return ApiResponse.success(providers);
  }
}
