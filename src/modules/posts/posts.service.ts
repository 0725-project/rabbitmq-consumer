import { Injectable, NotFoundException, ForbiddenException, Inject, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Post } from './posts.entity'
import { Repository } from 'typeorm'
import { RedisService } from 'src/common/redis/redis.service'
import { selectUserBriefColumns, selectTopicBriefColumns, USER_POINT_PER_POST } from 'src/common/constants'
import { RabbitMQService } from 'src/common/rabbitmq/rabbitmq.service'

import { CreatePostDto, GetPostsQueryDto, UpdatePostDto } from './dto'
import { UsersService } from '../users/users.service'
import { TopicsService } from '../topics/topics.service'

@Injectable()
export class PostsService {
    constructor(
        private redisService: RedisService,
        @InjectRepository(Post) private postRepo: Repository<Post>,
        private usersService: UsersService,
        private topicsService: TopicsService,
        private rabbitMQService: RabbitMQService,
    ) {}

    async create(createPostDto: CreatePostDto, userId: number, ip: string) {
        const topic = await this.topicsService.findBySlug(createPostDto.topicSlug)
        if (!topic) throw new NotFoundException('Topic not found')

        const count = await this.postRepo.count({ where: { topic: { id: topic.id } } })

        const post = this.postRepo.create({
            ...createPostDto,
            author: { id: userId },
            topic,
            topicLocalId: count + 1,
            viewCount: 0,
            commentCount: 0,
            likeCount: 0,
            ip,
        })

        await this.topicsService.increment(topic.id, 'postCount', 1)
        await this.usersService.increment(userId, 'postCount', 1)
        await this.usersService.increment(userId, 'points', USER_POINT_PER_POST)

        const saved = await this.postRepo.save(post)

        this.rabbitMQService.publishPostCreated({
            postId: saved.id,
            title: saved.title,
            authorId: userId,
            topicId: topic.id,
        })
    }

    async findAll(dto: GetPostsQueryDto) {
        const query = this.postRepo
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.topic', 'topic')
            .select(['post', ...selectUserBriefColumns('author'), ...selectTopicBriefColumns('topic')])

        const sortBy = (dto.sortBy ?? 'postId') === 'postId' ? 'id' : dto.sortBy
        const order = (dto.order ?? 'DESC').toUpperCase() as 'ASC' | 'DESC'
        query.orderBy(`post.${sortBy}`, order)

        query.skip((dto.page! - 1) * dto.limit!)
        query.take(dto.limit!)

        if (dto.q) {
            query.andWhere('(post.title ILIKE :q OR post.content ILIKE :q)', { q: `%${dto.q}%` })
        }

        if (dto.author) {
            query.andWhere('author.username ILIKE :author', { author: `%${dto.author}%` })
        }

        if (dto.topicSlug) {
            query.andWhere('topic.slug ILIKE :topicSlug', { topicSlug: `%${dto.topicSlug}%` })
        }

        if (dto.startDate) {
            query.andWhere('post.createdAt >= :startDate', { startDate: new Date(dto.startDate) })
        }

        if (dto.endDate) {
            const endDateObj = new Date(dto.endDate)
            endDateObj.setSeconds(endDateObj.getSeconds() + 1)
            query.andWhere('post.createdAt <= :endDate', { endDate: endDateObj })
        }

        const [posts, total] = await query.getManyAndCount()

        return {
            posts,
            total,
            page: dto.page!,
            limit: dto.limit!,
        }
    }

    async findOne(id: number) {
        const post = await this.postRepo
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.topic', 'topic')
            .select(['post', ...selectUserBriefColumns('author'), ...selectTopicBriefColumns('topic')])
            .where('post.id = :id', { id })
            .getOne()
        if (!post) {
            throw new NotFoundException('Post not found')
        }

        return post
    }

    async update(id: number, updatePostDto: UpdatePostDto, userId: number) {
        const post = await this.postRepo
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.topic', 'topic')
            .select(['post', ...selectUserBriefColumns('author'), ...selectTopicBriefColumns('topic')])
            .where('post.id = :id', { id })
            .getOne()
        if (!post) {
            throw new NotFoundException('Post not found')
        }

        if (post.author.id !== userId) {
            throw new ForbiddenException('You are not the author of this post')
        }

        Object.assign(post, updatePostDto)
        return this.postRepo.save(post)
    }

    async delete(id: number, userId: number) {
        const post = await this.postRepo
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.topic', 'topic')
            .select(['post', ...selectUserBriefColumns('author'), ...selectTopicBriefColumns('topic')])
            .where('post.id = :id', { id })
            .getOne()
        if (!post) {
            throw new NotFoundException('Post not found')
        }

        if (post.author.id !== userId) {
            throw new ForbiddenException('You are not authorized to delete this post')
        }

        await this.postRepo.remove(post)

        await this.topicsService.decrement(post.topic.id, 'postCount', 1)
        await this.usersService.decrement(userId, 'postCount', 1)
        await this.usersService.decrement(userId, 'points', USER_POINT_PER_POST)
    }

    async incrementViewCount(postId: number, ip: string) {
        const key = `post:${postId}:viewer:${ip}`
        const exists = await this.redisService.get(key)
        if (!exists) {
            await this.redisService.set(key, '1', 5) // 1 hour TTL TODO
            await this.postRepo.increment({ id: postId }, 'viewCount', 1)
        }
    }

    async increment(postId: number, column: string, value: number) {
        await this.postRepo.increment({ id: postId }, column, value)
    }

    async decrement(postId: number, column: string, value: number) {
        await this.postRepo.decrement({ id: postId }, column, value)
    }
}
