import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Like } from './likes.entity'
import { PostsService } from 'src/modules/posts/posts.service'
import { UsersService } from 'src/modules/users/users.service'
import { selectUserBriefColumns, USER_POINT_PER_POST_LIKE } from 'src/common/constants'

import { PaginationDto } from 'src/common/dto'

@Injectable()
export class LikesService {
    constructor(
        @InjectRepository(Like) private likeRepo: Repository<Like>,
        @Inject(PostsService) private postsService: PostsService,
        @Inject(UsersService) private usersService: UsersService,
    ) {}

    async likePost(postId: number, userId: number) {
        const post = await this.postsService.findOne(postId)
        const user = await this.usersService.findById(userId)

        const like = this.likeRepo.create({ post, user })
        await this.likeRepo.save(like)

        await this.postsService.increment(postId, 'likeCount', 1)
        await this.usersService.increment(user.id, 'points', USER_POINT_PER_POST_LIKE)
    }

    async unlikePost(postId: number, userId: number) {
        const like = await this.likeRepo
            .createQueryBuilder('like')
            .where('like.post.id = :postId', { postId })
            .andWhere('like.user.id = :userId', { userId })
            .getOne()

        if (!like) {
            throw new NotFoundException('Like not found')
        }

        await this.likeRepo.remove(like)

        await this.postsService.decrement(postId, 'likeCount', 1)
        await this.usersService.decrement(like.post.author.id, 'points', USER_POINT_PER_POST_LIKE)
    }

    async getLikesForPost(postId: number, pdto: PaginationDto) {
        const query = this.likeRepo
            .createQueryBuilder('like')
            .leftJoinAndSelect('like.user', 'user')
            .select(['like', ...selectUserBriefColumns('user')])
            .where('like.post.id = :postId', { postId })
            .orderBy('like.id', 'DESC')
            .skip((pdto.page! - 1) * pdto.limit!)
            .take(pdto.limit!)

        const [likes, total] = await query.getManyAndCount()

        return {
            likes,
            total,
            page: pdto.page!,
            limit: pdto.limit!,
        }
    }
}
