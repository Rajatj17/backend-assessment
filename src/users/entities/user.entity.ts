import { NoteToUser } from '../../notes/entities/note-to-user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'first_name'
  })
  firstName: string;

  @Column({
    name: 'last_name'
  })
  lastName: string;

  @Column({
    unique: true
  })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => NoteToUser, noteToUser => noteToUser.user)
  noteToUsers?: NoteToUser[];

  @CreateDateColumn({ name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at'})
  updatedAt: Date;
}