import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { NoteToUser } from './note-to-user.entity';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({
    
  })
  @Column({
    type: 'text'
  })
  text: string;

  @OneToMany(() => NoteToUser, noteToUser => noteToUser.note, )
  noteToUsers: NoteToUser[];

  @CreateDateColumn({ name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at'})
  updatedAt: Date;
}