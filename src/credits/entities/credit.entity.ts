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
export class Credit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  credits: number;

  @Column({ nullable: true })
  credits_used: number;

  @Column({ nullable: true })
  credits_total: number;

  @ManyToOne(() => User, user => user.credits)
  @JoinColumn({ name: 'userEmail', referencedColumnName: 'email' })
  user: User;

  @Column()
  userEmail: string;

  @CreateDateColumn()
  createdAt: Date;
}
