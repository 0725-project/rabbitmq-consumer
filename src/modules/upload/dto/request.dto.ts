import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsIn } from 'class-validator'

export class GeneratePresignedUrlRequestDto {
    @ApiProperty({ description: 'The name of the file to be uploaded.', example: 'example.jpg' })
    @IsString()
    @IsNotEmpty()
    filename: string

    @ApiProperty({ description: 'The content type of the file to be uploaded. (MIME type)', example: 'image/jpeg' })
    @IsString()
    @IsNotEmpty()
    contentType: string
}

export class GenerateProfileImagePresignedUrlRequestDto {
    @ApiProperty({ description: 'The file extension of the profile image being uploaded.', example: 'jpg' })
    @IsString()
    @IsNotEmpty()
    @IsIn(['jpg', 'jpeg', 'png', 'gif'])
    fileExtension: string
}
