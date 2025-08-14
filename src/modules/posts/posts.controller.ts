import { Controller, Get, Body, Param, Delete, Put, Request, UseGuards, Post, Query, Ip } from '@nestjs/common'
import { PostsService } from './posts.service'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse,
    ApiNotFoundResponse,
    ApiForbiddenResponse,
    ApiBadRequestResponse,
} from '@nestjs/swagger'
import { AuthenticatedRequest } from 'src/common/types/express-request.interface'

import { IdDto } from 'src/common/dto'
import {
    CreatePostDto,
    UpdatePostDto,
    CreatePostResponseDto,
    PostResponseDto,
    PostsResponseDto,
    GetPostsQueryDto,
} from './dto'

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post()
    @ApiOperation({ summary: 'Create a new post' })
    @ApiResponse({ status: 201, description: 'The post has been successfully created.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiBadRequestResponse({ description: 'Invalid payload.' })
    create(
        @Body() createPostDto: CreatePostDto,
        @Request() req: AuthenticatedRequest,
        @Ip() ip: string,
    ): Promise<void> {
        return this.postsService.create(createPostDto, req.user.userId, ip)
    }

    @Get()
    @ApiOperation({ summary: 'Get posts with page pagination' })
    @ApiResponse({ status: 200, description: 'Return paginated posts.', type: PostsResponseDto })
    @ApiBadRequestResponse({ description: 'Invalid pagination parameters.' })
    findAll(@Query() dto: GetPostsQueryDto): Promise<PostsResponseDto> {
        return this.postsService.findAll(dto)
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a single post by id' })
    @ApiResponse({ status: 200, description: 'Return a single post.', type: PostResponseDto })
    @ApiBadRequestResponse({ description: 'Invalid ID.' })
    @ApiNotFoundResponse({ description: 'Post not found.' })
    findOne(@Param() { id }: IdDto): Promise<PostResponseDto> {
        return this.postsService.findOne(id)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Put(':id')
    @ApiOperation({ summary: 'Update a post' })
    @ApiResponse({ status: 200, description: 'The post has been successfully updated.', type: PostResponseDto })
    @ApiBadRequestResponse({ description: 'Invalid ID or payload.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiNotFoundResponse({ description: 'Post not found.' })
    @ApiForbiddenResponse({ description: 'You are not the author of this post.' })
    update(
        @Param() { id }: IdDto,
        @Body() updatePostDto: UpdatePostDto,
        @Request() req: AuthenticatedRequest,
    ): Promise<PostResponseDto> {
        return this.postsService.update(id, updatePostDto, req.user.userId)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a post' })
    @ApiResponse({ status: 200, description: 'The post has been successfully deleted.' })
    @ApiBadRequestResponse({ description: 'Invalid ID.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiNotFoundResponse({ description: 'Post not found.' })
    @ApiForbiddenResponse({ description: 'You are not the author of this post.' })
    delete(@Param() { id }: IdDto, @Request() req: AuthenticatedRequest) {
        return this.postsService.delete(id, req.user.userId)
    }

    @Post(':id/view-count')
    @ApiOperation({ summary: 'Increment view count of a post' })
    @ApiResponse({ status: 200, description: 'View count incremented successfully.' })
    @ApiBadRequestResponse({ description: 'Invalid ID.' })
    @ApiNotFoundResponse({ description: 'Post not found.' })
    incrementViewCount(@Param() { id }: IdDto, @Ip() ip: string): Promise<void> {
        return this.postsService.incrementViewCount(id, ip)
    }
}
