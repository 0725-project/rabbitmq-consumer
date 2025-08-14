import { Module } from '@nestjs/common'
import { UploadController } from './upload.controller'
import { UploadService } from './upload.service'
import { ConfigService } from '@nestjs/config'
import { S3Client } from '@aws-sdk/client-s3'

@Module({
    controllers: [UploadController],
    providers: [
        {
            provide: 'S3_CLIENT',
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return new S3Client({
                    endpoint: configService.get<string>('AWS_S3_ENDPOINT') ?? 'https://s3.ap-northeast-2.amazonaws.com',
                    region: configService.get<string>('AWS_REGION') ?? 'ap-northeast-2',
                    credentials: {
                        accessKeyId: configService.get('AWS_ACCESS_KEY_ID') ?? '',
                        secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY') ?? '',
                    },
                    forcePathStyle: configService.get<string>('AWS_S3_ENDPOINT')?.includes('localhost') ?? false,
                })
            },
        },
        UploadService,
    ],
    exports: [UploadService],
})
export class UploadModule {}
