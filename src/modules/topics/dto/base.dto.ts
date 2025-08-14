import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, IsString, MaxLength, Matches } from 'class-validator'
import { Type } from 'class-transformer'

export class TopicSlugDto {
    @ApiProperty({
        description: 'The topic slug associated with the post.',
        example: 'programming',
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-z]+$/, { message: 'The topic slug must be in lowercase letters.' })
    @MaxLength(32)
    topicSlug: string
}

export class TopicNameDto {
    @ApiProperty({
        description: 'The topic name associated with the post.',
        example: 'Programming',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(32)
    topicName: string
}

export class TopicDescriptionDto {
    @ApiProperty({
        description: 'The description of the topic.',
        example: 'Programming discussions and resources',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    description: string
}

export class TopicLocalIdDto {
    @ApiProperty({
        description: 'The local ID of the post within the topic.',
        example: 1,
    })
    @Type(() => Number)
    @IsInt()
    @IsNotEmpty()
    topicLocalId: number
}
