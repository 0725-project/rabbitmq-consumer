import { Inject, Injectable } from '@nestjs/common'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { ConfigService } from '@nestjs/config'
import { GeneratePresignedUrlRequestDto, PresignedUrlResponseDto } from './dto'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class UploadService {
    constructor(
        @Inject('S3_CLIENT')
        private readonly s3: S3Client,
        private readonly configService: ConfigService,
    ) {}

    async generatePresignedUrl(dto: GeneratePresignedUrlRequestDto): Promise<PresignedUrlResponseDto> {
        const key = `uploads/${uuidv4()}/${dto.filename}`

        const { url, fields } = await createPresignedPost(this.s3, {
            Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME') ?? '',
            Key: key,
            Fields: {
                'Content-Type': dto.contentType,
            },
            Conditions: [
                ['content-length-range', 0, 3 * 1024 * 1024], // Max 3MB
                ['starts-with', '$Content-Type', 'image/'],
            ],
            Expires: 600, // 10 minutes
        })

        return { url, key, fields }
    }

    async generateProfileImagePresignedUrl(extension: string, userId: number): Promise<PresignedUrlResponseDto> {
        const key = `uploads/profile/${userId}/profile.${extension}`
        const contentType = `image/${extension === 'jpg' ? 'jpeg' : extension}`

        const { url, fields } = await createPresignedPost(this.s3, {
            Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME') ?? '',
            Key: key,
            Fields: {
                'Content-Type': contentType,
            },
            Conditions: [
                ['content-length-range', 0, 1 * 1024 * 1024], // Max 1MB
                ['starts-with', '$Content-Type', 'image/'],
            ],
            Expires: 600, // 10 minutes
        })

        return { url, key, fields }
    }
}
