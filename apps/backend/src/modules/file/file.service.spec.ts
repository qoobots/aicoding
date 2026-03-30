import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileService } from './file.service';
import { FileEntity } from '../../entities/file.entity';
import { NotFoundException } from '@nestjs/common';

describe('FileService', () => {
  let service: FileService;
  let repository: Repository<FileEntity>;

  const mockFile: FileEntity = {
    id: 'test-id',
    projectId: 'project-1',
    path: '/src/main.ts',
    name: 'main.ts',
    type: 'file',
    size: 1024,
    content: 'console.log("hello");',
    metadata: {},
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
        FileService,
        {
          provide: getRepositoryToken(FileEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<FileService>(FileService);
    repository = module.get<Repository<FileEntity>>(getRepositoryToken(FileEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated files', async () => {
      const mockFiles = [mockFile];
      mockRepository.getManyAndCount.mockResolvedValue([mockFiles, 1]);

      const query = {
        projectId: 'project-1',
        pageNum: 1,
        pageSize: 10,
      };

      const result = await service.findAll(query);

      expect(result.list).toEqual(mockFiles);
      expect(result.total).toBe(1);
    });

    it('should filter by projectId', async () => {
      const query = {
        projectId: 'project-1',
        pageNum: 1,
        pageSize: 10,
      };

      mockRepository.getManyAndCount.mockResolvedValue([[mockFile], 1]);

      await service.findAll(query);

      expect(mockRepository.andWhere).toHaveBeenCalledWith('file.projectId = :projectId', {
        projectId: 'project-1',
      });
    });

    it('should filter by path', async () => {
      const query = {
        projectId: 'project-1',
        path: '/src',
        pageNum: 1,
        pageSize: 10,
      };

      mockRepository.getManyAndCount.mockResolvedValue([[mockFile], 1]);

      await service.findAll(query);

      expect(mockRepository.andWhere).toHaveBeenCalledWith('file.path LIKE :filePath', {
        filePath: '/src%',
      });
    });

    it('should filter by keyword', async () => {
      const query = {
        projectId: 'project-1',
        keyword: 'main',
        pageNum: 1,
        pageSize: 10,
      };

      mockRepository.getManyAndCount.mockResolvedValue([[mockFile], 1]);

      await service.findAll(query);

      expect(mockRepository.andWhere).toHaveBeenCalledWith(
        '(file.name LIKE :keyword OR file.path LIKE :keyword)',
        { keyword: '%main%' }
      );
    });

    it('should filter by type', async () => {
      const query = {
        projectId: 'project-1',
        type: 'file' as 'file' | 'folder',
        pageNum: 1,
        pageSize: 10,
      };

      mockRepository.getManyAndCount.mockResolvedValue([[mockFile], 1]);

      await service.findAll(query);

      expect(mockRepository.andWhere).toHaveBeenCalledWith('file.type = :type', { type: 'file' });
    });
  });

  describe('findOne', () => {
    it('should return a file by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockFile);

      const result = await service.findOne('test-id');

      expect(result).toEqual(mockFile);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
    });

    it('should throw NotFoundException if file not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a file', async () => {
      const updateDto = {
        name: 'updated.ts',
      };

      mockRepository.findOne.mockResolvedValue(mockFile);
      mockRepository.save.mockResolvedValue({ ...mockFile, ...updateDto });

      const result = await service.update('test-id', updateDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
      expect(result.name).toBe('updated.ts');
    });
  });

  describe('remove', () => {
    it('should delete a file', async () => {
      mockRepository.findOne.mockResolvedValue(mockFile);
      mockRepository.remove.mockResolvedValue(mockFile);

      await service.remove('test-id');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
      expect(repository.remove).toHaveBeenCalledWith(mockFile);
    });
  });

  describe('search', () => {
    it('should search files by name', async () => {
      const searchDto = {
        projectId: 'project-1',
        keyword: 'main',
        searchIn: 'name' as 'name' | 'content' | 'all',
      };

      mockRepository.find.mockResolvedValue([mockFile]);

      const result = await service.search(searchDto);

      expect(result).toEqual([mockFile]);
      expect(mockRepository.andWhere).toHaveBeenCalledWith('file.name LIKE :keyword', {
        keyword: '%main%',
      });
    });
  });

  describe('getProjectTree', () => {
    it('should return project file tree', async () => {
      const mockFiles = [
        mockFile,
        {
          ...mockFile,
          id: 'file-2',
          path: '/src/utils/helper.ts',
          name: 'helper.ts',
        },
      ];

      mockRepository.find.mockResolvedValue(mockFiles);

      const result = await service.getProjectTree('project-1');

      expect(result).toBeDefined();
      expect(result.name).toBe('root');
      expect(result.type).toBe('folder');
      expect(result.children).toBeDefined();
    });
  });
});
