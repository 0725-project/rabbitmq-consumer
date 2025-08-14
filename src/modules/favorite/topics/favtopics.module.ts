import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FavoriteTopic } from './favtopics.entity'
import { FavoriteTopicsController } from './favtopics.controller'
import { FavoriteTopicsService } from './favtopics.service'
import { UsersModule } from 'src/modules/users/users.module'
import { TopicsModule } from 'src/modules/topics/topics.module'

@Module({
    imports: [TypeOrmModule.forFeature([FavoriteTopic]), UsersModule, TopicsModule],
    controllers: [FavoriteTopicsController],
    providers: [FavoriteTopicsService],
})
export class FavoriteTopicsModule {}
