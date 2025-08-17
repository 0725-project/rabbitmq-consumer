import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe } from '@nestjs/common'

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

    await app.listen(PORT)

    const logger = new Logger('Bootstrap')
    logger.log(`RabbitMQ Consumer Application is running on: ${await app.getUrl()}`)
}

bootstrap()
