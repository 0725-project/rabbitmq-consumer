import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Topic } from './topics.entity'
import { Post } from 'src/modules/posts/posts.entity'
import { TopicsService } from './topics.service'
import { TopicsController } from './topics.controller'
import { PostsModule } from 'src/modules/posts/posts.module'

@Module({
    imports: [TypeOrmModule.forFeature([Topic]), forwardRef(() => PostsModule)],
    providers: [TopicsService],
    controllers: [TopicsController],
    exports: [TopicsService],
})
export class TopicsModule {}
