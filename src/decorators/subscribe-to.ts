import { RabbitSubscribe, RabbitHandlerConfig } from '@golevelup/nestjs-rabbitmq'

type BaseOpts = Pick<RabbitHandlerConfig, 'exchange'> & Partial<RabbitHandlerConfig>

export const SubscribeTo =
    (base: BaseOpts) => (routingKey: string, queue: string, extra?: Partial<RabbitHandlerConfig>) =>
        RabbitSubscribe({
            ...base,
            routingKey,
            queue,
            queueOptions: { durable: true, ...(extra?.queueOptions ?? {}) },
            ...extra,
        })

export const SubscribeToPosts = SubscribeTo({ exchange: 'posts_exchange' })
