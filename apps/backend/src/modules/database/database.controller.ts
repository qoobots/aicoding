import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { DatabaseService } from './database.service';
import { CreateDatabaseConnectionDto, UpdateDatabaseConnectionDto } from './dto/database.dto';
import { ApiResponse } from '../../common/dtos/api-response.dto';

@Controller('database')
export class DatabaseController {
  private readonly logger = new Logger(DatabaseController.name);

  constructor(private readonly databaseService: DatabaseService) {}

  @Get('connections')
  async findAllConnections(): Promise<ApiResponse<any[]>> {
    const connections = await this.databaseService.findAll();
    return ApiResponse.success(connections);
  }

  @Get('connections/:id')
  async findOneConnection(@Param('id') id: string): Promise<ApiResponse<any>> {
    const connection = await this.databaseService.findOne(id);
    return ApiResponse.success(connection);
  }

  @Post('connections')
  @HttpCode(HttpStatus.CREATED)
  async createConnection(
    @Body() createDto: CreateDatabaseConnectionDto
  ): Promise<ApiResponse<any>> {
    const connection = await this.databaseService.create(createDto);
    return ApiResponse.success(connection);
  }

  @Put('connections/:id')
  async updateConnection(
    @Param('id') id: string,
    @Body() updateDto: UpdateDatabaseConnectionDto
  ): Promise<ApiResponse<any>> {
    const connection = await this.databaseService.update(id, updateDto);
    return ApiResponse.success(connection);
  }

  @Delete('connections/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeConnection(@Param('id') id: string): Promise<void> {
    await this.databaseService.remove(id);
  }

  @Post('connections/:id/test')
  async testConnection(@Param('id') id: string): Promise<ApiResponse<any>> {
    const result = await this.databaseService.testConnection(id);
    return ApiResponse.success(result);
  }

  @Get('connections/:id/health')
  async getHealthStatus(@Param('id') id: string): Promise<ApiResponse<any>> {
    const status = await this.databaseService.getHealthStatus(id);
    return ApiResponse.success(status);
  }

  @Get('connections/:id/tables')
  async getTables(@Param('id') id: string): Promise<ApiResponse<any[]>> {
    try {
      this.logger.log(`GET /connections/${id}/tables`);
      const tables = await this.databaseService.getTables(id);
      return ApiResponse.success(tables);
    } catch (error: any) {
      this.logger.error(`Error getting tables for connection ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get('connections/:id/tables/:tableName/schema')
  async getTableSchema(
    @Param('id') id: string,
    @Param('tableName') tableName: string
  ): Promise<ApiResponse<any>> {
    const schema = await this.databaseService.getTableSchema(id, tableName);
    return ApiResponse.success(schema);
  }
}
