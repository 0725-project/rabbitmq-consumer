import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index, OneToMany } from 'typeorm'
import { User } from 'src/modules/users/users.entity'
import { Topic } from 'src/modules/topics/topics.entity'
import { Comment } from 'src/modules/comments/comments.entity'
import { Exclude } from 'class-transformer'
import { Like } from '../likes/likes.entity'

@Entity('posts')
@Index(['topic', 'id'])
export class Post {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 255 })
    title: string

    @Column({ type: 'text' })
    content: string

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @Column({ type: 'int' })
    topicLocalId: number

    @Column({ type: 'int', default: 0 })
    viewCount: number

    @Column({ type: 'int', default: 0 })
    commentCount: number

    @Column({ type: 'int', default: 0 })
    likeCount: number

    @Exclude()
    @Column({ type: 'varchar', length: 15, nullable: true })
    ip: string

    @ManyToOne(() => User, (user) => user.posts)
    author: User

    @ManyToOne(() => Topic, (topic) => topic.posts)
    topic: Topic

    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[]

    @ManyToOne(() => Like, (like) => like.post)
    likes: Like[]
}
