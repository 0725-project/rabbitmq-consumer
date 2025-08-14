import { ApiProperty, IntersectionType } from '@nestjs/swagger'
import { OmitType } from '@nestjs/swagger'

import { PaginationResponseDto } from 'src/common/dto'
import { PostResponseDto } from 'src/modules/posts/dto'

class TopicPostResponseDto extends OmitType(PostResponseDto, ['topicLocalId', 'topic']) {}

export class TopicPostsResponseDto extends IntersectionType(PaginationResponseDto) {
    @ApiProperty({
        description: 'List of posts in the topic.',
        type: [TopicPostResponseDto],
    })
    posts: TopicPostResponseDto[]
}
