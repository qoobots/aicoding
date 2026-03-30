import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Header,
  StreamableFile,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileEntity } from '../../entities/file.entity';
import {
  CreateFileDto,
  UpdateFileDto,
  QueryFileDto,
  BatchDeleteFilesDto,
  MoveFileDto,
  SearchFilesDto,
  ImportProjectDto,
} from './dto/file.dto';
import { ApiResponse, PageResponse } from '../../common/dtos/api-response.dto';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createFileDto: CreateFileDto): Promise<ApiResponse<FileEntity>> {
    const file = await this.fileService.create(createFileDto);
    return ApiResponse.success(file);
  }

  @Get()
  async findAll(@Query() query: QueryFileDto): Promise<ApiResponse<PageResponse<FileEntity>>> {
    const { list, total } = await this.fileService.findAll(query);
    const pageNum = query.pageNum || 1;
    const pageSize = query.pageSize || 10;
    return ApiResponse.success(PageResponse.success(list, total, pageNum, pageSize));
  }

  @Get('tree/:projectId')
  async getProjectTree(@Param('projectId') projectId: string): Promise<ApiResponse<any>> {
    const tree = await this.fileService.getProjectTree(projectId);
    return ApiResponse.success(tree);
  }

  @Get('content/:id')
  async getFileContent(
    @Param('id') id: string
  ): Promise<ApiResponse<{ file: FileEntity; content: string }>> {
    const result = await this.fileService.getFileContent(id);
    return ApiResponse.success(result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<FileEntity>> {
    const file = await this.fileService.findOne(id);
    return ApiResponse.success(file);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFileDto: UpdateFileDto
  ): Promise<ApiResponse<FileEntity>> {
    const file = await this.fileService.update(id, updateFileDto);
    return ApiResponse.success(file);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.fileService.remove(id);
  }

  @Post('batch-delete')
  @HttpCode(HttpStatus.OK)
  async batchDelete(@Body() dto: BatchDeleteFilesDto): Promise<ApiResponse<{ deleted: number }>> {
    const result = await this.fileService.batchDelete(dto);
    return ApiResponse.success(result);
  }

  @Post(':id/move')
  @HttpCode(HttpStatus.OK)
  async move(
    @Param('id') id: string,
    @Body() moveFileDto: MoveFileDto
  ): Promise<ApiResponse<FileEntity>> {
    const file = await this.fileService.move(id, moveFileDto);
    return ApiResponse.success(file);
  }

  @Post('search')
  @HttpCode(HttpStatus.OK)
  async search(@Body() dto: SearchFilesDto): Promise<ApiResponse<FileEntity[]>> {
    const results = await this.fileService.search(dto);
    return ApiResponse.success(results);
  }

  @Get('export/:projectId')
  @Header('Content-Type', 'application/zip')
  async exportProject(@Param('projectId') projectId: string): Promise<StreamableFile> {
    const buffer = await this.fileService.exportProject(projectId);
    return new StreamableFile(buffer, {
      type: 'application/zip',
      disposition: `attachment; filename="${projectId}.zip"`,
    });
  }

  @Post('import')
  @HttpCode(HttpStatus.OK)
  async importProject(
    @Body() dto: ImportProjectDto
  ): Promise<ApiResponse<{ projectId: string; fileCount: number }>> {
    const result = await this.fileService.importProject(dto);
    return ApiResponse.success(result);
  }
}
