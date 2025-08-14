import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe } from '@nestjs/common'
import { Transport } from '@nestjs/microservices'

const PORT = process.env.PORT ?? 3001
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule)
    app.setGlobalPrefix('rmq')
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }),
    )

    app.enableCors({
        origin: IS_PRODUCTION ? process.env.FRONTEND_URL : 'http://localhost:4000',
        credentials: true,
    })

    const searchIndexer = await NestFactory.createMicroservice(AppModule, {
        transport: Transport.RMQ,
        options: {
            urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
            queue: 'search_indexing_queue',
            queueOptions: { durable: true },
            exchange: 'posts_exchange',
            exchangeType: 'topic',
        },
    })
    searchIndexer.listen()

    const notificationService = await NestFactory.createMicroservice(AppModule, {
        transport: Transport.RMQ,
        options: {
            urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
            queue: 'notification_queue',
            queueOptions: { durable: true },
            exchange: 'posts_exchange',
            exchangeType: 'topic',
        },
    })
    notificationService.listen()

    await app.listen(PORT)

    const logger = new Logger('Bootstrap')
    logger.log(`RabbitMQ Consumer Application is running on: ${await app.getUrl()}`)
}

bootstrap()
