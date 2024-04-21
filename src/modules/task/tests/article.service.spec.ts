import { HttpException, HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { AppModule } from '../../../app.module';
import { TestService } from '../../../helpers/test.service';
import { UserEntity } from '../../user/user.entity';
import { UserService } from '../../user/user.service';
import { CreateOneTaskPayload } from '../dto/create-one.dto';
import { TaskCommon } from '../task.common';
import { TaskEntity } from '../task.entity';
import { TaskService } from '../task.service';

describe('Task service', () => {
  let app: INestApplication;
  let taskService: TaskService;
  let userService: UserService;
  let createdTask: TaskEntity;
  let createdUser: UserEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    taskService = app.get(TaskService);
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

  describe('Create', () => {
    it('should create a new task', async () => {
      const payload: CreateOneTaskPayload = {
        title: 'Test Task',
        description: 'This is a test content',
        userId: createdUser.id,
      };
      createdTask = await taskService.create(payload);
      expect(createdTask).toBeInstanceOf(TaskEntity);
    });

    it('should return null for creation error', async () => {
      const payload: CreateOneTaskPayload = {
        title: 'Test Article',
        description: 'This is a test content',
        userId: randomUUID(),
      };

      await expect(taskService.create(payload)).rejects.toThrowError(
        new HttpException(TaskCommon.DUPLICATE_RECORD, HttpStatus.CONFLICT),
      );
    });
  });

  describe('FindOne', () => {
    it('should find an tasks by id', async () => {
      const task = await taskService.findOne(createdTask.id);
      expect(task.title).toEqual(createdTask.title);
      expect(task.description).toEqual(createdTask.description);
    });

    it('should return null for no matching task', async () => {
      const task = await taskService.findOne(randomUUID());
      expect(task).toBeNull();
    });
  });

  describe('FindMany', () => {
    it('should retrieve multiple tasks with default pagination', async () => {
      const tasks = await taskService.findMany();
      expect(tasks).toEqual([createdTask]);
    });
  });

  describe('UpdateOne', () => {
    it('should update an task and invalidate cache', async () => {
      const id = createdTask.id;
      const userId = createdUser.id;
      const updateProps = { description: 'Updated description' };

      const status = await taskService.updateOne({
        id,
        userId,
        ...updateProps,
      });
      expect(status).toBe(true);
    });

    it('should return false for empty update payload', async () => {
      const id = createdTask.id;
      const userId = createdUser.id;

      const status = await taskService.updateOne({ id, userId });
      expect(status).toBe(false);
    });
  });

  describe('DeleteOne', () => {
    it('should delete an task', async () => {
      const id = createdTask.id;
      const authorId = createdUser.id;

      const status = await taskService.deleteOne(id, authorId);
      expect(status).toBe(true);
    });
  });
});
