import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Unique } from 'typeorm'
import { Exclude } from 'class-transformer'
import { User } from 'src/modules/users/users.entity'
import { Post } from 'src/modules/posts/posts.entity'

@Entity('likes')
@Unique(['user', 'post'])
export class Like {
    @PrimaryGeneratedColumn()
    @Exclude()
    id: number

    @ManyToOne(() => User, (user) => user.likes, { eager: true, onDelete: 'CASCADE' })
    user: User

    @ManyToOne(() => Post, (post) => post.likes, { eager: true, onDelete: 'CASCADE' })
    post: Post

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date
}
