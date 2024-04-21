import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import * as supertest from 'supertest';
import { AppModule } from '../../../app.module';
import { TestService } from '../../../helpers/test.service';
import { AuthService } from '../../auth/auth.service';
import { UserEntity } from '../../user/user.entity';
import { UserService } from '../../user/user.service';
import { CreateOneTaskDto } from '../dto/create-one.dto';
import { UpdateOneTaskDto } from '../dto/update-one.dto';
import { TaskEntity } from '../task.entity';
import { TaskService } from '../task.service';

describe('Task controller', () => {
  let app: INestApplication;
  let taskService: TaskService;
  let userService: UserService;
  let createdTask: TaskEntity;
  let createdTask2: TaskEntity;
  let createdUser: UserEntity;
  let createdUserToken: string;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    taskService = app.get(TaskService);
    authService = app.get(AuthService);
    userService = app.get(UserService);
    await app.init();
  });

  afterAll(async () => {
    const testService = app.get(TestService);
    await testService.afterAll();
    await app.close();
  });

  it('shoud prepare user', async () => {
    const newUser = { username: 'new-user', password: 'valid-password' };
    const user = await userService.create(newUser);
    createdUser = user;
    expect(user).toBeInstanceOf(UserEntity);
    const res = await authService.signIn(newUser);
    createdUserToken = res.token;
  });

  describe('POST /tasks/', () => {
    it('should create a new task (authorized)', async () => {
      const dto: CreateOneTaskDto = {
        title: 'Test task',
        description: 'This is a test content',
      };

      const res = await supertest(app.getHttpServer())
        .post('/tasks')
        .send(dto)
        .set('Authorization', 'Bearer ' + createdUserToken)
        .expect(HttpStatus.CREATED);

      expect(res.body.title).toBe(dto.title);
      expect(res.body.description).toBe(dto.description);

      createdTask = res.body;
    });

    it('should create a new task 2 (authorized)', async () => {
      const dto: CreateOneTaskDto = {
        title: 'Test tasks 2',
        description: 'This is a test content',
      };

      const res = await supertest(app.getHttpServer())
        .post('/tasks')
        .send(dto)
        .set('Authorization', 'Bearer ' + createdUserToken)
        .expect(HttpStatus.CREATED);

      expect(res.body.title).toBe(dto.title);
      expect(res.body.description).toBe(dto.description);

      createdTask2 = res.body;
    });

    it('should not create a new task (empty authorized)', async () => {
      const dto: CreateOneTaskDto = {
        title: 'Test task',
        description: 'This is a test content',
      };

      const res = await supertest(app.getHttpServer())
        .post('/tasks')
        .send(dto)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 400 for invalid title (empty)', async () => {
      const invalidDto: Partial<CreateOneTaskDto> = {
        description: 'This is a test content',
      };

      await supertest(app.getHttpServer())
        .post('/tasks')
        .send(invalidDto)
        .set('Authorization', 'Bearer ' + createdUserToken)
        .expect(HttpStatus.CONFLICT);
    });

    it('should return 400 for missing description', async () => {
      const invalidDto: Partial<CreateOneTaskDto> = {
        title: 'Test task',
      };

      await supertest(app.getHttpServer())
        .post('/tasks')
        .send(invalidDto)
        .set('Authorization', 'Bearer ' + createdUserToken)
        .expect(HttpStatus.CONFLICT);
    });
  });

  describe('findOnetask (GET /)', () => {
    it('should retrieve an task by id', async () => {
      const res = await supertest(app.getHttpServer())
        .get('/tasks/' + createdTask.id)
        .expect(HttpStatus.OK);
      expect(res.body).toEqual(createdTask);
    });

    it('should return 404 for non-existent task', async () => {
      await supertest(app.getHttpServer())
        .get('/tasks/' + randomUUID())
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return 400 for invalid task id(uuid)', async () => {
      await supertest(app.getHttpServer())
        .get('/tasks/' + 'asdsa')
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('findMany (GET /many)', () => {
    it('should retrieve multiple tasks ', async () => {
      const array = [createdTask, createdTask2];

      const res = await supertest(app.getHttpServer())
        .get('/tasks')
        .expect(HttpStatus.OK);
      expect(res.body).toEqual(array);
    });
  });

  describe('patchtask (PATCH /:id)', () => {
    it('should update an task (authorized)', async () => {
      const id = createdTask.id;
      const dto: UpdateOneTaskDto = { title: 'Updated Title' };

      const res = await supertest(app.getHttpServer())
        .patch(`/tasks/${id}`)
        .send(dto)
        .set('Authorization', 'Bearer ' + createdUserToken)
        .expect(HttpStatus.OK);
      expect(!!res.body).toEqual(true);
    });
  });
});
