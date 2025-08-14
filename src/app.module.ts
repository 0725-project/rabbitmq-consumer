import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { RabbitMQConsumerModule } from './consumers/rabbitmq.consumer.module'

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), RabbitMQConsumerModule],
    controllers: [AppController],
})
export class AppModule {}
