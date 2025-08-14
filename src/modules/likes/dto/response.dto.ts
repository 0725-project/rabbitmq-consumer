import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { IntersectionType } from '@nestjs/swagger'

import { UserBriefResponseDto } from 'src/modules/users/dto'
import { CreatedAtDto, PaginationResponseDto } from 'src/common/dto'

class LikeResponseDto extends IntersectionType(CreatedAtDto) {
    @ApiProperty({
        description: 'The user who liked the post.',
        type: UserBriefResponseDto,
    })
    @IsNotEmpty()
    user: UserBriefResponseDto
}

export class GetLikesResponseDto extends IntersectionType(PaginationResponseDto) {
    @ApiProperty({
        description: 'List of users who liked the post.',
        type: [LikeResponseDto],
    })
    @IsNotEmpty()
    likes: LikeResponseDto[]
}
