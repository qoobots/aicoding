import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as Handlebars from 'handlebars';
import { Template, TemplateType, TemplateCategory } from '../../entities/template.entity';
import {
  CreateTemplateDto,
  UpdateTemplateDto,
  QueryTemplateDto,
  RenderTemplateDto,
} from './dto/template.dto';

@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);

  constructor(
    @InjectRepository(Template)
    private templateRepository: Repository<Template>
  ) {
    this.initializeSystemTemplates();
  }

  async create(createTemplateDto: CreateTemplateDto): Promise<Template> {
    const existing = await this.templateRepository.findOne({
      where: { name: createTemplateDto.name },
    });

    if (existing) {
      throw new Error(`Template with name '${createTemplateDto.name}' already exists`);
    }

    const template = this.templateRepository.create(createTemplateDto);
    return await this.templateRepository.save(template);
  }

  async findAll(query: QueryTemplateDto): Promise<{ list: Template[]; total: number }> {
    const { type, category, status, keyword, source, pageNum = 1, pageSize = 10 } = query;

    const queryBuilder = this.templateRepository.createQueryBuilder('template');

    if (type) {
      queryBuilder.andWhere('template.type = :type', { type });
    }

    if (category) {
      queryBuilder.andWhere('template.category = :category', { category });
    }

    if (status) {
      queryBuilder.andWhere('template.status = :status', { status });
    }

    if (source) {
      queryBuilder.andWhere('template.source = :source', { source });
    }

    if (keyword) {
      queryBuilder.andWhere(
        '(template.displayName LIKE :keyword OR template.description LIKE :keyword OR template.name LIKE :keyword)',
        { keyword: `%${keyword}%` }
      );
    }

    queryBuilder.orderBy('template.createdAt', 'DESC');

    const [list, total] = await queryBuilder
      .skip((pageNum - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { list, total };
  }

  async findOne(id: string): Promise<Template> {
    const template = await this.templateRepository.findOne({ where: { id } });
    if (!template) {
      throw new NotFoundException(`Template with ID '${id}' not found`);
    }
    return template;
  }

  async findOneByName(name: string): Promise<Template> {
    const template = await this.templateRepository.findOne({ where: { name } });
    if (!template) {
      throw new NotFoundException(`Template with name '${name}' not found`);
    }
    return template;
  }

  async update(id: string, updateTemplateDto: UpdateTemplateDto): Promise<Template> {
    const template = await this.findOne(id);
    Object.assign(template, updateTemplateDto);
    template.version += 1;
    return await this.templateRepository.save(template);
  }

  async remove(id: string): Promise<void> {
    const template = await this.findOne(id);
    template.status = 'deleted';
    await this.templateRepository.save(template);
  }

  async render(
    renderTemplateDto: RenderTemplateDto
  ): Promise<{ code: string; template: Template }> {
    const { templateId, context = {} } = renderTemplateDto;

    let template: Template;
    try {
      template = await this.findOne(templateId);
    } catch {
      template = await this.findOneByName(templateId);
    }

    const compiledTemplate = Handlebars.compile(template.content);
    const code = compiledTemplate(context);

    return { code, template };
  }

  async findByType(type: TemplateType): Promise<Template[]> {
    return await this.templateRepository.find({
      where: { type, status: 'active' },
      order: { createdAt: 'DESC' },
    });
  }

  async findByCategory(category: TemplateCategory): Promise<Template[]> {
    return await this.templateRepository.find({
      where: { category, status: 'active' },
      order: { createdAt: 'DESC' },
    });
  }

  // 根据模板类型获取模板（用于代码生成器）
  async findByTemplateType(templateType: string): Promise<Template | null> {
    return await this.templateRepository.findOne({
      where: { name: templateType },
    });
  }

  // 保存或更新代码生成模板
  async saveCodeTemplate(templateType: string, content: string): Promise<Template> {
    let template = await this.findByTemplateType(templateType);

    if (template) {
      // 更新现有模板
      template.content = content;
      template.version += 1;
      template = await this.templateRepository.save(template);
      this.logger.log(`Updated template: ${templateType}`);
    } else {
      // 创建新模板
      const templateData: CreateTemplateDto = {
        name: templateType,
        displayName: templateType,
        type: TemplateType.SPRING_BOOT,
        category: TemplateCategory.OTHER,
        description: `代码生成模板: ${templateType}`,
        content: content,
        source: 'user',
        author: 'user',
        status: 'active',
      };
      template = await this.create(templateData);
      this.logger.log(`Created template: ${templateType}`);
    }

    return template;
  }

  // 预览代码生成
  async previewCode(templateType: string, context: Record<string, any>): Promise<string> {
    const template = await this.findByTemplateType(templateType);

    if (!template) {
      throw new NotFoundException(`Template '${templateType}' not found`);
    }

    const compiledTemplate = Handlebars.compile(template.content);
    const code = compiledTemplate(context);

    return code;
  }

  private async initializeSystemTemplates(): Promise<void> {
    // 先初始化系统模板
    const count = await this.templateRepository.count();
    if (count === 0) {
      this.logger.log('Initializing system templates...');

      const systemTemplates = this.getSystemTemplates();

      for (const templateData of systemTemplates) {
        try {
          await this.create(templateData);
          this.logger.log(`Created template: ${templateData.name}`);
        } catch (error) {
          this.logger.warn(`Failed to create template ${templateData.name}:`, error);
        }
      }
    }

    // 然后初始化代码生成器模板
    await this.initializeCodeGeneratorTemplates();
  }

  private getSystemTemplates(): CreateTemplateDto[] {
    return [
      // Spring Boot Templates
      {
        name: 'spring-boot-entity',
        displayName: 'Spring Boot Entity',
        type: TemplateType.SPRING_BOOT,
        category: TemplateCategory.ENTITY,
        description: 'Spring Boot实体类模板',
        content: `package {{packageName}}.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

{{#if imports}}
{{#each imports}}
import {{this}};
{{/each}}
{{/if}}

{{#if annotations}}
{{#each annotations}}
{{this}}
{{/each}}
{{/if}}
@Entity
@Table(name = "{{toLowerCase className}}s")
public class {{className}} {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

{{#each fields}}
    {{#if comment}}
    /**
     * {{comment}}
     */
    {{/if}}
    @Column({{#if isRequired}}nullable = false{{/if}})
    private {{type}} {{camelCase name}};

{{/each}}
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

{{#each fields}}
    public {{type}} get{{capitalize name}}() {
        return {{camelCase name}};
    }

    public void set{{capitalize name}}({{type}} {{camelCase name}}) {
        this.{{camelCase name}} = {{camelCase name}};
    }

{{/each}}
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}`,
        example: JSON.stringify({
          packageName: 'com.example.demo',
          className: 'User',
          fields: [
            { name: 'username', type: 'String', comment: '用户名', isRequired: true },
            { name: 'email', type: 'String', comment: '邮箱', isRequired: true },
          ],
        }),
        variables: {
          packageName: { type: 'string', description: '包名' },
          className: { type: 'string', description: '类名' },
          fields: { type: 'array', description: '字段列表' },
        },
        source: 'system',
        author: 'system',
        tags: ['spring-boot', 'entity', 'jpa'],
      },
      {
        name: 'spring-boot-controller',
        displayName: 'Spring Boot Controller',
        type: TemplateType.SPRING_BOOT,
        category: TemplateCategory.CONTROLLER,
        description: 'Spring Boot控制器模板',
        content: `package {{packageName}}.controller;

import {{packageName}}.entity.{{className}};
import {{packageName}}.service.{{className}}Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/{{toLowerCase className}}s")
public class {{className}}Controller {
    @Autowired
    private {{className}}Service {{camelCase className}}Service;

    @PostMapping
    public ResponseEntity<{{className}}> create(@RequestBody {{className}} {{camelCase className}}) {
        {{className}} created = {{camelCase className}}Service.create({{camelCase className}});
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<{{className}}> getById(@PathVariable Long id) {
        return {{camelCase className}}Service.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<{{className}}> getAll() {
        return {{camelCase className}}Service.findAll();
    }

    @PutMapping("/{id}")
    public ResponseEntity<{{className}}> update(
        @PathVariable Long id,
        @RequestBody {{className}} {{camelCase className}}
    ) {
        {{className}} updated = {{camelCase className}}Service.update(id, {{camelCase className}});
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        {{camelCase className}}Service.delete(id);
        return ResponseEntity.noContent().build();
    }
}`,
        variables: {
          packageName: { type: 'string', description: '包名' },
          className: { type: 'string', description: '类名' },
        },
        source: 'system',
        author: 'system',
        tags: ['spring-boot', 'controller', 'rest'],
      },
      // Vue3 Templates
      {
        name: 'vue3-component',
        displayName: 'Vue3 Component',
        type: TemplateType.VUE3,
        category: TemplateCategory.COMPONENT,
        description: 'Vue3组件模板',
        content: `<template>
  <div class="{{kebabCase componentName}}">
    <!-- Your component content here -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { PropType } from 'vue';

interface Props {
  {{#each props}}
  {{name}}?: {{type}};
  {{/each}}
}

const props = withDefaults(defineProps<Props>(), {
  {{#each props}}
  {{name}}: {{#if defaultValue}}{{defaultValue}}{{else}}undefined{{/if}},
  {{/each}}
});

interface Emits {
  {{#each emits}}
  (e: '{{name}}', value: {{type}}): void;
  {{/each}}
}

const emit = defineEmits<Emits>();

const count = ref(0);

function handleIncrement() {
  count.value++;
}

onMounted(() => {
  console.log('{{componentName}} mounted');
});
</script>

<style scoped>
.{{kebabCase componentName}} {
  /* Your styles here */
}
</style>`,
        variables: {
          componentName: { type: 'string', description: '组件名称' },
          props: { type: 'array', description: 'Props定义' },
          emits: { type: 'array', description: 'Emits定义' },
        },
        source: 'system',
        author: 'system',
        tags: ['vue3', 'component', 'composition-api'],
      },
    ];
  }

  // 初始化代码生成器模板
  private async initializeCodeGeneratorTemplates(): Promise<void> {
    const codeTemplateTypes = [
      'entity',
      'mapper',
      'mapperXml',
      'service',
      'serviceImpl',
      'controller',
      'dto',
      'requestDto',
      'vo',
      'common',
      'test',
      'vueEntity',
      'vueCreate',
      'vueEdit',
      'vueDetail',
      'vueList',
    ];

    for (const templateType of codeTemplateTypes) {
      try {
        const existing = await this.findByTemplateType(templateType);
        if (!existing) {
          // 创建空的模板占位
          await this.create({
            name: templateType,
            displayName: `${templateType} Template`,
            type: TemplateType.COMMON,
            category: TemplateCategory.OTHER,
            description: `Code generator template: ${templateType}`,
            content: `// ${templateType} template placeholder\n{{packageName}}\n{{className}}\n{{tableName}}`,
            source: 'system',
            author: 'system',
            status: 'active',
          });
          this.logger.log(`Initialized code generator template: ${templateType}`);
        }
      } catch (error) {
        this.logger.warn(`Failed to initialize template ${templateType}:`, error);
      }
    }
  }
}

// Register Handlebars helpers
Handlebars.registerHelper('toLowerCase', (str: string) => {
  return str.toLowerCase();
});

Handlebars.registerHelper('capitalize', (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});

Handlebars.registerHelper('camelCase', (str: string) => {
  return str.charAt(0).toLowerCase() + str.slice(1);
});

Handlebars.registerHelper('kebabCase', (str: string) => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
});
