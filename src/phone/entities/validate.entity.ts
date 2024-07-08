import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { Role } from '../../common/enums/rol.enum';

  @Entity()
  export class Phone {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    number: string;

    @Column({ nullable: true })
    url: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    proxy: string;

    @Column({ type: 'text'})
    data: string;

    @Column({ nullable: false })
    user_id: number;



    /* @Column({ type: 'enum', default: Role.USER, enum: Role })
    role: Role; */

    @CreateDateColumn()
    createdAt: Date;
}
