import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Comment } from './comments.entity'
import { CommentsService } from './comments.service'
import { CommentsController } from './comments.controller'
import { PostsModule } from '../posts/posts.module'
import { UsersModule } from '../users/users.module'

@Module({
    imports: [TypeOrmModule.forFeature([Comment]), PostsModule, UsersModule],
    providers: [CommentsService],
    controllers: [CommentsController],
    exports: [CommentsService],
})
export class CommentsModule {}
