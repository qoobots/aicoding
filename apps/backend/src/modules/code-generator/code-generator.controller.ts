import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CodeGeneratorService } from './code-generator.service';
import { ApiResponse } from '../../common/dtos/api-response.dto';
import { GenerateCodeDto } from './dto/code-generator.dto';

@Controller('code-generator')
export class CodeGeneratorController {
  constructor(private readonly codeGeneratorService: CodeGeneratorService) {}

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  async generateCode(@Body() dto: GenerateCodeDto): Promise<ApiResponse<any>> {
    try {
      const codes = await this.codeGeneratorService.generateAllCode(dto.config, dto.schema);
      return ApiResponse.success({
        message: '代码生成成功',
        files: codes.map((c) => ({ filename: c.filename, path: c.path })),
        codes,
      });
    } catch (error: any) {
      return ApiResponse.error('代码生成失败: ' + error.message);
    }
  }

  @Post('write')
  @HttpCode(HttpStatus.OK)
  async writeCodes(@Body() body: any): Promise<ApiResponse<any>> {
    try {
      const { projectPath, codes } = body;
      await this.codeGeneratorService.writeCodes(projectPath, codes);
      return ApiResponse.success({ message: '代码写入成功' });
    } catch (error: any) {
      return ApiResponse.error('代码写入失败: ' + error.message);
    }
  }
}
