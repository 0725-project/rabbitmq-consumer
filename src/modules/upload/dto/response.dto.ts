import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class PresignedUrlResponseDto {
    @ApiProperty({
        description: 'The presigned URL for uploading the file.',
        example: 'https://BUCKET.s3.amazonaws.com/uploads/UUID/example.jpg?AWSAccessKeyId=...',
    })
    @IsString()
    @IsNotEmpty()
    url: string

    @ApiProperty({
        description: 'The key under which the file will be stored in S3.',
        example: 'uploads/UUID/example.jpg',
    })
    key: string

    @ApiProperty({
        description: 'The fields required for the presigned POST request.',
    })
    fields: Record<string, string>
}
