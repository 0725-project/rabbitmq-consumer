import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { RabbitMQConsumerModule } from './consumers/rabbitmq.consumer.module'
import { PostsExchangeModule } from './consumers/posts/posts.exchange.module'

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), RabbitMQConsumerModule, PostsExchangeModule],
    controllers: [AppController],
})
export class AppModule {}
