import { Controller, Post, Body, Get, Query, Param, UseGuards, Req, Put, Delete } from '@nestjs/common'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse,
    ApiNotFoundResponse,
    ApiBadRequestResponse,
    ApiForbiddenResponse,
} from '@nestjs/swagger'
import { CommentsService } from './comments.service'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { AuthenticatedRequest } from 'src/common/types/express-request.interface'

import { IdDto, PaginationDto } from 'src/common/dto'
import {
    CommentResponseDto,
    CommentsResponseDto,
    CreateCommentDto,
    UpdateCommentDto,
    CommentsWithDetailsResponseDto,
    GetPostCommentsDto,
} from './dto'
import { PostIdDto } from 'src/modules/posts/dto'

@ApiTags('Comments')
@Controller()
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('posts/:postId/comments')
    @ApiOperation({ summary: 'Create a new comment' })
    @ApiResponse({
        status: 201,
        description: 'The comment has been successfully created.',
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiBadRequestResponse({ description: 'Invalid payload.' })
    @ApiNotFoundResponse({ description: 'Post not found.' })
    create(
        @Param() { postId }: PostIdDto,
        @Body() dto: CreateCommentDto,
        @Req() req: AuthenticatedRequest,
    ): Promise<void> {
        return this.commentsService.create(postId, dto, req.user.userId)
    }

    @Get('posts/:postId/comments')
    @ApiOperation({ summary: 'Get comments for a post' })
    @ApiResponse({ status: 200, description: 'Return paginated comments.', type: CommentsResponseDto })
    @ApiBadRequestResponse({ description: 'Invalid pagination parameters.' })
    getComments(@Param() { postId }: PostIdDto, @Query() dto: GetPostCommentsDto): Promise<CommentsResponseDto> {
        return this.commentsService.getComments(postId, dto)
    }

    @Put('comments/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Update a comment' })
    @ApiResponse({ status: 200, description: 'The comment has been successfully updated.', type: CommentResponseDto })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiBadRequestResponse({ description: 'Invalid payload.' })
    @ApiNotFoundResponse({ description: 'Comment not found.' })
    @ApiForbiddenResponse({ description: 'You do not have permission to edit this comment.' })
    update(
        @Param() { id }: IdDto,
        @Body() dto: UpdateCommentDto,
        @Req() req: AuthenticatedRequest,
    ): Promise<CommentResponseDto> {
        return this.commentsService.update(id, dto, req.user.userId)
    }

    @Delete('comments/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Delete a comment' })
    @ApiResponse({ status: 204, description: 'The comment has been successfully deleted.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiBadRequestResponse({ description: 'Invalid ID.' })
    @ApiNotFoundResponse({ description: 'Comment not found.' })
    @ApiForbiddenResponse({ description: 'You do not have permission to delete this comment.' })
    delete(@Param() { id }: IdDto, @Req() req: AuthenticatedRequest) {
        return this.commentsService.delete(id, req.user.userId)
    }

    @Get('comments')
    @ApiOperation({ summary: 'Get all comments with pagination' })
    @ApiResponse({
        status: 200,
        description: 'Return paginated comments with details.',
        type: CommentsWithDetailsResponseDto,
    })
    @ApiBadRequestResponse({ description: 'Invalid pagination parameters.' })
    getAllComments(@Query() pdto: PaginationDto): Promise<CommentsWithDetailsResponseDto> {
        return this.commentsService.getAllComments(pdto)
    }
}
