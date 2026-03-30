import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';

// 实体
import { Project } from './entities/project.entity';
import { Template } from './entities/template.entity';
import { EntityModel } from './entities/entity.entity';
import { FileEntity } from './entities/file.entity';
import { DatabaseConnection } from './entities/database-connection.entity';

// 业务模块
import { ProjectModule } from './modules/project/project.module';
import { AIModule } from './modules/ai/ai.module';
import { CodeGeneratorModule } from './modules/code-generator/code-generator.module';
import { TemplateModule } from './modules/template/template.module';
import { EntityModule } from './modules/entity/entity.module';
import { FileModule } from './modules/file/file.module';
import { DatabaseModule } from './modules/database/database.module';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),

    // TypeORM数据库模块
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'better-sqlite3',
        database: path.join(process.cwd(), 'data/database.db'),
        entities: [Project, Template, EntityModel, FileEntity, DatabaseConnection],
        synchronize: configService.get('DATABASE_SYNCHRONIZE', true),
        logging: configService.get('DATABASE_LOGGING', false),
        // better-sqlite3 性能优化
        extra: {
          busyTimeout: 5000,
        },
      }),
      inject: [ConfigService],
    }),

    // 业务模块
    ProjectModule,
    AIModule,
    CodeGeneratorModule,
    TemplateModule,
    EntityModule,
    FileModule,
    DatabaseModule,
  ],
})
export class AppModule {
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    console.log('='.repeat(60));
    console.log('AI编程平台 - NestJS后端服务');
    console.log('='.repeat(60));
    console.log(`环境: ${this.configService.get('NODE_ENV', 'development')}`);
    console.log(`端口: ${this.configService.get('PORT', 3001)}`);
    console.log(`数据库: ${path.join(process.cwd(), 'data/database.db')}`);
    console.log('='.repeat(60));
  }
}
