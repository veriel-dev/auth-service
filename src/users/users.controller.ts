import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CustomLoggerService } from '../logger/customlogger.service';
import { UserResponseDto } from './dto/user-responde.';
import { ErrorMessages } from '../exceptions/error-messages';
import { ErrorCodes } from '../exceptions/error-code';
import { ErrorFactory } from '../exceptions/exception.factory';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles, RolesGuard } from './guards/roles.guard';
import { UserRole } from './enums/user-role';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject('Logger') private readonly logger: CustomLoggerService,
  ) {}
  @Get()
  @Roles(UserRole.USER)
  async findAll(): Promise<UserResponseDto[]> {
    try {
      this.logger.log('GET /users', 'Obtiene todos los usuarios');
      return this.usersService.findAll();
    } catch (_) {
      this.logger.log(
        ErrorCodes.GENERIC.SYSTEM_ERROR,
        ErrorMessages[ErrorCodes.GENERIC.SYSTEM_ERROR],
      );
      throw ErrorFactory.create(
        ErrorCodes.GENERIC.SYSTEM_ERROR,
        ErrorMessages[ErrorCodes.GENERIC.SYSTEM_ERROR],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('change-status')
  async updateChangeStatusUser(
    @Query('id') id: string,
    @Query('isActive') isActive: boolean,
  ) {
    try {
      await this.usersService.updateChangeStatusUser(id, isActive);
      return {
        status: 'ok',
        msg: 'Modificación del valor de isActive',
      };
    } catch (error) {
      throw ErrorFactory.create(
        ErrorCodes.GENERIC.SYSTEM_ERROR,
        error.messages,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Get(':id')
  async findById(@Param('id') id: string): Promise<UserResponseDto> {
    try {
      this.logger.log(
        `GET /users/${id}`,
        `Obtención del usuario con identificador: ${id}`,
      );
      return await this.usersService.findById(id);
    } catch (_) {
      this.logger.log(
        ErrorCodes.GENERIC.SYSTEM_ERROR,
        ErrorMessages[ErrorCodes.GENERIC.SYSTEM_ERROR],
      );
      throw ErrorFactory.create(
        ErrorCodes.GENERIC.SYSTEM_ERROR,
        ErrorMessages[ErrorCodes.GENERIC.SYSTEM_ERROR],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return this.usersService.findById(id);
  }
}
