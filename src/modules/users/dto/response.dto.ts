import { IntersectionType } from '@nestjs/swagger'
import { CreatedAtDto, IdDto } from 'src/common/dto'
import {
    EmailDto,
    NicknameDto,
    UsernameDto,
    RoleDto,
    PointsDto,
    PostCountDto,
    CommentCountDto,
    UserDescriptionDto,
    ProfileImageDto,
} from '.'

export class UserResponseDto extends IntersectionType(
    IdDto,
    UsernameDto,
    NicknameDto,
    EmailDto,
    UserDescriptionDto,
    ProfileImageDto,
    CreatedAtDto,
    RoleDto,
    PointsDto,
    PostCountDto,
    CommentCountDto,
) {}

export class UserBriefResponseDto extends IntersectionType(
    IdDto,
    UsernameDto,
    NicknameDto,
    UserDescriptionDto,
    ProfileImageDto,
) {}
