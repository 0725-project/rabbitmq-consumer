import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinTable } from 'typeorm'
import { Exclude } from 'class-transformer'
import { Post } from 'src/modules/posts/posts.entity'
import { Topic } from 'src/modules/topics/topics.entity'
import { Comment } from 'src/modules/comments/comments.entity'
import { Like } from 'src/modules/likes/likes.entity'
import { FavoriteTopic } from 'src/modules/favorite/topics/favtopics.entity'

export enum UserRole {
    ADMIN = 0,
    USER = 1,
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 32, unique: true })
    username: string

    @Column({ type: 'varchar', length: 32, nullable: true })
    nickname: string

    @Exclude()
    @Column({ type: 'varchar', length: 255, select: false })
    password: string

    @Column({ type: 'varchar', length: 320, unique: true })
    email: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    description?: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    profileImage?: string

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole

    @Column({ type: 'int', default: 0 })
    points: number

    @Column({ type: 'int', default: 0 })
    postCount: number

    @Column({ type: 'int', default: 0 })
    commentCount: number

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @OneToMany(() => Post, (post) => post.author)
    posts: Post[]

    @OneToMany(() => Topic, (topic) => topic.creator)
    topics: Topic[]

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[]

    @OneToMany(() => Like, (like) => like.user)
    likes: Like[]

    @OneToMany(() => FavoriteTopic, (favoriteTopic) => favoriteTopic.user)
    favoriteTopics: FavoriteTopic[]
}
