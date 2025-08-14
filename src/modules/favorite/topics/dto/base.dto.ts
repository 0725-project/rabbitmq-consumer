import { ApiProperty } from '@nestjs/swagger'
import { TopicBriefResponseDto } from 'src/modules/topics/dto'

export class FavoriteTopicListDto {
    @ApiProperty({
        description: 'List of favorite topics',
        type: [TopicBriefResponseDto],
    })
    favoriteTopics: TopicBriefResponseDto[]
}
