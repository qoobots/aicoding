import { IsString, IsOptional, IsEnum, IsNotEmpty, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export enum ProjectType {
  SPRING_BOOT = 'spring-boot',
  SPRING_CLOUD = 'spring-cloud',
}

export enum ProjectStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
}

export class DatabaseConfig {
  type!: string;
  host?: string;
  port?: number;
  name?: string;
}

export class ProjectConfig {
  includeLombok?: boolean;
  includeSwagger?: boolean;
  includeMybatis?: boolean;
  includeRedis?: boolean;
}

export class AISettings {
  provider?: string;
  model?: string;
  apiKey?: string;
  temperature?: number;
  maxTokens?: number;
}

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ProjectType)
  @IsOptional()
  type?: ProjectType;

  @IsString()
  @IsOptional()
  packageName?: string;

  @IsObject()
  @IsOptional()
  @Type(() => ProjectConfig)
  config?: ProjectConfig;

  @IsObject()
  @IsOptional()
  @Type(() => DatabaseConfig)
  database?: DatabaseConfig;

  @IsObject()
  @IsOptional()
  @Type(() => AISettings)
  aiSettings?: AISettings;
}

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ProjectType)
  @IsOptional()
  type?: ProjectType;

  @IsString()
  @IsOptional()
  packageName?: string;

  @IsObject()
  @IsOptional()
  @Type(() => ProjectConfig)
  config?: ProjectConfig;

  @IsObject()
  @IsOptional()
  @Type(() => DatabaseConfig)
  database?: DatabaseConfig;

  @IsObject()
  @IsOptional()
  @Type(() => AISettings)
  aiSettings?: AISettings;
}

export class UpdateProjectStatusDto {
  @IsEnum(ProjectStatus)
  status!: ProjectStatus;
}

export class QueryProjectDto {
  @IsString()
  @IsOptional()
  keyword?: string;

  @IsEnum(ProjectType)
  @IsOptional()
  type?: ProjectType;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsString()
  @IsOptional()
  sortBy?: 'createdAt' | 'updatedAt' | 'name';

  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';
}
