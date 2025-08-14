import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Post } from 'src/modules/posts/posts.entity'
import { PostsModule } from 'src/modules/posts/posts.module'
import { Topic } from 'src/modules/topics/topics.entity'
import { TopicService } from './topic.service'
import { TopicController } from './topic.controller'

@Module({
    imports: [TypeOrmModule.forFeature([Post, Topic]), forwardRef(() => PostsModule)],
    providers: [TopicService],
    controllers: [TopicController],
})
export class TopicModule {}
