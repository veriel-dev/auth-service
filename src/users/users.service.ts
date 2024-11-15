import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserResponseDto } from './dto/user-responde.';
import { ErrorFactory } from '../exceptions/exception.factory';
import { ErrorCodes } from '../exceptions/error-code';
import { ErrorMessages } from '../exceptions/error-messages';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  /* Get All Users */

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'plan',
        'createdAt',
        'updatedAt',
        'lastLogin',
        'role',
        'isActive',
      ],
    });
    return users.map((user) => this.mapToUserResponse(user));
  }

  /* Get User By Id */
  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'plan',
        'createdAt',
        'updatedAt',
        'lastLogin',
        'role',
        'isActive',
      ],
    });
    if (!user) {
      throw ErrorFactory.create(
        ErrorCodes.USER.USER_NOT_FOUND,
        ErrorMessages[ErrorCodes.USER.USER_NOT_FOUND],
        HttpStatus.NOT_FOUND,
      );
    }
    return this.mapToUserResponse(user);
  }
  /* Change Status User*/
  async updateChangeStatusUser(id: string, isActive: boolean) {
    await this.userRepository.update({ id }, { isActive: isActive });
  }

  /* Maps user entity to UserReponseDto */
  private mapToUserResponse(user: User): UserResponseDto {
    const userResponse = new UserResponseDto();
    userResponse.id = user.id;
    userResponse.email = user.email;
    userResponse.firstName = user.firstName;
    userResponse.lastName = user.lastName;
    userResponse.plan = user.plan;
    userResponse.createdAt = user.createdAt;
    userResponse.updatedAt = user.updatedAt;
    userResponse.lastLogin = user.lastLogin;
    userResponse.isActive = user.isActive;
    userResponse.role = user.role;
    return userResponse;
  }
}
