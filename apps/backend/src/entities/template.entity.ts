import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TemplateType {
  SPRING_BOOT = 'spring-boot',
  SPRING_CLOUD = 'spring-cloud',
  VUE3 = 'vue3',
  REACT = 'react',
  COMMON = 'common',
}

export enum TemplateCategory {
  ENTITY = 'entity',
  CONTROLLER = 'controller',
  SERVICE = 'service',
  REPOSITORY = 'repository',
  COMPONENT = 'component',
  PAGE = 'page',
  STORE = 'store',
  CONFIG = 'config',
  OTHER = 'other',
}

@Entity('templates')
export class Template {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name!: string;

  @Column({ type: 'varchar', length: 255 })
  displayName!: string;

  @Column({ type: 'varchar', length: 50 })
  type!: TemplateType;

  @Column({ type: 'varchar', length: 50 })
  category!: TemplateCategory;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'text', nullable: true })
  example!: string;

  @Column({ type: 'json', nullable: true })
  variables!: Record<string, any>;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status!: 'active' | 'archived' | 'deleted';

  @Column({ type: 'varchar', length: 50, default: 'system' })
  source!: 'system' | 'user';

  @Column({ type: 'int', default: 0 })
  version!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  author!: string;

  @Column({ type: 'json', nullable: true })
  tags!: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
