import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm"
import { Note } from "./note.entity"
import { User } from "../../users/entities/user.entity"
import { NotesToUserRole } from "../types"

@Entity()
export class NoteToUser {
    @PrimaryGeneratedColumn()
    public id: number

    @Column({
      name: 'note_id'
    })
    public noteId: number

    @Column({
      name: 'user_id'
    })
    public userId: number

    @Column({
      enum: NotesToUserRole
    })
    public role: NotesToUserRole

    @ManyToOne(() => Note, (note) => note.noteToUsers, {
      onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'note_id' })
    public note: Note

    @ManyToOne(() => User, (user) => user.noteToUsers, {
      onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'user_id' })
    public user: User
}