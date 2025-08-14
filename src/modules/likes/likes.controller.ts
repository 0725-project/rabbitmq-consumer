import { Controller, Post, Delete, Param, Request, UseGuards, Get, Query } from '@nestjs/common'
import { LikesService } from './likes.service'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse,
    ApiNotFoundResponse,
    ApiBadRequestResponse,
    ApiConflictResponse,
} from '@nestjs/swagger'
import { AuthenticatedRequest } from 'src/common/types/express-request.interface'

import { PostIdDto } from '../posts/dto'
import { PaginationDto } from 'src/common/dto'
import { GetLikesResponseDto } from './dto/response.dto'

@ApiTags('Likes')
@Controller('likes')
export class LikesController {
    constructor(private likesService: LikesService) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post(':postId')
    @ApiOperation({ summary: 'Like a post' })
    @ApiResponse({ status: 201, description: 'Liked successfully.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiNotFoundResponse({ description: 'Post not found.' })
    @ApiConflictResponse({ description: 'Already liked.' })
    @ApiBadRequestResponse({ description: 'Invalid post ID.' })
    async likePost(@Param() { postId }: PostIdDto, @Request() req: AuthenticatedRequest) {
        return this.likesService.likePost(postId, req.user.userId)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete(':postId')
    @ApiOperation({ summary: 'Unlike a post' })
    @ApiResponse({ status: 200, description: 'Unliked successfully.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiNotFoundResponse({ description: 'Like not found.' })
    @ApiBadRequestResponse({ description: 'Invalid post ID.' })
    async unlikePost(@Param() { postId }: PostIdDto, @Request() req: AuthenticatedRequest) {
        return this.likesService.unlikePost(postId, req.user.userId)
    }

    @Get(':postId')
    @ApiOperation({ summary: 'Get likes for a post' })
    @ApiResponse({ status: 200, description: 'Returns likes for the post.', type: GetLikesResponseDto })
    @ApiNotFoundResponse({ description: 'Post not found.' })
    @ApiBadRequestResponse({ description: 'Invalid post ID.' })
    async getLikes(@Param() { postId }: PostIdDto, @Query() pdto: PaginationDto): Promise<GetLikesResponseDto> {
        return this.likesService.getLikesForPost(postId, pdto)
    }
}
