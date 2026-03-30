import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  IsEnum,
  IsObject,
  IsArray,
} from 'class-validator';

export class CreateFileDto {
  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsString()
  @IsNotEmpty()
  path!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsInt()
  @Min(0)
  size!: number;

  @IsOptional()
  content?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class UpdateFileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  content?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class QueryFileDto {
  @IsString()
  @IsOptional()
  projectId?: string;

  @IsString()
  @IsOptional()
  path?: string;

  @IsString()
  @IsOptional()
  keyword?: string;

  @IsEnum(['file', 'folder'])
  @IsOptional()
  type?: 'file' | 'folder';

  @IsString()
  @IsOptional()
  status?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  pageNum?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  pageSize?: number;
}

export class BatchDeleteFilesDto {
  @IsString()
  @IsNotEmpty()
  @IsArray()
  fileIds!: string[];
}

export class MoveFileDto {
  @IsString()
  @IsNotEmpty()
  newPath!: string;
}

export class SearchFilesDto {
  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsString()
  @IsNotEmpty()
  keyword!: string;

  @IsString()
  @IsOptional()
  path?: string;

  @IsEnum(['name', 'content', 'all'])
  @IsOptional()
  searchIn?: 'name' | 'content' | 'all';
}

export class ImportProjectDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsString()
  @IsNotEmpty()
  package!: string;

  @IsString()
  @IsNotEmpty()
  files!: string[]; // Base64 encoded files
}
