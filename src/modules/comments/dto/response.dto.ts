import { ApiProperty, IntersectionType, OmitType } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

import { CreatedAtDto, IdDto, PaginationResponseDto } from 'src/common/dto'
import { UserBriefResponseDto } from 'src/modules/users/dto'
import { PostBriefResponseDto } from 'src/modules/posts/dto'
import { CommentContentDto } from '.'

export class CommentResponseDto extends IntersectionType(IdDto, CommentContentDto, CreatedAtDto) {
    @ApiProperty({
        description: 'The author of the comment.',
        type: UserBriefResponseDto,
    })
    @IsNotEmpty()
    user: UserBriefResponseDto
}

export class CommentsResponseDto extends IntersectionType(PaginationResponseDto) {
    @ApiProperty({
        description: 'List of comments.',
        type: [CommentResponseDto],
    })
    comments: CommentResponseDto[]
}

export class CommentWithDetailsResponseDto extends IntersectionType(CommentResponseDto) {
    @ApiProperty({
        description: 'The post associated with the comment.',
        type: PostBriefResponseDto,
    })
    post: PostBriefResponseDto
}

export class CommentsWithDetailsResponseDto extends IntersectionType(PaginationResponseDto) {
    @ApiProperty({
        description: 'List of comments with post details.',
        type: [CommentWithDetailsResponseDto],
    })
    comments: CommentWithDetailsResponseDto[]
}

export class CreateCommentResponseDto extends IntersectionType(OmitType(CommentResponseDto, ['user'])) {}
