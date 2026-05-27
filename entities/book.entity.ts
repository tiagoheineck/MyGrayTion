import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm"
import { Author } from "./author.entity"

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @ManyToOne(() => Author, (author) => author.books, { nullable: false })
    @JoinColumn({ name: "author_id" })
    author: Author

}