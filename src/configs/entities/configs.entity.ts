import { User } from 'src/users/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';

  @Entity()
  export class Configs {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ comment: 'Title of the settings' })
    title: string;

    @Column({ type: 'text', nullable: true, comment: 'Description of the service'})
    description: string;

    @Column({comment: 'Credits cost for the service'})
    credits: number;

    @Column({ comment: 'Module assigned' })
    module: string;

    @Column({ comment: 'Role assign module '})
    role_assign: string;

    @CreateDateColumn()
    createdAt: Date;
}
