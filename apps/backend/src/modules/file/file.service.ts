import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from '../../entities/file.entity';
import AdmZip = require('adm-zip');
import {
  CreateFileDto,
  UpdateFileDto,
  QueryFileDto,
  BatchDeleteFilesDto,
  MoveFileDto,
  SearchFilesDto,
  ImportProjectDto,
} from './dto/file.dto';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FileService {
  private readonly PROJECTS_DIR = path.join(process.cwd(), 'projects');

  constructor(
    @InjectRepository(FileEntity)
    private fileRepository: Repository<FileEntity>
  ) {
    this.ensureProjectsDir();
  }

  private async ensureProjectsDir() {
    try {
      await fs.mkdir(this.PROJECTS_DIR, { recursive: true });
    } catch (error) {
      console.error('Failed to create projects directory:', error);
    }
  }

  private getProjectPath(projectId: string): string {
    return path.join(this.PROJECTS_DIR, projectId);
  }

  private getFilePath(projectId: string, filePath: string): string {
    return path.join(this.getProjectPath(projectId), filePath);
  }

  async create(createFileDto: CreateFileDto): Promise<FileEntity> {
    const fullPath = this.getFilePath(createFileDto.projectId, createFileDto.path);

    try {
      // 确保目录存在
      const dirPath = path.dirname(fullPath);
      await fs.mkdir(dirPath, { recursive: true });

      // 写入文件内容
      if (createFileDto.content !== undefined) {
        await fs.writeFile(fullPath, createFileDto.content, 'utf-8');
      }

      // 保存文件记录
      const file = this.fileRepository.create({
        ...createFileDto,
        status: 'active',
      });
      return await this.fileRepository.save(file);
    } catch (error: any) {
      throw new BadRequestException(`Failed to create file: ${error.message}`);
    }
  }

  async findAll(query: QueryFileDto): Promise<{ list: FileEntity[]; total: number }> {
    const { projectId, path: filePath, keyword, type, status, pageNum = 1, pageSize = 10 } = query;

    const queryBuilder = this.fileRepository.createQueryBuilder('file');

    if (projectId) {
      queryBuilder.andWhere('file.projectId = :projectId', { projectId });
    }

    if (filePath) {
      queryBuilder.andWhere('file.path LIKE :filePath', {
        filePath: `${filePath}%`,
      });
    }

    if (keyword) {
      queryBuilder.andWhere('(file.name LIKE :keyword OR file.path LIKE :keyword)', {
        keyword: `%${keyword}%`,
      });
    }

    if (type) {
      queryBuilder.andWhere('file.type = :type', { type });
    }

    if (status) {
      queryBuilder.andWhere('file.status = :status', { status });
    }

    queryBuilder.orderBy('file.createdAt', 'DESC');

    const [list, total] = await queryBuilder
      .skip((pageNum - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { list, total };
  }

  async findOne(id: string): Promise<FileEntity> {
    const file = await this.fileRepository.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException(`File with ID '${id}' not found`);
    }
    return file;
  }

  async getFileContent(id: string): Promise<{ file: FileEntity; content: string }> {
    const file = await this.findOne(id);
    const fullPath = this.getFilePath(file.projectId, file.path);

    try {
      const content = await fs.readFile(fullPath, 'utf-8');
      return { file, content };
    } catch (error: any) {
      throw new NotFoundException(`Failed to read file content: ${error.message}`);
    }
  }

  async update(id: string, updateFileDto: UpdateFileDto): Promise<FileEntity> {
    const file = await this.findOne(id);

    if (updateFileDto.content !== undefined) {
      const fullPath = this.getFilePath(file.projectId, file.path);
      await fs.writeFile(fullPath, updateFileDto.content, 'utf-8');
    }

    Object.assign(file, updateFileDto);
    return await this.fileRepository.save(file);
  }

  async remove(id: string): Promise<void> {
    const file = await this.findOne(id);
    const fullPath = this.getFilePath(file.projectId, file.path);

    try {
      await fs.unlink(fullPath);
    } catch (error) {
      console.error('Failed to delete file from disk:', error);
    }

    await this.fileRepository.remove(file);
  }

  async batchDelete(dto: BatchDeleteFilesDto): Promise<{ deleted: number }> {
    const { fileIds } = dto;
    let deleted = 0;

    for (const fileId of fileIds) {
      try {
        await this.remove(fileId);
        deleted++;
      } catch (error) {
        console.error(`Failed to delete file ${fileId}:`, error);
      }
    }

    return { deleted };
  }

  async move(id: string, moveFileDto: MoveFileDto): Promise<FileEntity> {
    const file = await this.findOne(id);
    const oldPath = this.getFilePath(file.projectId, file.path);
    const newPath = this.getFilePath(file.projectId, moveFileDto.newPath);

    try {
      // 确保新目录存在
      const newDirPath = path.dirname(newPath);
      await fs.mkdir(newDirPath, { recursive: true });

      // 移动文件
      await fs.rename(oldPath, newPath);

      // 更新数据库记录
      file.path = moveFileDto.newPath;
      return await this.fileRepository.save(file);
    } catch (error: any) {
      throw new BadRequestException(`Failed to move file: ${error.message}`);
    }
  }

  async search(dto: SearchFilesDto): Promise<FileEntity[]> {
    const { projectId, keyword, path: filePath, searchIn = 'all' } = dto;

    const queryBuilder = this.fileRepository.createQueryBuilder('file');

    queryBuilder.andWhere('file.projectId = :projectId', { projectId });
    queryBuilder.andWhere('file.status = :status', { status: 'active' });

    if (filePath) {
      queryBuilder.andWhere('file.path LIKE :filePath', {
        filePath: `${filePath}%`,
      });
    }

    if (searchIn === 'name' || searchIn === 'all') {
      queryBuilder.andWhere('file.name LIKE :keyword', {
        keyword: `%${keyword}%`,
      });
    } else if (searchIn === 'content') {
      // 内容搜索需要读取文件内容,性能较差,仅作为备选
      const files = await queryBuilder.getMany();
      const results: FileEntity[] = [];

      for (const file of files) {
        try {
          const fullPath = this.getFilePath(file.projectId, file.path);
          const content = await fs.readFile(fullPath, 'utf-8');
          if (content.includes(keyword)) {
            results.push(file);
          }
        } catch (error) {
          console.error(`Failed to search content in file ${file.id}:`, error);
        }
      }

      return results;
    }

    return await queryBuilder.getMany();
  }

  async exportProject(projectId: string): Promise<Buffer> {
    const files = await this.fileRepository.find({
      where: { projectId, status: 'active' },
    });

    if (files.length === 0) {
      throw new NotFoundException(`No files found for project ${projectId}`);
    }

    try {
      const zip = new AdmZip();
      for (const file of files) {
        const fullPath = this.getFilePath(file.projectId, file.path);
        try {
          zip.addLocalFile(fullPath, file.path);
        } catch (error) {
          console.error(`Failed to add file ${file.path} to zip:`, error);
        }
      }
      return zip.toBuffer();
    } catch (error: any) {
      throw new BadRequestException(`Failed to export project: ${error.message}`);
    }
  }

  async importProject(dto: ImportProjectDto): Promise<{ projectId: string; fileCount: number }> {
    // 这里应该先创建项目,然后导入文件
    // 简化处理,生成一个 projectId
    const projectId = `imported-${Date.now()}`;
    const { files } = dto;
    let fileCount = 0;

    for (const fileData of files) {
      try {
        const fileObj = JSON.parse(fileData);
        await this.create({
          projectId,
          path: fileObj.path,
          name: fileObj.name,
          type: fileObj.type,
          size: fileObj.size,
          content: fileObj.content,
          metadata: fileObj.metadata,
        });
        fileCount++;
      } catch (error) {
        console.error(`Failed to import file:`, error);
      }
    }

    return { projectId, fileCount };
  }

  async getProjectTree(projectId: string): Promise<any> {
    const files = await this.fileRepository.find({
      where: { projectId, status: 'active' },
    });

    const tree: any = { name: 'root', type: 'folder', children: [] };

    for (const file of files) {
      const pathParts = file.path.split('/').filter(Boolean);
      let current = tree;

      for (const part of pathParts) {
        let existingChild = current.children.find((child: any) => child.name === part);

        if (!existingChild) {
          const isLast = part === pathParts[pathParts.length - 1];
          existingChild = {
            name: part,
            type: isLast ? file.type : 'folder',
            path: isLast ? file.path : undefined,
            id: isLast ? file.id : undefined,
            children: [],
          };
          current.children.push(existingChild);
        }

        current = existingChild;
      }
    }

    return tree;
  }
}
