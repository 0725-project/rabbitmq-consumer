import { IntersectionType } from '@nestjs/swagger'

import { TopicDescriptionDto, TopicNameDto, TopicSlugDto } from '.'

export class CreateTopicDto extends IntersectionType(TopicSlugDto, TopicNameDto, TopicDescriptionDto) {}
