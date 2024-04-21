import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { AppModule } from '../../../app.module';
import { TestService } from '../../../helpers/test.service';
import { UserEntity } from '../user.entity';
import { UserService } from '../user.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;
  let createdUser: UserEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    userService = app.get(UserService);
    await app.init();
  });

  afterAll(async () => {
    const testService = app.get(TestService);
    await testService.afterAll();
    await app.close();
  });

  it('should create a new user', async () => {
    const newUser = { username: 'new-user', password: 'valid-password' };
    const user = await userService.create(newUser);
    expect(user).toBeInstanceOf(UserEntity);
    createdUser = user;
  });

  it('should throw an error for missing username', async () => {
    const newUser = { password: 'valid-password' } as any;
    await expect(userService.create(newUser)).rejects.toThrowError(
      'null value in column "username" of relation "user" violates not-null constraint',
    );
  });

  it('should throw an error for missing password', async () => {
    const newUser = { username: 'new-user' } as any;
    await expect(userService.create(newUser)).rejects.toThrowError(
      'null value in column "password" of relation "user" violates not-null constraint',
    );
  });

  it('should find a user by id', async () => {
    const user = await userService.findOneBy({ id: createdUser.id });
    expect(user).toEqual(createdUser);
  });

  it('should find a user by username', async () => {
    const user = await userService.findOneBy({
      username: createdUser.username,
    });
    expect(user).toEqual(createdUser);
  });

  it('should return null for no matching user', async () => {
    const user = await userService.findOneBy({ id: randomUUID() });
    expect(user).toBeNull();
  });

  it('should return null for empty payload', async () => {
    const user = await userService.findOneBy({});
    expect(user).toBeNull();
  });
});
