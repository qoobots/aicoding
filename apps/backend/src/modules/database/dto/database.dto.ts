import { IsString, IsNumber, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';

export enum DatabaseType {
  MYSQL = 'mysql',
  POSTGRESQL = 'postgresql',
  ORACLE = 'oracle',
  SQLSERVER = 'sqlserver',
}

export class CreateDatabaseConnectionDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  host!: string;

  @IsNumber()
  @IsNotEmpty()
  port!: number;

  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsNotEmpty()
  database!: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['mysql', 'postgresql', 'oracle', 'sqlserver'], { message: '无效的数据库类型' })
  type!: string;
}

export class UpdateDatabaseConnectionDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  host?: string;

  @IsNumber()
  @IsOptional()
  port?: number;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  database?: string;

  @IsString()
  @IsOptional()
  @IsEnum(['mysql', 'postgresql', 'oracle', 'sqlserver'], { message: '无效的数据库类型' })
  type?: string;
}

export class TestConnectionDto {
  @IsString()
  @IsNotEmpty()
  host!: string;

  @IsNumber()
  @IsNotEmpty()
  port!: number;

  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsNotEmpty()
  database!: string;

  @IsString()
  @IsOptional()
  @IsEnum(['mysql', 'postgresql', 'oracle', 'sqlserver'], { message: '无效的数据库类型' })
  type?: string;
}
