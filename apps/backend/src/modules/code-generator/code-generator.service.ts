import { Injectable, Logger } from '@nestjs/common';
import { CodeGenerateConfig } from '@shared/types';
import { JavaCodeGenerator } from './generators/java.generator';
import { VueCodeGenerator } from './generators/vue.generator';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface GeneratedCode {
  filename: string;
  path: string;
  content: string;
}

@Injectable()
export class CodeGeneratorService {
  private readonly logger = new Logger(CodeGeneratorService.name);

  /**
   * 根据数据库表生成所有代码
   */
  async generateAllCode(config: CodeGenerateConfig, tableSchema: any): Promise<GeneratedCode[]> {
    const codes: GeneratedCode[] = [];

    try {
      // 生成 Java 类
      codes.push(...this.generateJavaClasses(config, tableSchema));

      // 生成 Vue 页面
      codes.push(...this.generateVuePages(config, tableSchema));

      this.logger.log(`Generated ${codes.length} files for table: ${config.tableName}`);

      return codes;
    } catch (error) {
      this.logger.error('Failed to generate code:', error);
      throw error;
    }
  }

  /**
   * 生成 Java 类
   */
  private generateJavaClasses(config: CodeGenerateConfig, tableSchema: any): GeneratedCode[] {
    const codes: GeneratedCode[] = [];

    // Entity
    codes.push({
      filename: `${config.entityConfig.className}.java`,
      path: path.join(
        config.entityConfig.basePath,
        config.entityConfig.basePackage.replace(/\./g, '/')
      ),
      content: JavaCodeGenerator.generateEntity(
        config.tableName,
        config.tableComment || '',
        tableSchema.columns,
        config.entityConfig.basePackage,
        config.entityConfig.className
      ),
    });

    // Mapper
    codes.push({
      filename: `${config.mapperConfig.className}.java`,
      path: path.join(
        config.mapperConfig.basePath,
        config.mapperConfig.basePackage.replace(/\./g, '/')
      ),
      content: JavaCodeGenerator.generateMapper(
        `${config.entityConfig.basePackage}.${config.entityConfig.className}`,
        config.entityConfig.className,
        config.mapperConfig.basePackage,
        config.mapperConfig.className
      ),
    });

    // Mapper XML
    codes.push({
      filename: `${config.mapperConfig.className}.xml`,
      path: '/src/main/resources/' + config.mapperConfig.basePackage.replace(/\./g, '/'),
      content: JavaCodeGenerator.generateMapperXml(
        `${config.mapperConfig.basePackage}.${config.mapperConfig.className}`,
        config.tableName,
        tableSchema.columns,
        config.mapperConfig.className
      ),
    });

    // Service
    codes.push({
      filename: `${config.serviceConfig.className}.java`,
      path: path.join(
        config.serviceConfig.basePath,
        config.serviceConfig.basePackage.replace(/\./g, '/')
      ),
      content: JavaCodeGenerator.generateService(
        `${config.entityConfig.basePackage}.${config.entityConfig.className}`,
        config.entityConfig.className,
        config.serviceConfig.basePackage,
        config.serviceConfig.className
      ),
    });

    // ServiceImpl
    const implClassName = config.serviceConfig.className + 'Impl';
    codes.push({
      filename: `${implClassName}.java`,
      path: path.join(
        config.serviceConfig.basePath,
        `${config.serviceConfig.basePackage}.impl`.replace(/\./g, '/')
      ),
      content: JavaCodeGenerator.generateServiceImpl(
        `${config.entityConfig.basePackage}.${config.entityConfig.className}`,
        config.entityConfig.className,
        config.mapperConfig.basePackage,
        config.mapperConfig.className,
        config.serviceConfig.basePackage,
        config.serviceConfig.className,
        `${config.serviceConfig.basePackage}.impl`,
        implClassName
      ),
    });

    // Controller
    codes.push({
      filename: `${config.controllerConfig.className}.java`,
      path: path.join(
        config.controllerConfig.basePath,
        config.controllerConfig.basePackage.replace(/\./g, '/')
      ),
      content: JavaCodeGenerator.generateController(
        `${config.entityConfig.basePackage}.${config.entityConfig.className}`,
        config.entityConfig.className,
        config.serviceConfig.basePackage,
        config.serviceConfig.className,
        config.dtoConfig.basePackage,
        config.controllerConfig.basePackage,
        config.controllerConfig.className,
        config.tableComment || ''
      ),
    });

    // DTO
    codes.push({
      filename: `${config.dtoConfig.className}.java`,
      path: path.join(config.dtoConfig.basePath, config.dtoConfig.basePackage.replace(/\./g, '/')),
      content: JavaCodeGenerator.generateDTO(
        config.tableComment || '',
        tableSchema.columns,
        config.dtoConfig.basePackage,
        config.dtoConfig.className
      ),
    });

    // Request DTO
    codes.push({
      filename: `${config.dtoConfig.className.replace('DTO', 'RequestDTO')}.java`,
      path: path.join(
        config.dtoConfig.basePath,
        `${config.dtoConfig.basePackage}.request`.replace(/\./g, '/')
      ),
      content: JavaCodeGenerator.generateDTO(
        config.tableComment || '',
        tableSchema.columns,
        `${config.dtoConfig.basePackage}.request`,
        config.dtoConfig.className.replace('DTO', 'RequestDTO')
      ),
    });

    // VO
    codes.push({
      filename: `${config.voConfig.className}.java`,
      path: path.join(config.voConfig.basePath, config.voConfig.basePackage.replace(/\./g, '/')),
      content: JavaCodeGenerator.generateVO(
        config.tableComment || '',
        tableSchema.columns,
        config.voConfig.basePackage,
        config.voConfig.className
      ),
    });

    return codes;
  }

