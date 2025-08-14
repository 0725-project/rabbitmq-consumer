import { ApiProperty, IntersectionType, OmitType, PartialType } from '@nestjs/swagger'
import { IsIn, IsISO8601, IsString, IsOptional } from 'class-validator'

import { TopicSlugDto } from 'src/modules/topics/dto'
import { PostContentDto, PostTitleDto } from '.'
import { PaginationDto } from 'src/common/dto'

export class GetPostsQueryDto extends IntersectionType(PaginationDto) {
    @ApiProperty({
        description: 'Search query for post content.',
        required: false,
        example: 'nestjs',
    })
    @IsOptional()
    @IsString()
    q?: string

    @ApiProperty({
        description: 'Filter by author username.',
        required: false,
        example: 'foo',
    })
    @IsOptional()
    @IsString()
    author?: string

    @ApiProperty({
        description: 'Filter by topic slug.',
        required: false,
        example: 'programming',
    })
    @IsOptional()
    @IsString()
    topicSlug?: string

    @ApiProperty({
        description: 'Sort by field.',
        required: false,
        enum: ['postId', 'viewCount', 'likeCount'],
        default: 'postId',
    })
    @IsOptional()
    @IsIn(['postId', 'viewCount', 'likeCount'])
    sortBy?: 'postId' | 'viewCount' | 'likeCount' = 'postId'

    @ApiProperty({
        description: 'Order of the results.',
        required: false,
        enum: ['asc', 'desc'],
        default: 'desc',
    })
    @IsOptional()
    @IsIn(['asc', 'desc'])
    order?: 'asc' | 'desc' = 'desc'

    @ApiProperty({
        description: 'Start date for filtering posts.',
        required: false,
        example: '2024-07-25T00:00:00Z',
    })
    @IsOptional()
    @IsISO8601()
    startDate?: string

    @ApiProperty({
        description: 'End date for filtering posts.',
        required: false,
        example: '2025-07-25T00:00:00Z',
    })
    @IsOptional()
    @IsISO8601()
    endDate?: string
}

export class CreatePostDto extends IntersectionType(PostTitleDto, PostContentDto, TopicSlugDto) {}
export class UpdatePostDto extends PartialType(OmitType(CreatePostDto, ['topicSlug'])) {}
