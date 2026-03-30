import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum FieldType {
  STRING = 'string',
  INTEGER = 'integer',
  LONG = 'long',
  DOUBLE = 'double',
  BOOLEAN = 'boolean',
  DATE = 'date',
  DATETIME = 'datetime',
  TEXT = 'text',
  JSON = 'json',
}

export enum RelationshipType {
  ONE_TO_ONE = 'one-to-one',
  ONE_TO_MANY = 'one-to-many',
  MANY_TO_ONE = 'many-to-one',
  MANY_TO_MANY = 'many-to-many',
}

@Entity('entities')
export class EntityModel {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255 })
  displayName!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 255 })
  tableName!: string;

  @Column({ type: 'json' })
  fields!: Field[];

  @Column({ type: 'json', nullable: true })
  relationships?: Relationship[];

  @Column({ type: 'json', nullable: true })
  indexes!: Index[];

  @Column({ type: 'varchar', length: 255 })
  package!: string;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status!: 'active' | 'archived' | 'deleted';

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

export interface Field {
  name: string;
  displayName: string;
  type: FieldType;
  length?: number;
  isRequired: boolean;
  isUnique?: boolean;
  defaultValue?: any;
  comment?: string;
}

export interface Relationship {
  name: string;
  type: RelationshipType;
  targetEntity: string;
  foreignKey?: string;
  inverseSide?: string;
  comment?: string;
}

export interface Index {
  name: string;
  columns: string[];
  unique?: boolean;
  comment?: string;
}
