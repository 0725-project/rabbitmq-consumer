import { Injectable } from '@nestjs/common'
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq'

@Injectable()
export class NotificationConsumer {
    @RabbitSubscribe({
        exchange: 'posts_exchange',
        routingKey: 'posts.created',
        queue: 'notification_queue',
        queueOptions: { durable: true },
    })
    async onPostCreated(msg: any) {
        console.log('Notification - Post Created:', msg)
    }
}
