import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsOptional, Min, Max } from 'class-validator'
import { Type } from 'class-transformer'

export class PaginationDto {
    @ApiProperty({
        description: 'The page number for pagination, starting from 1.',
        example: 1,
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1

    @ApiProperty({
        description: 'The number of items to return per page. Maximum is 20.',
        example: 10,
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(20)
    limit?: number = 10
}

export class PaginationResponseDto {
    @ApiProperty({
        description: 'Total number of items available.',
        example: 100,
    })
    total: number

    @ApiProperty({
        description: 'Current page number.',
        example: 1,
    })
    page: number

    @ApiProperty({
        description: 'Number of items per page.',
        example: 10,
    })
    limit: number
}
