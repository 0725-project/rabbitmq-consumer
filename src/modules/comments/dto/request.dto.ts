import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger'
import { IsIn, IsString } from 'class-validator'
import { PaginationDto } from 'src/common/dto'

export class CreateCommentDto {
    @ApiProperty({ description: 'The content of the comment.', example: 'This is a comment.' })
    @IsString()
    content: string
}

export class UpdateCommentDto extends PartialType(CreateCommentDto) {}

export class GetPostCommentsDto extends IntersectionType(PaginationDto) {
    @ApiProperty({ description: 'The order in which to return comments.', example: 'desc', default: 'desc' })
    @IsString()
    @IsIn(['asc', 'desc'])
    order?: 'asc' | 'desc'
}
