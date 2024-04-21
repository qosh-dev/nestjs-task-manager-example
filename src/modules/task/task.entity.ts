import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';

export enum TaskStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

@Entity('task')
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  @Index()
  title: string;

  @Column()
  description: string;

  @Column({ enum: TaskStatus, default: TaskStatus.OPEN })
  status: TaskStatus;

  @Column()
  userId: string;

  @ManyToOne(() => UserEntity, (e) => e.tasks, { onDelete: 'CASCADE' })
  user: UserEntity;
}
