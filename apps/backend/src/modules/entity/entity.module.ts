import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityService } from './entity.service';
import { EntityController } from './entity.controller';
import { EntityModel } from '../../entities/entity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EntityModel])],
  controllers: [EntityController],
  providers: [EntityService],
  exports: [EntityService],
})
export class EntityModule {}
