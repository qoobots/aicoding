import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 数据库连接实体
 */
@Entity('database_connections')
export class DatabaseConnection {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255 })
  host!: string;

  @Column({ type: 'int' })
  port!: number;

  @Column({ type: 'varchar', length: 255 })
  username!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({ type: 'varchar', length: 255 })
  database!: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'mysql',
  })
  type!: 'mysql' | 'postgresql' | 'oracle' | 'sqlserver';

  @Column({
    type: 'varchar',
    length: 50,
    default: 'active',
  })
  status!: 'active' | 'inactive';

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
