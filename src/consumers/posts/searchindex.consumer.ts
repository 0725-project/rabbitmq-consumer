import { Injectable } from '@nestjs/common'
import { SubscribeToPosts } from 'src/decorators/subscribe-to'

@Injectable()
export class SearchIndexConsumer {
    @SubscribeToPosts('posts.created', 'searchindex_queue')
    async onPostCreated(msg: any) {
        console.log('Search Index - Post Created:', msg)
    }
}
