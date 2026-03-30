import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectService } from './project.service';
import { Project } from '../../entities/project.entity';
import { NotFoundException } from '@nestjs/common';

describe('ProjectService', () => {
  let service: ProjectService;
  let repository: Repository<Project>;

  const mockProject = {
    id: 'test-id',
    name: 'Test Project',
    description: 'Test Description',
    framework: 'spring-boot',
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
        ProjectService,
        {
          provide: getRepositoryToken(Project),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    repository = module.get<Repository<Project>>(getRepositoryToken(Project));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new project', async () => {
      const createDto = {
        name: 'Test Project',
        description: 'Test Description',
        framework: 'spring-boot',
      };

      mockRepository.create.mockReturnValue(mockProject);
      mockRepository.save.mockResolvedValue(mockProject);

      const result = await service.create(createDto);

      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(mockProject);
    });
  });

  describe('findAll', () => {
    it('should return paginated projects', async () => {
      const mockProjects = [mockProject];
      mockRepository.getManyAndCount.mockResolvedValue([mockProjects, 1]);

      const query: any = {
        pageNum: 1,
        pageSize: 10,
      };

      const result = await service.findAll(query);

      expect(result.list).toEqual(mockProjects);
      expect(result.total).toBe(1);
    });

    it('should filter by keyword', async () => {
      const query = {
        keyword: 'test',
        pageNum: 1,
        pageSize: 10,
      };

      mockRepository.getManyAndCount.mockResolvedValue([[mockProject], 1]);

      await service.findAll(query);

      expect(mockRepository.andWhere).toHaveBeenCalledWith(
        '(project.name LIKE :keyword OR project.description LIKE :keyword)',
        { keyword: '%test%' }
      );
    });

    it('should filter by framework', async () => {
      const query: any = {
        framework: 'spring-boot',
        pageNum: 1,
        pageSize: 10,
      };

      mockRepository.getManyAndCount.mockResolvedValue([[mockProject], 1]);

      await service.findAll(query);

      expect(mockRepository.andWhere).toHaveBeenCalledWith('project.framework = :framework', {
        framework: 'spring-boot',
      });
    });

    it('should filter by status', async () => {
      const query = {
        status: 'active' as any,
        pageNum: 1,
        pageSize: 10,
      };

      mockRepository.getManyAndCount.mockResolvedValue([[mockProject], 1]);

      await service.findAll(query);

      expect(mockRepository.andWhere).toHaveBeenCalledWith('project.status = :status', {
        status: 'active',
      });
    });
  });

  describe('findOne', () => {
    it('should return a project by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockProject);

      const result = await service.findOne('test-id');

      expect(result).toEqual(mockProject);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
    });

    it('should throw NotFoundException if project not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a project', async () => {
      const updateDto = {
        name: 'Updated Project',
      };

      mockRepository.findOne.mockResolvedValue(mockProject);
      mockRepository.save.mockResolvedValue({ ...mockProject, ...updateDto });

      const result = await service.update('test-id', updateDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
      expect(result.name).toBe('Updated Project');
    });
  });

  describe('remove', () => {
    it('should delete a project', async () => {
      mockRepository.findOne.mockResolvedValue(mockProject);
      mockRepository.remove.mockResolvedValue(mockProject);

      await service.remove('test-id');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
      expect(repository.remove).toHaveBeenCalledWith(mockProject);
    });
  });
});
