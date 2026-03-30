import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityService } from './entity.service';
import { EntityModel, FieldType } from '../../entities/entity.entity';
import { NotFoundException } from '@nestjs/common';

describe('EntityService', () => {
  let service: EntityService;
  let repository: Repository<EntityModel>;

  const mockEntity: EntityModel = {
    id: 'test-id',
    name: 'User',
    displayName: 'User',
    tableName: 'users',
    package: 'com.example.entity',
    description: 'User entity',
    fields: [
      {
        name: 'username',
        displayName: 'Username',
        type: FieldType.STRING,
        length: 255,
        isRequired: true,
        isUnique: true,
      },
    ],
    indexes: [],
    status: 'active',
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
        EntityService,
        {
          provide: getRepositoryToken(EntityModel),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EntityService>(EntityService);
    repository = module.get<Repository<EntityModel>>(getRepositoryToken(EntityModel));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new entity', async () => {
      const createDto = {
        name: 'Product',
        displayName: 'Product',
        tableName: 'products',
        package: 'com.example.entity',
        fields: [],
        indexes: [],
      };

      mockRepository.create.mockReturnValue(mockEntity);
      mockRepository.save.mockResolvedValue(mockEntity);

      const result = await service.create(createDto);

      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(mockEntity);
    });
  });

  describe('findAll', () => {
    it('should return paginated entities', async () => {
      const mockEntities = [mockEntity];
      mockRepository.getManyAndCount.mockResolvedValue([mockEntities, 1]);

      const query = {
        pageNum: 1,
        pageSize: 10,
      };

      const result = await service.findAll(query);

      expect(result.list).toEqual(mockEntities);
      expect(result.total).toBe(1);
    });

    it('should filter by keyword', async () => {
      const query = {
        keyword: 'user',
        pageNum: 1,
        pageSize: 10,
      };

      mockRepository.getManyAndCount.mockResolvedValue([[mockEntity], 1]);

      await service.findAll(query);

      expect(mockRepository.andWhere).toHaveBeenCalledWith(
        '(entity.name LIKE :keyword OR entity.displayName LIKE :keyword OR entity.tableName LIKE :keyword)',
        { keyword: '%user%' }
      );
    });
  });

  describe('findOne', () => {
    it('should return an entity by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockEntity);

      const result = await service.findOne('test-id');

      expect(result).toEqual(mockEntity);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
    });

    it('should throw NotFoundException if entity not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an entity', async () => {
      const updateDto = {
        displayName: 'Updated Entity',
      };

      mockRepository.findOne.mockResolvedValue(mockEntity);
      mockRepository.save.mockResolvedValue({ ...mockEntity, ...updateDto });

      const result = await service.update('test-id', updateDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
      expect(result.displayName).toBe('Updated Entity');
    });
  });

  describe('remove', () => {
    it('should delete an entity', async () => {
      mockRepository.findOne.mockResolvedValue(mockEntity);
      mockRepository.remove.mockResolvedValue(mockEntity);

      await service.remove('test-id');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
      expect(repository.remove).toHaveBeenCalledWith(mockEntity);
    });
  });

  describe('generateScript', () => {
    it('should generate MySQL script', async () => {
      const generateDto = {
        entities: [mockEntity],
        databaseType: 'mysql',
      };

      const result = await service.generateScript(generateDto);

      expect(result).toContain('CREATE TABLE');
      expect(result).toContain('`users`');
      expect(result).toContain('`username`');
    });

    it('should generate PostgreSQL script', async () => {
      const generateDto = {
        entities: [mockEntity],
        databaseType: 'postgresql',
      };

      const result = await service.generateScript(generateDto);

      expect(result).toContain('CREATE TABLE');
      expect(result).toContain('"users"');
      expect(result).toContain('"username"');
    });

    it('should generate SQLite script', async () => {
      const generateDto = {
        entities: [mockEntity],
        databaseType: 'sqlite',
      };

      const result = await service.generateScript(generateDto);

      expect(result).toContain('CREATE TABLE');
      expect(result).toContain('"users"');
      expect(result).toContain('"username"');
    });

    it('should throw error for unsupported database type', async () => {
      const generateDto = {
        entities: [mockEntity],
        databaseType: 'mongodb',
      };

      await expect(service.generateScript(generateDto)).rejects.toThrow(
        'Unsupported database type'
      );
    });
  });
});
