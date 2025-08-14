import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Topic } from './topics.entity'

import { CreateTopicDto } from './dto'
import { selectUserBriefColumns } from 'src/common/constants'
import { PaginationDto } from 'src/common/dto'

@Injectable()
export class TopicsService {
    constructor(
        @InjectRepository(Topic)
        private readonly topicRepo: Repository<Topic>,
    ) {}

    async create(createTopicDto: CreateTopicDto, creatorId: number) {
        const topic = this.topicRepo.create({
            ...createTopicDto,
            slug: createTopicDto.topicSlug,
            name: createTopicDto.topicName,
            description: createTopicDto.description,
            creator: { id: creatorId },
        })

        const { id, slug, name, description, createdAt } = await this.topicRepo.save(topic)
        return {
            id,
            slug,
            name,
            description,
            createdAt,
        }
    }

    async findBySlug(slug: string) {
        const topic = await this.topicRepo
            .createQueryBuilder('topic')
            .leftJoinAndSelect('topic.creator', 'creator')
            .select(['topic', ...selectUserBriefColumns('creator')])
            .where('topic.slug = :slug', { slug })
            .getOne()
        if (!topic) throw new NotFoundException('Topic not found')

        return topic
    }

    async findAll(pdto: PaginationDto) {
        const query = this.topicRepo
            .createQueryBuilder('topic')
            .leftJoinAndSelect('topic.creator', 'creator')
            .select(['topic', ...selectUserBriefColumns('creator')])
            .orderBy('topic.id', 'DESC')
            .skip((pdto.page! - 1) * pdto.limit!)
            .take(pdto.limit!)

        const [topics, total] = await query.getManyAndCount()

        return {
            topics,
            total,
            page: pdto.page!,
            limit: pdto.limit!,
        }
    }

    async increment(topicId: number, field: keyof Topic, value: number) {
        await this.topicRepo.increment({ id: topicId }, field, value)
    }

    async decrement(topicId: number, field: keyof Topic, value: number) {
        await this.topicRepo.decrement({ id: topicId }, field, value)
    }
}
