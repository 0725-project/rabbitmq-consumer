import { Module } from '@nestjs/common'
import { RabbitMQModule as GolevelupRabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { NotificationConsumer } from './notification.consumer'
import { SearchIndexConsumer } from './searchindex.consumer'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
    imports: [
        GolevelupRabbitMQModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                uri: config.get('RABBITMQ_URL') ?? 'amqp://localhost:5672',
                prefetchCount: 10,
                exchanges: [{ name: 'posts_exchange', type: 'topic', options: { durable: true } }],
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [NotificationConsumer, SearchIndexConsumer],
})
export class RabbitMQConsumerModule {}
