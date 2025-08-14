import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { selectTopicBriefColumns, selectUserBriefColumns } from 'src/common/constants'
import { Post } from 'src/modules/posts/posts.entity'
import { Topic } from 'src/modules/topics/topics.entity'
import { Repository } from 'typeorm'

import { PaginationDto } from 'src/common/dto'

@Injectable()
export class TopicService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepo: Repository<Post>,
        @InjectRepository(Topic)
        private readonly topicRepo: Repository<Topic>,
    ) {}

    async postsFindByTopicSlug(topicSlug: string, pdto: PaginationDto) {
        const topic = await this.topicRepo.findOne({ where: { slug: topicSlug } })
        if (!topic) throw new NotFoundException('Topic not found')

        const query = this.postRepo
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.topic', 'topic')
            .select(['post', ...selectUserBriefColumns('author')])
            .where('topic.id = :topicId', { topicId: topic.id })
            .orderBy('post.id', 'DESC')
            .skip((pdto.page! - 1) * pdto.limit!)
            .take(pdto.limit!)

        const [posts, total] = await query.getManyAndCount()

        return {
            posts,
            total,
            page: pdto.page!,
            limit: pdto.limit!,
        }
    }

    async postFindByTopicLocalId(topicSlug: string, topicLocalId: number) {
        const topic = await this.topicRepo.findOne({ where: { slug: topicSlug } })
        if (!topic) throw new NotFoundException('Topic not found')

        const post = await this.postRepo
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.topic', 'topic')
            .select(['post', ...selectUserBriefColumns('author'), ...selectTopicBriefColumns('topic')])
            .where('post.topic.id = :topicId', { topicId: topic.id })
            .andWhere('post.topicLocalId = :topicLocalId', { topicLocalId })
            .getOne()
        if (!post) throw new NotFoundException('Post not found')

        return post
    }
}
