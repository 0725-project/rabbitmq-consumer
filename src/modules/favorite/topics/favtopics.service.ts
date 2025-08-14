import { ForbiddenException, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { FavoriteTopic } from './favtopics.entity'
import { UsersService } from 'src/modules/users/users.service'
import { TopicsService } from 'src/modules/topics/topics.service'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class FavoriteTopicsService {
    constructor(
        @InjectRepository(FavoriteTopic)
        private favoriteTopicsRepository: Repository<FavoriteTopic>,
        private usersService: UsersService,
        private topicsService: TopicsService,
    ) {}

    async addFavoriteTopic(userId: number, topicSlug: string): Promise<void> {
        const user = await this.usersService.findById(userId)
        const topic = await this.topicsService.findBySlug(topicSlug)

        const count = await this.favoriteTopicsRepository.count({ where: { user, topic } })
        if (count >= 20) {
            throw new ForbiddenException('You can only have up to 20 favorite topics')
        }

        const favoriteTopic = this.favoriteTopicsRepository.create({ user, topic })
        await this.favoriteTopicsRepository.save(favoriteTopic)
    }

    async removeFavoriteTopic(userId: number, topicSlug: string): Promise<void> {
        const user = await this.usersService.findById(userId)
        const topic = await this.topicsService.findBySlug(topicSlug)

        await this.favoriteTopicsRepository.delete({ user, topic })
    }

    async getFavoriteTopics(userId: number): Promise<FavoriteTopic[]> {
        return this.favoriteTopicsRepository.find({
            where: { user: { id: userId } },
            relations: ['topic'],
        })
    }
}
