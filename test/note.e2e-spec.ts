import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthService } from 'src/auth/auth.service';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { randomUUID } from 'crypto';
import { Note } from 'src/notes/entities/note.entity';

const signupDto: SignupDto = {
  firstName: 'Test',
  lastName: 'User',
  username: 'testUser1',
  password: 'testPassword',
};

let createdNote: Note;

describe('NotesController (e2e)', () => {
  let app: INestApplication;
  let authToken: string; // Mock token

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Mock AuthService login to return a token
    // jest.spyOn(app.get(AuthService), 'login').mockResolvedValue({ access_token: 'mock_access_token' });
  
    // Call the login endpoint to get the mock token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: signupDto.username, password: signupDto.password });

    authToken = loginResponse.body.access_token;
  });


  afterAll(async () => {
    await app.close();
  });

  describe('/notes (POST)', () => {
    it('should create a new note', async () => {
      const createNoteDto = { text: 'New Note' };

      const response = await request(app.getHttpServer())
        .post('/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createNoteDto)
        .expect(HttpStatus.CREATED);

      createdNote = response.body.data.note
      expect(response.body).toEqual({
        success: true,
        message: 'Note successfully created!',
        data: {
          note: expect.objectContaining({ text: 'New Note' })
        },
      });
    });
  });

  describe('/notes/:id (GET)', () => {
    it('should find a note by ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/notes/' + createdNote.id)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual({
        success: true,
        message: 'Note Found Successfully!',
        data: expect.any(Object),
      });
    });

    it('should return 403 Forbidden if the user is not authorized', async () => {
      // Simulate a user who is not authorized to view the note
      // Replace '2' with a user ID who is not the author of the note
      const response = await request(app.getHttpServer())
        .get('/notes/1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.FORBIDDEN);

      expect(response.body).toEqual({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Forbidden',
      });
    });
  });

  describe('/notes (GET)', () => {
    it('should return a list of notes', async () => {
      const response = await request(app.getHttpServer())
        .get('/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual({
        success: true,
        message: 'Notes list!',
        data: expect.objectContaining({
          count: expect.any(Number),
          notes: expect.any(Array),
          current_limit: expect.any(Number),
          current_offset: expect.any(Number),
        }),
      });
    });
  });

  describe('/notes/:id (PATCH)', () => {
    it('should update a specific note', async () => {
      const updateNoteDto = { text: 'Updated Note Text' };

      const response = await request(app.getHttpServer())
        .patch('/notes/' + createdNote.id)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateNoteDto)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual({
        success: true,
        message: 'Note Updated Successfully!',
        data: expect.any(Object),
      });
    });

    it('should return 403 Forbidden if the user is not the author', async () => {
      // Simulate a user who is not the author of the note
      // Replace '2' with a user ID who is not the author of the note
      const response = await request(app.getHttpServer())
        .patch('/notes/1')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ text: 'Updated Note Text' })
        .expect(HttpStatus.FORBIDDEN);

      expect(response.body).toEqual({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Forbidden',
      });
    });
  });

  describe('/notes/:id/share (POST)', () => {
    it('should share a note with another user', async () => {
      const shareNoteDto = { userId: 2 }; // Replace '2' with the ID of another user

      const response = await request(app.getHttpServer())
        .post('/notes/' + createdNote.id + '/share')
        .set('Authorization', `Bearer ${authToken}`)
        .send(shareNoteDto)
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual({
        success: true,
        message: 'Note shared successfully!',
        data: expect.any(Object),
      });
    });

    it('should return 403 Forbidden if the user is not the author', async () => {
      // Simulate a user who is not the author of the note
      // Replace '2' with a user ID who is not the author of the note
      const response = await request(app.getHttpServer())
        .post('/notes/1/share')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ userId: 2 })
        .expect(HttpStatus.FORBIDDEN);

      expect(response.body).toEqual({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Forbidden',
      });
    });

    it('should return 400 Bad Request if the requested user does not exist', async () => {
      const shareNoteDto = { userId: 999 }; // Replace '999' with a non-existing user ID

      const response = await request(app.getHttpServer())
        .post('/notes/' + createdNote.id + '/share')
        .set('Authorization', `Bearer ${authToken}`)
        .send(shareNoteDto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual({
        statusCode: 400,
        message: 'Requested User does not exist on platform!',
      });
    });
  });


  describe('/notes/:id (DELETE)', () => {
    it('should delete a specific note', async () => {
      const response = await request(app.getHttpServer())
        .delete('/notes/' + createdNote.id)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual({
        success: true,
        message: 'Note Deleted Successfully!',
        data: expect.any(Object),
      });
    });

    it('should return 403 Forbidden if the user is not the author', async () => {
      // Simulate a user who is not the author of the note
      // Replace '2' with a user ID who is not the author of the note
      const response = await request(app.getHttpServer())
        .delete('/notes/1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.FORBIDDEN);

      expect(response.body).toEqual({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Forbidden',
      });
    });
  });
});