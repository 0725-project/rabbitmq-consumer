import { IntersectionType, PickType } from '@nestjs/swagger'
import { ApiProperty, OmitType } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

import { CreatedAtDto, IdDto, PaginationResponseDto } from 'src/common/dto'
import { TopicLocalIdDto, TopicBriefResponseDto } from 'src/modules/topics/dto'
import { UserBriefResponseDto } from 'src/modules/users/dto'
import { CommentCountDto, LikeCountDto, PostContentDto, PostTitleDto, ViewCountDto } from '.'

export class PostResponseDto extends IntersectionType(
    IdDto,
    PostTitleDto,
    PostContentDto,
    CreatedAtDto,
    TopicLocalIdDto,
    ViewCountDto,
    CommentCountDto,
    LikeCountDto,
) {
    @ApiProperty({
        description: 'The author of the post.',
        type: UserBriefResponseDto,
    })
    @IsNotEmpty()
    author: UserBriefResponseDto

    @ApiProperty({
        description: 'The topic of the post.',
        type: TopicBriefResponseDto,
    })
    @IsNotEmpty()
    topic: TopicBriefResponseDto
}

export class PostBriefResponseDto extends IntersectionType(OmitType(PostResponseDto, ['content'])) {}

export class PostsResponseDto extends IntersectionType(PaginationResponseDto) {
    @ApiProperty({
        description: 'List of posts.',
        type: [PostResponseDto],
    })
    posts: PostResponseDto[]
}

export class CreatePostResponseDto extends IntersectionType(OmitType(PostResponseDto, ['author', 'topic'])) {}
