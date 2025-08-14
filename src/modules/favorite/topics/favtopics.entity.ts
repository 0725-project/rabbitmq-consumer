import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm'
import { Exclude } from 'class-transformer'
import { User } from 'src/modules/users/users.entity'
import { Topic } from 'src/modules/topics/topics.entity'

@Entity('favorite_topics')
@Unique(['user', 'topic'])
export class FavoriteTopic {
    @PrimaryGeneratedColumn()
    @Exclude()
    id: number

    @ManyToOne(() => User, (user) => user.favoriteTopics, { eager: true, onDelete: 'CASCADE' })
    user: User

    @ManyToOne(() => Topic, (topic) => topic.favoritedBy, { eager: true, onDelete: 'CASCADE' })
    topic: Topic
}
