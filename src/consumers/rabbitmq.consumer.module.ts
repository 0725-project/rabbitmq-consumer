import { Module } from '@nestjs/common'
import { RabbitMQModule as GolevelupRabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
    imports: [
        GolevelupRabbitMQModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                uri: config.get('RABBITMQ_URL') ?? 'amqp://localhost:5672',
                prefetchCount: 10,
                exchanges: [{ name: 'posts_exchange', type: 'topic', options: { durable: true } }],
            }),
        }),
    ],
    exports: [GolevelupRabbitMQModule],
})
export class RabbitMQConsumerModule {}
