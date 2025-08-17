import { Injectable } from '@nestjs/common'
import { SubscribeToPosts } from 'src/decorators/subscribe-to'

@Injectable()
export class NotificationConsumer {
    @SubscribeToPosts('posts.created', 'notification_queue')
    async onPostCreated(msg: any) {
        console.log('Notification - Post Created:', msg)
    }
}
