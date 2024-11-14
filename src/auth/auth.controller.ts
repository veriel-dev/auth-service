import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { ErrorFactory } from '../exceptions/exception.factory';
import { ErrorCodes } from '../exceptions/error-code';
import { ErrorMessages } from '../exceptions/error-messages';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async create(@Body() createAuthDto: CreateAuthDto) {
    try {
      return this.authService.create(createAuthDto);
    } catch (_) {
      throw ErrorFactory.create(
        ErrorCodes.USER.UPDATED_FAILED,
        ErrorMessages[ErrorCodes.USER.UPDATED_FAILED],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async register(@Request() req) {
    try {
      return await this.authService.login(req.user);
    } catch (_) {
      throw ErrorFactory.create(
        ErrorCodes.USER.LOGIN_FAILED,
        ErrorMessages[ErrorCodes.USER.LOGIN_FAILED],
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    try {
      return await this.authService.refreshToken(req.user.sub);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Error al refrescar el token',
          message: error.message,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('validate')
  async validateToken(@Request() req) {
    return {
      valid: true,
      user: req.user,
    };
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
