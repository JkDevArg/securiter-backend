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
  export class Store {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    phone_number: string;

    @Column({ nullable: true })
    url: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    proxy: string;

    @Column({ type: 'text'})
    data: string;

    @Column({ default: 100 })
    credits: number;

    @Column()
    module: string;

    @Column({ default: false })
    is_admin: boolean;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userEmail', referencedColumnName: 'email',  })
    user: User;

    @Column()
    userEmail: string;

    @CreateDateColumn()
    createdAt: Date;
}
