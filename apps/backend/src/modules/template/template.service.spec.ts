import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TemplateService } from './template.service';
import { Template, TemplateType, TemplateCategory } from '../../entities/template.entity';
import { NotFoundException } from '@nestjs/common';

describe('TemplateService', () => {
  let service: TemplateService;
  let repository: Repository<Template>;

  const mockTemplate: Template = {
    id: 'test-id',
    name: 'Entity Template',
    displayName: 'Entity Template',
    type: TemplateType.SPRING_BOOT,
    category: TemplateCategory.ENTITY,
    content: 'public class {{className}} {}',
    description: 'Spring Boot Entity template',
    example: JSON.stringify({
      packageName: 'com.example',
      className: 'User',
      fields: [],
    }),
    variables: ['className', 'packageName'],
    status: 'active',
    source: 'system',
    version: 1,
    author: 'System',
    tags: ['spring-boot', 'entity'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplateService,
        {
          provide: getRepositoryToken(Template),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TemplateService>(TemplateService);
    repository = module.get<Repository<Template>>(getRepositoryToken(Template));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new template', async () => {
      const createDto: any = {
        name: 'Controller Template',
        displayName: 'Controller Template',
        type: TemplateType.SPRING_BOOT,
        category: TemplateCategory.CONTROLLER,
        content: 'public class {{className}}Controller {}',
        description: 'Spring Boot Controller template',
      };

      mockRepository.create.mockReturnValue(mockTemplate);
      mockRepository.save.mockResolvedValue(mockTemplate);

      const result = await service.create(createDto);

      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        example: JSON.stringify({}),
      });
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(mockTemplate);
    });
  });

  describe('findAll', () => {
    it('should return paginated templates', async () => {
      const mockTemplates = [mockTemplate];
      mockRepository.getManyAndCount.mockResolvedValue([mockTemplates, 1]);

      const query = {
        pageNum: 1,
        pageSize: 10,
      };

      const result = await service.findAll(query);

      expect(result.list).toEqual(mockTemplates);
      expect(result.total).toBe(1);
    });

    it('should filter by type', async () => {
      const query = {
        type: TemplateType.SPRING_BOOT,
        pageNum: 1,
        pageSize: 10,
      };

      mockRepository.getManyAndCount.mockResolvedValue([[mockTemplate], 1]);

      await service.findAll(query);

      expect(mockRepository.andWhere).toHaveBeenCalledWith('template.type = :type', {
        type: TemplateType.SPRING_BOOT,
      });
    });

    it('should filter by category', async () => {
      const query = {
        category: TemplateCategory.ENTITY,
        pageNum: 1,
        pageSize: 10,
      };

      mockRepository.getManyAndCount.mockResolvedValue([[mockTemplate], 1]);

      await service.findAll(query);

      expect(mockRepository.andWhere).toHaveBeenCalledWith('template.category = :category', {
        category: TemplateCategory.ENTITY,
      });
    });
  });

  describe('findOne', () => {
    it('should return a template by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockTemplate);

      const result = await service.findOne('test-id');

      expect(result).toEqual(mockTemplate);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
    });

    it('should throw NotFoundException if template not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a template', async () => {
      const updateDto: any = {
        name: 'Updated Template',
      };

      mockRepository.findOne.mockResolvedValue(mockTemplate);
      mockRepository.save.mockResolvedValue({ ...mockTemplate, ...updateDto });

      const result = await service.update('test-id', updateDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
      expect(result.name).toBe('Updated Template');
    });
  });

  describe('remove', () => {
    it('should delete a template', async () => {
      mockRepository.findOne.mockResolvedValue(mockTemplate);
      mockRepository.remove.mockResolvedValue(mockTemplate);

      await service.remove('test-id');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
      expect(repository.remove).toHaveBeenCalledWith(mockTemplate);
    });
  });

  describe('render', () => {
    it('should render template with data', async () => {
      mockRepository.findOne.mockResolvedValue(mockTemplate);

      const result = await service.render({
        templateId: 'test-id',
        context: {
          className: 'User',
          packageName: 'com.example',
        },
      });

      expect(result).toContain('User');
    });
  });
});
