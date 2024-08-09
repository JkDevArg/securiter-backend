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
  export class Log {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    module: string;

    @Column()
    old_credits: number;

    @Column()
    actual_credits: number;

    @Column()
    credits_used: number;

    @Column({ type: 'text'})
    data: string;

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
