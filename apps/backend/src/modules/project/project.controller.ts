import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import {
  CreateProjectDto,
  UpdateProjectDto,
  UpdateProjectStatusDto,
  QueryProjectDto,
} from './dto/project.dto';
import { ApiResponse, PageResponse } from '../../common/dtos/api-response.dto';
import { Project } from '../../entities/project.entity';

@Controller('projects')
@UseGuards(/* LoggingGuard */)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProjectDto: CreateProjectDto): Promise<ApiResponse<Project>> {
    const project = await this.projectService.create(createProjectDto);
    return ApiResponse.success(project);
  }

  @Get()
  async findAll(@Query() query: QueryProjectDto): Promise<ApiResponse<PageResponse<Project>>> {
    const { list, total } = await this.projectService.findAll(query);
    return ApiResponse.success(
      PageResponse.success(list, total, 1, Math.min(10, Math.ceil(total / 10)))
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<Project>> {
    const project = await this.projectService.findOne(id);
    return ApiResponse.success(project);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto
  ): Promise<ApiResponse<Project>> {
    const project = await this.projectService.update(id, updateProjectDto);
    return ApiResponse.success(project);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateProjectStatusDto
  ): Promise<ApiResponse<Project>> {
    const project = await this.projectService.updateStatus(id, updateStatusDto);
    return ApiResponse.success(project);
  }

  @Put(':id/restore')
  async restore(@Param('id') id: string): Promise<ApiResponse<Project>> {
    const project = await this.projectService.restore(id);
    return ApiResponse.success(project);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.projectService.remove(id);
  }
}