  /**
   * 生成 Vue 页面
   */
  private generateVuePages(config: CodeGenerateConfig, tableSchema: any): GeneratedCode[] {
    const codes: GeneratedCode[] = [];

    const baseName = config.entityConfig.className.replace('Entity', '');

    // 实体类型定义
    codes.push({
      filename: `${baseName}.ts`,
      path: config.projectPath + config.vueConfig.basePath + config.vueConfig.routePath,
      content: VueCodeGenerator.generateType(
        config.tableName,
        config.tableComment || '',
        tableSchema.columns,
        baseName
      ),
    });

    // 列表页
    const listPage = config.vueConfig.files.find((f) => f.type === 'list');
    if (listPage) {
      codes.push({
        filename: listPage.fileName,
        path: config.projectPath + config.vueConfig.basePath + listPage.path,
        content: VueCodeGenerator.generateListPage(
          listPage.fileName,
          config.tableComment || '',
          tableSchema.columns,
          config.vueConfig.routePath
        ),
      });
    }

    // 新增页
    const createPage = config.vueConfig.files.find((f) => f.type === 'create');
    if (createPage) {
      codes.push({
        filename: createPage.fileName,
        path: config.projectPath + config.vueConfig.basePath + createPage.path,
        content: VueCodeGenerator.generateCreatePage(
          createPage.fileName,
          config.tableComment || '',
          tableSchema.columns
        ),
      });
    }

    // 编辑页
    const editPage = config.vueConfig.files.find((f) => f.type === 'edit');
    if (editPage) {
      codes.push({
        filename: editPage.fileName,
        path: config.projectPath + config.vueConfig.basePath + editPage.path,
        content: VueCodeGenerator.generateEditPage(
          editPage.fileName,
          config.tableComment || '',
          tableSchema.columns,
          config.vueConfig.routePath
        ),
      });
    }

    // 详情页
    const detailPage = config.vueConfig.files.find((f) => f.type === 'detail');
    if (detailPage) {
      codes.push({
        filename: detailPage.fileName,
        path: config.projectPath + config.vueConfig.basePath + detailPage.path,
        content: VueCodeGenerator.generateDetailPage(
          detailPage.fileName,
          config.tableComment || '',
          tableSchema.columns
        ),
      });
    }

    return codes;
  }

  /**
   * 将生成的代码写入文件
   */
  async writeCodes(projectPath: string, codes: GeneratedCode[]): Promise<void> {
    for (const code of codes) {
      const fullPath = path.join(projectPath, code.path, code.filename);
      const dir = path.dirname(fullPath);

      try {
        // 确保目录存在
        await fs.mkdir(dir, { recursive: true });

        // 写入文件
        await fs.writeFile(fullPath, code.content, 'utf-8');
        this.logger.log(`Created: ${fullPath}`);
      } catch (error) {
        this.logger.error(`Failed to create ${fullPath}:`, error);
        throw error;
      }
    }
  }
}
