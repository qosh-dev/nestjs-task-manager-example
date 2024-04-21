import * as bcrypt from 'bcryptjs';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskEntity } from '../task/task.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => TaskEntity, (u) => u.user)
  tasks: TaskEntity[];

  @BeforeInsert()
  private async hashPassword() {
    if (!this.password) {
      return;
    }
    this.password = await bcrypt.hash(this.password, 10);
  }
}
