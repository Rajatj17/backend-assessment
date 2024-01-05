import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { randomUUID } from 'crypto';

import { SignupDto } from 'src/auth/dto/signup.dto';
import { AppModule } from 'src/app.module';

const signupDto: SignupDto = {
  firstName: 'Test',
  lastName: 'User',
  username: randomUUID(),
  password: 'testPassword',
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/signup (POST)', () => {
    it('should create a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto)
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual({
        success: true,
        message: 'Signup Successfull!'
      });
    });
  });

  describe('/auth/login (POST)', () => {
    it('should log in a user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: signupDto.username,
          password: signupDto.password,
        })
        .expect(HttpStatus.CREATED);

      expect(response.body).toHaveProperty('access_token');
    });

    it('should return 429 Too Many Requests if login is throttled', async () => {
      // Simulate multiple login attempts within a short period
      const loginDto = {
        email: signupDto.username,
        password: 'wrongPassword',
      };

      // Attempt login more than the allowed limit within the TTL
      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto);

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(HttpStatus.TOO_MANY_REQUESTS);

      expect(response.body).toEqual({
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: 'ThrottlerException: Too Many Requests',
      });
    });
  });
});
