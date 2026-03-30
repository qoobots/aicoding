import {
  IsString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsBoolean,
  IsInt,
  Min,
} from 'class-validator';
import {
  FieldType,
  RelationshipType,
  Field,
  Relationship,
  Index,
} from '../../../entities/entity.entity';
import { EntityModel } from '../../../entities/entity.entity';

export class CreateEntityDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  displayName!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  tableName!: string;

  @IsArray()
  @IsNotEmpty()
  fields!: Field[];

  @IsArray()
  @IsOptional()
  relationships?: Relationship[];

  @IsArray()
  @IsOptional()
  indexes?: Index[];

  @IsString()
  @IsNotEmpty()
  package!: string;
}

export class UpdateEntityDto {
  @IsString()
  @IsOptional()
  displayName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  tableName?: string;

  @IsArray()
  @IsOptional()
  fields?: Field[];

  @IsArray()
  @IsOptional()
  relationships?: Relationship[];

  @IsArray()
  @IsOptional()
  indexes?: Index[];
}

export class QueryEntityDto {
  @IsString()
  @IsOptional()
  projectId?: string;

  @IsString()
  @IsOptional()
  keyword?: string;

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

export class GenerateScriptDto {
  @IsArray()
  @IsNotEmpty()
  entities!: EntityModel[];

  @IsEnum(['mysql', 'postgresql', 'sqlite'])
  @IsNotEmpty()
  databaseType!: string;
}

export class FieldDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  displayName!: string;

  @IsEnum(FieldType)
  @IsNotEmpty()
  type!: FieldType;

  @IsOptional()
  length?: number;

  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;

  @IsBoolean()
  @IsOptional()
  isUnique?: boolean;

  @IsOptional()
  defaultValue?: any;

  @IsString()
  @IsOptional()
  comment?: string;
}

export class RelationshipDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(RelationshipType)
  @IsNotEmpty()
  type!: RelationshipType;

  @IsString()
  @IsNotEmpty()
  targetEntity!: string;

  @IsString()
  @IsOptional()
  foreignKey?: string;

  @IsString()
  @IsOptional()
  inverseSide?: string;

  @IsString()
  @IsOptional()
  comment?: string;
}

export class IndexDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsArray()
  @IsNotEmpty()
  columns!: string[];

  @IsBoolean()
  @IsOptional()
  unique?: boolean;

  @IsString()
  @IsOptional()
  comment?: string;
}
