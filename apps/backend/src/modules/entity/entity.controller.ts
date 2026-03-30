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
} from '@nestjs/common';
import { EntityService } from './entity.service';
import { EntityModel } from '../../entities/entity.entity';
import {
  CreateEntityDto,
  UpdateEntityDto,
  QueryEntityDto,
  GenerateScriptDto,
} from './dto/entity.dto';
import { ApiResponse, PageResponse } from '../../common/dtos/api-response.dto';

@Controller('entities')
export class EntityController {
  constructor(private readonly entityService: EntityService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createEntityDto: CreateEntityDto): Promise<ApiResponse<EntityModel>> {
    const entity = await this.entityService.create(createEntityDto);
    return ApiResponse.success(entity);
  }

  @Get()
  async findAll(@Query() query: QueryEntityDto): Promise<ApiResponse<PageResponse<EntityModel>>> {
    const { list, total } = await this.entityService.findAll(query);
    const pageNum = query.pageNum || 1;
    const pageSize = query.pageSize || 10;
    return ApiResponse.success(PageResponse.success(list, total, pageNum, pageSize));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<EntityModel>> {
    const entity = await this.entityService.findOne(id);
    return ApiResponse.success(entity);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEntityDto: UpdateEntityDto
  ): Promise<ApiResponse<EntityModel>> {
    const entity = await this.entityService.update(id, updateEntityDto);
    return ApiResponse.success(entity);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.entityService.remove(id);
  }

  @Post('generate-script')
  @HttpCode(HttpStatus.OK)
  async generateScript(@Body() generateScriptDto: GenerateScriptDto): Promise<ApiResponse<string>> {
    const script = await this.entityService.generateScript(generateScriptDto);
    return ApiResponse.success(script);
  }
}
