import { Injectable, OnModuleInit } from '@nestjs/common'
import { Channel, connect } from 'amqplib'

@Injectable()
export class RabbitMQService implements OnModuleInit {
    private channel: Channel
    private readonly exchange = 'posts_exchange'
    private readonly notificationQueue = 'notification_queue'
    private readonly searchIndexQueue = 'searchindex_queue'
    private readonly routingKey = 'post.created'

    async onModuleInit() {
        const connection = await connect(process.env.RABBITMQ_URL || 'amqp://localhost:5672')
        this.channel = await connection.createChannel()
        await this.channel.assertExchange(this.exchange, 'topic', { durable: true })

        await this.channel.assertQueue(this.notificationQueue, { durable: true })
        await this.channel.assertQueue(this.searchIndexQueue, { durable: true })

        await this.channel.bindQueue(this.notificationQueue, this.exchange, this.routingKey)
        await this.channel.bindQueue(this.searchIndexQueue, this.exchange, this.routingKey)
    }

    async publishPostCreated(data: any) {
        if (!this.channel) throw new Error('RabbitMQ channel not initialized')
        this.channel.publish(this.exchange, this.routingKey, Buffer.from(JSON.stringify(data)), { persistent: true })
    }
}
