import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common'
import { UploadService } from './upload.service'
import {
    GeneratePresignedUrlRequestDto,
    GenerateProfileImagePresignedUrlRequestDto,
    PresignedUrlResponseDto,
} from './dto'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { AuthenticatedRequest } from 'src/common/types/express-request.interface'

@Controller('upload')
@ApiTags('Upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @Post('presigned-url')
    @ApiOperation({ summary: 'Generate a presigned URL for file upload' })
    @ApiResponse({ status: 201, description: 'Presigned URL generated successfully', type: PresignedUrlResponseDto })
    @ApiBadRequestResponse({ description: 'Invalid request' })
    getPresignedUrl(@Body() dto: GeneratePresignedUrlRequestDto): Promise<PresignedUrlResponseDto> {
        return this.uploadService.generatePresignedUrl(dto)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('profile')
    @ApiOperation({ summary: 'Generate a presigned URL for profile image upload' })
    @ApiResponse({ status: 201, description: 'Presigned URL generated successfully', type: PresignedUrlResponseDto })
    @ApiBadRequestResponse({ description: 'Invalid request' })
    getProfileImagePresignedUrl(
        @Body() dto: GenerateProfileImagePresignedUrlRequestDto,
        @Req() req: AuthenticatedRequest,
    ): Promise<PresignedUrlResponseDto> {
        return this.uploadService.generateProfileImagePresignedUrl(dto.fileExtension, req.user.userId)
    }
}
