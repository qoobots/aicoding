import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 项目实体
 */
@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'varchar', length: 50, default: 'spring-boot' })
  type!: string;

  @Column({ type: 'varchar', length: 255, default: 'com.example' })
  packageName!: string;

  @Column({ type: 'json', nullable: true })
  config!: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  database!: {
    type: string;
    host: string;
    port: number;
    name: string;
  };

  @Column({ type: 'json', nullable: true })
  aiSettings!: {
    provider: string;
    model: string;
    apiKey?: string;
    temperature?: number;
    maxTokens?: number;
  };

  @Column({ type: 'json', nullable: true })
  entities!: Array<any>;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status!: 'active' | 'archived' | 'deleted';

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
