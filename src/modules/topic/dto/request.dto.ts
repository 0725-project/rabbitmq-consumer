import { IntersectionType } from '@nestjs/swagger'
import { TopicLocalIdDto, TopicSlugDto } from 'src/modules/topics/dto'

export class GetTopicPostParamDto extends IntersectionType(TopicSlugDto, TopicLocalIdDto) {}
