import { Injectable } from '@nestjs/common'
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq'

@Injectable()
export class SearchIndexConsumer {
    @RabbitSubscribe({
        exchange: 'posts_exchange',
        routingKey: 'posts.created',
        queue: 'searchindex_queue',
        queueOptions: { durable: true },
    })
    async onPostCreated(msg: any) {
        console.log('Search Index - Post Created:', msg)
    }
}
