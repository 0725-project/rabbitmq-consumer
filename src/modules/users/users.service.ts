import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './users.entity'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'

import { RegisterDto } from 'src/modules/auth/dto'
import { UserUpdateRequestDto } from './dto/request.dto'

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

    async create(createUserDto: RegisterDto) {
        const hashed = await bcrypt.hash(createUserDto.password, 10)
        const user = this.userRepo.create({ ...createUserDto, password: hashed })
        return await this.userRepo.save(user)
    }

    async findByUsername(username: string) {
        const user = await this.userRepo.findOne({ where: { username } })
        if (!user) {
            throw new NotFoundException('User not found')
        }

        return user
    }

    async findById(id: number) {
        const user = await this.userRepo.findOne({ where: { id } })
        if (!user) {
            throw new NotFoundException('User not found')
        }

        return user
    }

    async findByIdWithFavoriteTopics(id: number) {
        const user = await this.userRepo
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.favoriteTopics', 'favoriteTopics')
            .leftJoinAndSelect('favoriteTopics.topic', 'topic')
            .where('user.id = :id', { id })
            .getOne()
        if (!user) {
            throw new NotFoundException('User not found')
        }

        return user
    }

    async getPasswordByUsername(username: string) {
        const user = await this.userRepo
            .createQueryBuilder('user')
            .where('user.username = :username', { username })
            .select(['user', 'user.password'])
            .getOne()
        if (!user) {
            throw new NotFoundException('User not found')
        }

        return user
    }

    async update(username: string, updateUserDto: UserUpdateRequestDto, userId: number) {
        const user = await this.findByUsername(username)
        if (user.id !== userId) {
            throw new ForbiddenException('You are not allowed to update this user')
        }

        const trimmedNickname = updateUserDto.nickname?.trim()
        const trimmedDescription = updateUserDto.description?.trim()

        Object.assign(user, {
            nickname: trimmedNickname === '' ? null : trimmedNickname,
            description: trimmedDescription === '' ? null : trimmedDescription,
        })

        return await this.userRepo.save(user)
    }

    async increment(userId: number, field: keyof User, value: number) {
        await this.userRepo.increment({ id: userId }, field, value)
    }

    async decrement(userId: number, field: keyof User, value: number) {
        await this.userRepo.decrement({ id: userId }, field, value)
    }
}
