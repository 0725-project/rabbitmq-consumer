import { Controller, Post, Body, UseGuards, Request, Get, Param, Query } from '@nestjs/common'
import { TopicsService } from './topics.service'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { AuthenticatedRequest } from 'src/common/types/express-request.interface'
import {
    ApiBearerAuth,
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBadRequestResponse,
    ApiConflictResponse,
    ApiNotFoundResponse,
} from '@nestjs/swagger'

import { PaginationDto } from 'src/common/dto'
import { CreateTopicResponseDto, TopicResponseDto, TopicsResponseDto, CreateTopicDto, TopicSlugDto } from './dto'

@ApiTags('Topics')
@Controller('topics')
export class TopicsController {
    constructor(private readonly topicService: TopicsService) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post()
    @ApiOperation({ summary: 'Create a new topic' })
    @ApiResponse({ status: 201, description: 'Topic created successfully', type: CreateTopicResponseDto })
    @ApiBadRequestResponse({ description: 'Invalid request' })
    @ApiConflictResponse({ description: 'Topic already exists' })
    create(@Body() dto: CreateTopicDto, @Request() req: AuthenticatedRequest): Promise<CreateTopicResponseDto> {
        return this.topicService.create(dto, req.user.userId)
    }

    @Get()
    @ApiOperation({ summary: 'Get all topics with pagination' })
    @ApiResponse({ status: 200, description: 'Return a list of topics', type: TopicsResponseDto })
    @ApiBadRequestResponse({ description: 'Invalid pagination parameters.' })
    findAll(@Query() pdto: PaginationDto): Promise<TopicsResponseDto> {
        return this.topicService.findAll(pdto)
    }

    @Get(':topicSlug')
    @ApiOperation({ summary: 'Get a single topic by slug' })
    @ApiResponse({ status: 200, description: 'Return a single topic', type: TopicResponseDto })
    @ApiNotFoundResponse({ description: 'Topic not found' })
    findBySlug(@Param() { topicSlug }: TopicSlugDto): Promise<TopicResponseDto> {
        return this.topicService.findBySlug(topicSlug)
    }
}
