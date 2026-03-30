import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';
import { CodeGeneratorTemplateController } from './template.controller';
import { Template } from '../../entities/template.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Template])],
  controllers: [TemplateController, CodeGeneratorTemplateController],
  providers: [TemplateService],
  exports: [TemplateService],
})
export class TemplateModule {}
