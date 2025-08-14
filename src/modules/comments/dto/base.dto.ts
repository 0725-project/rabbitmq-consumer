import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CommentContentDto {
    @ApiProperty({
        description: 'The content of the comment.',
        example: 'This is a comment on the post.',
    })
    @IsString()
    @IsNotEmpty()
    content: string
}
