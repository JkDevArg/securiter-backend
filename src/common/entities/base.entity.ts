import { Column, PrimaryGeneratedColumn } from 'typeorm';

export enum BaseEntityState {
  ENABLED = 1,
  DISABLED = 2,
  DELETED = 0,
}

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 1, type: 'tinyint' })
  state: BaseEntityState;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_created: string;

  @Column({ nullable: true, type: 'timestamp' })
  date_updated: string;

  @Column({ nullable: true, type: 'timestamp' })
  date_deleted: string;
}