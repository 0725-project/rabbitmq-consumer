import { Controller, Delete, Post, Param, Req, UseGuards } from '@nestjs/common'
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiConflictResponse,
    ApiNotFoundResponse,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { FavoriteTopicsService } from './favtopics.service'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { AuthenticatedRequest } from 'src/common/types/express-request.interface'

import { TopicSlugDto } from 'src/modules/topics/dto'

@ApiTags('Favorite Topics')
@Controller('favtopics')
export class FavoriteTopicsController {
    constructor(private favoriteTopicsService: FavoriteTopicsService) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post(':topicSlug')
    @ApiOperation({ summary: 'Add a topic to favorites' })
    @ApiResponse({ status: 201, description: 'Topic added to favorites successfully.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiNotFoundResponse({ description: 'Topic not found.' })
    @ApiBadRequestResponse({ description: 'Invalid topic slug.' })
    @ApiConflictResponse({ description: 'Topic already in favorites.' })
    async addFavoriteTopic(@Param() { topicSlug }: TopicSlugDto, @Req() req: AuthenticatedRequest) {
        await this.favoriteTopicsService.addFavoriteTopic(req.user.userId, topicSlug)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete(':topicSlug')
    @ApiOperation({ summary: 'Remove a topic from favorites' })
    @ApiResponse({ status: 200, description: 'Topic removed from favorites successfully.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiNotFoundResponse({ description: 'Topic not found.' })
    @ApiBadRequestResponse({ description: 'Invalid topic slug.' })
    @ApiConflictResponse({ description: 'Topic not in favorites.' })
    async removeFavoriteTopic(@Param() { topicSlug }: TopicSlugDto, @Req() req: AuthenticatedRequest) {
        await this.favoriteTopicsService.removeFavoriteTopic(req.user.userId, topicSlug)
    }
}
