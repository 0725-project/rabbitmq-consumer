import { ApiProperty, IntersectionType, OmitType } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength, Matches } from 'class-validator'

import { CreatedAtDto, IdDto, PaginationResponseDto } from 'src/common/dto'
import { UserBriefResponseDto } from 'src/modules/users/dto'
import { TopicDescriptionDto } from '.'

export class TopicSlugResponseDto {
    @ApiProperty({
        description: 'The topic slug associated with the post.',
        example: 'programming',
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-z]+$/, { message: 'The topic slug must be in lowercase letters.' })
    @MaxLength(32)
    slug: string
}

export class TopicNameResponseDto {
    @ApiProperty({
        description: 'The topic name associated with the post.',
        example: 'Programming',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(32)
    name: string
}

export class TopicResponseDto extends IntersectionType(
    IdDto,
    TopicSlugResponseDto,
    TopicNameResponseDto,
    TopicDescriptionDto,
    CreatedAtDto,
) {
    @ApiProperty({
        description: 'The creator of the topic.',
        type: UserBriefResponseDto,
    })
    creator: UserBriefResponseDto

    @ApiProperty({
        description: 'The number of posts associated with the topic.',
        example: 42,
    })
    @IsNotEmpty()
    postCount: number
}

export class TopicsResponseDto extends IntersectionType(PaginationResponseDto) {
    @ApiProperty({
        description: 'List of topics.',
        type: [TopicResponseDto],
    })
    topics: TopicResponseDto[]
}

export class TopicBriefResponseDto extends IntersectionType(
    IdDto,
    TopicSlugResponseDto,
    TopicNameResponseDto,
    TopicDescriptionDto,
) {}
export class CreateTopicResponseDto extends IntersectionType(OmitType(TopicResponseDto, ['creator', 'postCount'])) {}
