import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm'
import { User } from 'src/modules/users/users.entity'
import { Post } from 'src/modules/posts/posts.entity'
import { FavoriteTopic } from 'src/modules/favorite/topics/favtopics.entity'

@Entity('topics')
export class Topic {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 32, unique: true })
    slug: string

    @Column({ type: 'varchar', length: 32, unique: true })
    name: string

    @Column({ type: 'varchar', length: 255 })
    description: string

    @Column({ type: 'int', default: 0 })
    postCount: number

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @ManyToOne(() => User, (user) => user.topics)
    creator: User

    @OneToMany(() => Post, (post) => post.topic)
    posts: Post[]

    @OneToMany(() => FavoriteTopic, (favoriteTopic) => favoriteTopic.topic)
    favoritedBy: FavoriteTopic[]
}
