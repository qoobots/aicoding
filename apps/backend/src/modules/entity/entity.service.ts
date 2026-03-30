import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityModel, FieldType, Field } from '../../entities/entity.entity';
import {
  CreateEntityDto,
  UpdateEntityDto,
  QueryEntityDto,
  GenerateScriptDto,
} from './dto/entity.dto';

@Injectable()
export class EntityService {
  constructor(
    @InjectRepository(EntityModel)
    private entityRepository: Repository<EntityModel>
  ) {}

  async create(createEntityDto: CreateEntityDto): Promise<EntityModel> {
    const entity = this.entityRepository.create(createEntityDto);
    return await this.entityRepository.save(entity);
  }

  async findAll(query: QueryEntityDto): Promise<{ list: EntityModel[]; total: number }> {
    const { keyword, status, pageNum = 1, pageSize = 10 } = query;

    const queryBuilder = this.entityRepository.createQueryBuilder('entity');

    if (keyword) {
      queryBuilder.andWhere(
        '(entity.name LIKE :keyword OR entity.displayName LIKE :keyword OR entity.tableName LIKE :keyword)',
        { keyword: `%${keyword}%` }
      );
    }

    if (status) {
      queryBuilder.andWhere('entity.status = :status', { status });
    }

    queryBuilder.orderBy('entity.createdAt', 'DESC');

    const [list, total] = await queryBuilder
      .skip((pageNum - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { list, total };
  }

  async findOne(id: string): Promise<EntityModel> {
    const entity = await this.entityRepository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Entity with ID '${id}' not found`);
    }
    return entity;
  }

  async update(id: string, updateEntityDto: UpdateEntityDto): Promise<EntityModel> {
    const entity = await this.findOne(id);
    Object.assign(entity, updateEntityDto);
    return await this.entityRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    entity.status = 'deleted';
    await this.entityRepository.save(entity);
  }

  async generateScript(generateScriptDto: GenerateScriptDto): Promise<string> {
    const { entities, databaseType } = generateScriptDto;
    const scripts: string[] = [];

    for (const entity of entities) {
      scripts.push(this.generateDatabaseScript(entity, databaseType));
    }

    return scripts.join('\n');
  }

  private generateDatabaseScript(entity: EntityModel, databaseType: string): string {
    switch (databaseType) {
      case 'mysql':
        return this.generateMySQLScript(entity);
      case 'postgresql':
        return this.generatePostgreSQLScript(entity);
      case 'sqlite':
        return this.generateSQLiteScript(entity);
      default:
        throw new Error(`Unsupported database type: ${databaseType}`);
    }
  }

  private generateMySQLScript(entity: EntityModel): string {
    const script: string[] = [];

    script.push(`-- Table: ${entity.tableName}`);
    script.push(`CREATE TABLE \`${entity.tableName}\` (`);

    const columns: string[] = [];

    // Primary key
    columns.push('  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT "主键ID"');

    // Fields
    entity.fields.forEach((field) => {
      const columnDefinition = this.generateMySQLColumn(field);
      columns.push(`  \`${field.name}\` ${columnDefinition}`);
    });

    // Common columns
    columns.push('  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT "创建时间"');
    columns.push(
      '  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT "更新时间"'
    );

    script.push(columns.join(',\n'));
    script.push(
      ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT="' +
        entity.description +
        '";\n'
    );

    // Indexes
    entity.indexes?.forEach((index) => {
      script.push(`-- Index: ${index.name}`);
      script.push(
        `CREATE ${index.unique ? 'UNIQUE ' : ''}INDEX \`${index.name}\` ON \`${entity.tableName}\` (\`${index.columns.join('`, `')}\`);`
      );
    });

    return script.join('\n');
  }

  private generateMySQLColumn(field: Field): string {
    let column = '';

    switch (field.type) {
      case FieldType.STRING:
        column = `VARCHAR(${field.length || 255})`;
        break;
      case FieldType.INTEGER:
        column = 'INT';
        break;
      case FieldType.LONG:
        column = 'BIGINT';
        break;
      case FieldType.DOUBLE:
        column = 'DOUBLE';
        break;
      case FieldType.BOOLEAN:
        column = 'TINYINT(1)';
        break;
      case FieldType.DATE:
        column = 'DATE';
        break;
      case FieldType.DATETIME:
        column = 'DATETIME';
        break;
      case FieldType.TEXT:
        column = 'TEXT';
        break;
      case FieldType.JSON:
        column = 'JSON';
        break;
      default:
        column = 'VARCHAR(255)';
    }

    column += field.isRequired ? ' NOT NULL' : '';
    column += field.isUnique ? ' UNIQUE' : '';

    if (field.defaultValue !== undefined && field.defaultValue !== null) {
      if (typeof field.defaultValue === 'string') {
        column += ` DEFAULT '${field.defaultValue}'`;
      } else {
        column += ` DEFAULT ${field.defaultValue}`;
      }
    }

    column += field.comment ? ` COMMENT "${field.comment}"` : '';

    return column;
  }

  private generatePostgreSQLScript(entity: EntityModel): string {
    const script: string[] = [];

    script.push(`-- Table: ${entity.tableName}`);
    script.push(`CREATE TABLE "${entity.tableName}" (`);

    const columns: string[] = [];

    columns.push('  "id" BIGSERIAL PRIMARY KEY');

    entity.fields.forEach((field) => {
      const columnDefinition = this.generatePostgreSQLColumn(field);
      columns.push(`  "${field.name}" ${columnDefinition}`);
    });

    columns.push('  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
    columns.push('  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP');

    script.push(columns.join(',\n'));
    script.push(');\n');

    script.push(`COMMENT ON TABLE "${entity.tableName}" IS '${entity.description}';`);

    entity.fields.forEach((field) => {
      if (field.comment) {
        script.push(
          `COMMENT ON COLUMN "${entity.tableName}"."${field.name}" IS '${field.comment}';`
        );
      }
    });

    return script.join('\n');
  }

  private generatePostgreSQLColumn(field: Field): string {
    let column = '';

    switch (field.type) {
      case FieldType.STRING:
        column = `VARCHAR(${field.length || 255})`;
        break;
      case FieldType.INTEGER:
        column = 'INTEGER';
        break;
      case FieldType.LONG:
        column = 'BIGINT';
        break;
      case FieldType.DOUBLE:
        column = 'DOUBLE PRECISION';
        break;
      case FieldType.BOOLEAN:
        column = 'BOOLEAN';
        break;
      case FieldType.DATE:
        column = 'DATE';
        break;
      case FieldType.DATETIME:
        column = 'TIMESTAMP';
        break;
      case FieldType.TEXT:
        column = 'TEXT';
        break;
      case FieldType.JSON:
        column = 'JSONB';
        break;
      default:
        column = 'VARCHAR(255)';
    }

    column += field.isRequired ? ' NOT NULL' : '';
    column += field.isUnique ? ' UNIQUE' : '';

    if (field.defaultValue !== undefined && field.defaultValue !== null) {
      if (typeof field.defaultValue === 'string') {
        column += ` DEFAULT '${field.defaultValue}'`;
      } else {
        column += ` DEFAULT ${field.defaultValue}`;
      }
    }

    return column;
  }

  private generateSQLiteScript(entity: EntityModel): string {
    const script: string[] = [];

    script.push(`-- Table: ${entity.tableName}`);
    script.push(`CREATE TABLE "${entity.tableName}" (`);

    const columns: string[] = [];

    columns.push('  "id" INTEGER PRIMARY KEY AUTOINCREMENT');

    entity.fields.forEach((field) => {
      const columnDefinition = this.generateSQLiteColumn(field);
      columns.push(`  "${field.name}" ${columnDefinition}`);
    });

    columns.push('  "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP');
    columns.push('  "updated_at" DATETIME DEFAULT CURRENT_TIMESTAMP');

    script.push(columns.join(',\n'));
    script.push(');\n');

    entity.indexes?.forEach((index) => {
      script.push(
        `CREATE ${index.unique ? 'UNIQUE ' : ''}INDEX "${index.name}" ON "${entity.tableName}" ("${index.columns.join('", "')}");`
      );
    });

    return script.join('\n');
  }

  private generateSQLiteColumn(field: Field): string {
    let column = '';

    switch (field.type) {
      case FieldType.STRING:
        column = `TEXT`;
        break;
      case FieldType.INTEGER:
        column = 'INTEGER';
        break;
      case FieldType.LONG:
        column = 'INTEGER';
        break;
      case FieldType.DOUBLE:
        column = 'REAL';
        break;
      case FieldType.BOOLEAN:
        column = 'INTEGER';
        break;
      case FieldType.DATE:
        column = 'TEXT';
        break;
      case FieldType.DATETIME:
        column = 'TEXT';
        break;
      case FieldType.TEXT:
        column = 'TEXT';
        break;
      case FieldType.JSON:
        column = 'TEXT';
        break;
      default:
        column = 'TEXT';
    }

    column += field.isRequired ? ' NOT NULL' : '';
    column += field.isUnique ? ' UNIQUE' : '';

    if (field.defaultValue !== undefined && field.defaultValue !== null) {
      if (typeof field.defaultValue === 'string') {
        column += ` DEFAULT '${field.defaultValue}'`;
      } else {
        column += ` DEFAULT ${field.defaultValue}`;
      }
    }

    return column;
  }
}
