import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from 'typeorm'
import { Post } from 'src/modules/posts/posts.entity'
import { User } from 'src/modules/users/users.entity'

@Entity('comments')
@Index(['post', 'id'])
export class Comment {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'text' })
    content: string

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
    post: Post

    @ManyToOne(() => User, (user) => user.comments, { onDelete: 'SET NULL' })
    user: User
}
