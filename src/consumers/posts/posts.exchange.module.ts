import { Module } from '@nestjs/common'
import { RabbitMQConsumerModule } from '../rabbitmq.consumer.module'
import { NotificationConsumer } from './notification.consumer'
import { SearchIndexConsumer } from './searchindex.consumer'

@Module({
    imports: [RabbitMQConsumerModule],
    providers: [NotificationConsumer, SearchIndexConsumer],
})
export class PostsExchangeModule {}
