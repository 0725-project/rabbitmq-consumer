import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { Type } from 'class-transformer'

export class PostIdDto {
    @ApiProperty({
        description: 'The ID of the post.',
        example: 1,
    })
    @Type(() => Number)
    @IsInt()
    @IsNotEmpty()
    postId: number
}

export class PostTitleDto {
    @ApiProperty({
        description: 'The title of the post.',
        example: 'My First Post',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    title: string
}

export class PostContentDto {
    @ApiProperty({
        description: 'The content of the post.',
        example: 'This is the content of my first post.',
    })
    @IsString()
    @IsNotEmpty()
    content: string
}

export class ViewCountDto {
    @ApiProperty({
        description: 'The number of views for the post.',
        example: 100,
    })
    @Type(() => Number)
    @IsInt()
    @IsNotEmpty()
    viewCount: number
}

export class CommentCountDto {
    @ApiProperty({
        description: 'The number of comments on the post.',
        example: 5,
    })
    @Type(() => Number)
    @IsInt()
    @IsNotEmpty()
    commentCount: number
}

export class LikeCountDto {
    @ApiProperty({
        description: 'The number of likes on the post.',
        example: 10,
    })
    @Type(() => Number)
    @IsInt()
    @IsNotEmpty()
    likeCount: number
}
