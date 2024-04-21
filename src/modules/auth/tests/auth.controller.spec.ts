import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as supertest from 'supertest';
import { AppModule } from '../../../app.module';
import { TestService } from '../../../helpers/test.service';
import { SignInDto } from '../models/dto/sign-in.dto';
import { SignUpDto } from '../models/dto/sign-up.dto';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    const testService = app.get(TestService);
    await testService.afterAll();
    await app.close();
  });

  // afterEach(async () => {
  //   await wait(500);
  // });

  describe('POST /auth/signup', () => {
    it('should return a token on successful signup', async () => {
      const signUpDto = new SignUpDto(); // Create a sample SignUpDto
      signUpDto.username = 'Mesmer';
      signUpDto.password = 'asdasdaWEQ@!@213123';
      const response = await supertest(app.getHttpServer())
        .post('/auth/signup')
        .send(signUpDto)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body.token).toBeDefined();
    });

    it('should throw an error for username already existing', async () => {
      const signUpDto = new SignUpDto(); // Create a sample SignUpDto
      signUpDto.username = 'Mesmer';
      signUpDto.password = 'asdasdaWEQ@!@213123';

      const response = await supertest(app.getHttpServer())
        .post('/auth/signup')
        .send(signUpDto);

      expect(response.status).toBe(HttpStatus.CONFLICT);
      expect(response.body.message).toBe('User already exist');
    });

    it('should throw an error for missing username', async () => {
      const signUpDto = new SignUpDto(); // Create a sample SignUpDto
      signUpDto.password = 'asljdhaskjdWqe123dasWWs__dsa';

      const res = await supertest(app.getHttpServer())
        .post('/auth/signup')
        .send(signUpDto)
        .expect(HttpStatus.BAD_REQUEST);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toEqual(expect.any(Array));
      expect(res.body.message[0]).toBe('username must be a string');
      expect(res.body.message[1]).toBe('username should not be empty');
    });

    it('should throw an error for missing password', async () => {
      const signUpDto = new SignUpDto(); // Create a sample SignUpDto
      signUpDto.username = 'new-user2';

      const res = await supertest(app.getHttpServer())
        .post('/auth/signup')
        .send(signUpDto)
        .expect(HttpStatus.BAD_REQUEST);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toEqual(expect.any(Array));
      expect(res.body.message[0]).toBe('password is not strong enough');
      expect(res.body.message[1]).toBe('password should not be empty');
    });
  });

  describe('POST /auth/signin', () => {
    it('should return a token on successful signin', async () => {
      const signInDto = new SignInDto();
      signInDto.username = 'Mesmer';
      signInDto.password = 'asdasdaWEQ@!@213123';

      const response = await supertest(app.getHttpServer())
        .post('/auth/signin')
        .send(signInDto)
        .expect(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.token).toBeDefined();
    });

    it('should throw an error for invalid credentials', async () => {
      const signInDto = new SignInDto(); // Create a sample SignInDto
      signInDto.username = 'existing-user';
      signInDto.password = 'asdasdaWEQ@!@213123asdasdasds';

      await supertest(app.getHttpServer())
        .post('/auth/signin')
        .send(signInDto)
        .expect(401); // Unauthorized
    });

    it('should throw an error for missing username', async () => {
      const signInDto = new SignInDto(); // Create a sample SignInDto
      signInDto.password = 'valid-password';

      const res = await supertest(app.getHttpServer())
        .post('/auth/signin')
        .send(signInDto)
        .expect(400);

      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toEqual(expect.any(Array));
      expect(res.body.message[0]).toBe('username must be a string');
      expect(res.body.message[1]).toBe('username should not be empty');
    });

    it('should throw an error for missing password', async () => {
      const signInDto = new SignInDto(); // Create a sample SignInDto
      signInDto.username = 'existing-user';

      const res = await supertest(app.getHttpServer())
        .post('/auth/signin')
        .send(signInDto)
        .expect(400);

      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toEqual(expect.any(Array));
      expect(res.body.message[0]).toBe('password must be a string');
    });
  });
});
