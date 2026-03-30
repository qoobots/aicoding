import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';
import { DatabaseConnection } from '../../entities/database-connection.entity';
import { DatabaseAdapterFactory } from './adapters/database-adapter-factory';
import { MySQLAdapter } from './adapters/mysql.adapter';
import { PostgreSQLAdapter } from './adapters/postgresql.adapter';
import { OracleAdapter } from './adapters/oracle.adapter';

@Module({
  imports: [TypeOrmModule.forFeature([DatabaseConnection])],
  controllers: [DatabaseController],
  providers: [
    DatabaseService,
    DatabaseAdapterFactory,
    MySQLAdapter,
    PostgreSQLAdapter,
    OracleAdapter,
  ],
  exports: [DatabaseService],
})
export class DatabaseModule {}
