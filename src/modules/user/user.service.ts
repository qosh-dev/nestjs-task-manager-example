import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpDto } from '../auth/models/dto/sign-up.dto';
import { UserFindOnePayload } from './models/user-find-one';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) readonly repo: Repository<UserEntity>,
  ) {}

  async findOneBy(payload: UserFindOnePayload) {
    if (Object.keys(payload).length === 0) {
      return null;
    }
    return this.repo.findOneBy({
      id: payload.id,
      username: payload.username,
    });
  }

  async create(payload: SignUpDto) {
    let record = this.repo.create({
      password: payload.password,
      username: payload.username,
    });
    return this.repo.save(record);
  }
}
