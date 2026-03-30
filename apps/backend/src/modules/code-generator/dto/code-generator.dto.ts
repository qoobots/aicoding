import { IsString, IsObject, IsNotEmpty } from 'class-validator';
import { CodeGenerateConfig, TableSchema } from '@shared/types';

export class GenerateCodeDto {
  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsString()
  @IsNotEmpty()
  tableName!: string;

  @IsObject()
  @IsNotEmpty()
  schema!: TableSchema;

  @IsObject()
  @IsNotEmpty()
  config!: CodeGenerateConfig;
}
