import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../../entities/project.entity';
import {
  CreateProjectDto,
  UpdateProjectDto,
  UpdateProjectStatusDto,
  QueryProjectDto,
} from './dto/project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepository.create(createProjectDto);
    return await this.projectRepository.save(project);
  }

  async findAll(query: QueryProjectDto): Promise<{ list: Project[]; total: number }> {
    const queryBuilder = this.projectRepository.createQueryBuilder('project');

    if (query.keyword) {
      queryBuilder.andWhere('project.name LIKE :keyword OR project.description LIKE :keyword', {
        keyword: `%${query.keyword}%`,
      });
    }

    if (query.type) {
      queryBuilder.andWhere('project.type = :type', { type: query.type });
    }

    if (query.status) {
      queryBuilder.andWhere('project.status = :status', { status: query.status });
    }

    queryBuilder.orderBy(`project.${query.sortBy || 'createdAt'}`, query.sortOrder || 'DESC');

    const [list, total] = await queryBuilder.getManyAndCount();

    return { list, total };
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id, status: 'active' as any },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
    Object.assign(project, updateProjectDto);
    return await this.projectRepository.save(project);
  }

  async updateStatus(id: string, updateStatusDto: UpdateProjectStatusDto): Promise<Project> {
    const project = await this.findOne(id);
    project.status = updateStatusDto.status;
    return await this.projectRepository.save(project);
  }

  async remove(id: string): Promise<void> {
    const project = await this.findOne(id);
    project.status = 'deleted';
    await this.projectRepository.save(project);
  }

  async restore(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    project.status = 'active';
    return await this.projectRepository.save(project);
  }
}
