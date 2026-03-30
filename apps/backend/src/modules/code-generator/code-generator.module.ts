import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CodeGeneratorService } from './code-generator.service';
import { CodeGeneratorController } from './code-generator.controller';

@Module({
  imports: [ConfigModule],
  controllers: [CodeGeneratorController],
  providers: [CodeGeneratorService],
  exports: [CodeGeneratorService],
})
export class CodeGeneratorModule {}
