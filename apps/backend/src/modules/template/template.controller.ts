import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { TemplateService } from './template.service';
import { Template } from '../../entities/template.entity';
import {
  CreateTemplateDto,
  UpdateTemplateDto,
  QueryTemplateDto,
  RenderTemplateDto,
} from './dto/template.dto';
import { ApiResponse, PageResponse } from '../../common/dtos/api-response.dto';
import { IsString, IsNotEmpty } from 'class-validator';

// DTO for code generator
class SaveCodeTemplateDto {
  @IsString()
  @IsNotEmpty()
  content!: string;
}

class PreviewCodeDto {
  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsString()
  @IsNotEmpty()
  tableName!: string;

  @IsString()
  @IsNotEmpty()
  packageName!: string;
}

@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTemplateDto: CreateTemplateDto): Promise<ApiResponse<Template>> {
    const template = await this.templateService.create(createTemplateDto);
    return ApiResponse.success(template);
  }

  @Get()
  async findAll(@Query() query: QueryTemplateDto): Promise<ApiResponse<PageResponse<Template>>> {
    const { list, total } = await this.templateService.findAll(query);
    const pageNum = query.pageNum || 1;
    const pageSize = query.pageSize || 10;
    return ApiResponse.success(PageResponse.success(list, total, pageNum, pageSize));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<Template>> {
    const template = await this.templateService.findOne(id);
    return ApiResponse.success(template);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateDto
  ): Promise<ApiResponse<Template>> {
    const template = await this.templateService.update(id, updateTemplateDto);
    return ApiResponse.success(template);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.templateService.remove(id);
  }

  @Post('render')
  @HttpCode(HttpStatus.OK)
  async render(
    @Body() renderTemplateDto: RenderTemplateDto
  ): Promise<ApiResponse<{ code: string; template: Template }>> {
    const result = await this.templateService.render(renderTemplateDto);
    return ApiResponse.success(result);
  }
}

// Code Generator specific routes
@Controller('code-generator/templates')
export class CodeGeneratorTemplateController {
  private readonly logger = new Logger(CodeGeneratorTemplateController.name);

  constructor(private readonly templateService: TemplateService) {}

  // 获取代码生成模板
  @Get(':type')
  async getTemplate(@Param('type') type: string): Promise<ApiResponse<{ content: string }>> {
    const template = await this.templateService.findByTemplateType(type);
    if (!template) {
      return ApiResponse.error('Template not found');
    }
    return ApiResponse.success({ content: template.content });
  }

  // 保存代码生成模板
  @Put(':type')
  async saveTemplate(
    @Param('type') type: string,
    @Body() saveCodeTemplateDto: SaveCodeTemplateDto
  ): Promise<ApiResponse<void>> {
    try {
      this.logger.log(`Saving template: ${type}`);
      await this.templateService.saveCodeTemplate(type, saveCodeTemplateDto.content);
      return ApiResponse.success(undefined, 'Template saved successfully');
    } catch (error) {
      this.logger.error(`Failed to save template ${type}:`, error);
      return ApiResponse.error(`Failed to save template: ${error.message}`);
    }
  }

  // 预览生成的代码
  @Post('preview')
  async previewCode(
    @Body() previewCodeDto: PreviewCodeDto
  ): Promise<ApiResponse<{ content: string }>> {
    try {
      // 构建上下文数据
      const context = {
        tableName: previewCodeDto.tableName,
        packageName: previewCodeDto.packageName,
        className: this.tableToClassName(previewCodeDto.tableName),
        tableComment: previewCodeDto.tableName,
        fields: this.getMockFields(),
      };

      const content = await this.templateService.previewCode(previewCodeDto.type, context);
      return ApiResponse.success({ content });
    } catch (error) {
      return ApiResponse.error('Failed to preview code');
    }
  }

  private tableToClassName(tableName: string): string {
    return tableName
      .split(/[_\s]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }

  private getMockFields(): Array<{ name: string; type: string; comment: string }> {
    return [
      { name: 'id', type: 'Long', comment: '主键ID' },
      { name: 'username', type: 'String', comment: '用户名' },
      { name: 'password', type: 'String', comment: '密码' },
      { name: 'email', type: 'String', comment: '邮箱' },
      { name: 'createTime', type: 'Date', comment: '创建时间' },
    ];
  }
}
