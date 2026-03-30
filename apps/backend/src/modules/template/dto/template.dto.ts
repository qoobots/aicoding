import { IsString, IsEnum, IsNotEmpty, IsOptional, IsArray, IsInt, Min } from 'class-validator';
import { TemplateType, TemplateCategory } from '../../../entities/template.entity';

export class CreateTemplateDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  displayName!: string;

  @IsEnum(TemplateType)
  type!: TemplateType;

  @IsEnum(TemplateCategory)
  category!: TemplateCategory;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsString()
  @IsOptional()
  example?: string;

  @IsOptional()
  variables?: Record<string, any>;

  @IsString()
  @IsOptional()
  status?: 'active' | 'archived' | 'deleted';

  @IsString()
  @IsOptional()
  source?: 'system' | 'user';

  @IsString()
  @IsOptional()
  author?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}

export class UpdateTemplateDto {
  @IsString()
  @IsOptional()
  displayName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  example?: string;

  @IsOptional()
  variables?: Record<string, any>;

  @IsString()
  @IsOptional()
  status?: 'active' | 'archived' | 'deleted';

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}

export class QueryTemplateDto {
  @IsString()
  @IsOptional()
  type?: TemplateType;

  @IsString()
  @IsOptional()
  category?: TemplateCategory;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  keyword?: string;

  @IsString()
  @IsOptional()
  source?: 'system' | 'user';

  @IsInt()
  @Min(1)
  @IsOptional()
  pageNum?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  pageSize?: number;
}

export class RenderTemplateDto {
  @IsString()
  @IsNotEmpty()
  templateId!: string;

  @IsOptional()
  context?: Record<string, any>;
}
