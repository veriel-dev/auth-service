import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IAuthResponse, ITokens } from '../interfaces/auth.interface';
import { ConfigService } from '@nestjs/config';
import { ErrorFactory } from '../exceptions/exception.factory';
import { ErrorCodes } from '../exceptions/error-code';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async create(createAuthDto: CreateAuthDto): Promise<IAuthResponse> {
    const { email, password, firstName, lastName } = createAuthDto;
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser)
      throw ErrorFactory.create(
        ErrorCodes.AUTH.EMAIL_ALREADY_EXISTS,
        undefined,
        HttpStatus.BAD_REQUEST,
      );

    // Crear nuevo usuario
    const user = new User();
    user.email = email;
    user.password = await bcrypt.hash(password, 12);
    user.firstName = firstName;
    user.lastName = lastName;

    // Saved User
    const savedUser = await this.usersRepository.save(user);
    // Create Tokens
    const tokens = await this.getTokens(savedUser);
    // Response
    return {
      user: {
        id: savedUser.id,
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        plan: savedUser.plan,
      },
      ...tokens,
    };
  }
  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
  }
  async login(user: User): Promise<IAuthResponse> {
    const tokens = await this.getTokens(user);
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        plan: user.plan,
      },
      ...tokens,
    };
  }
  async refreshToken(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const tokens = await this.getTokens(user);
    return tokens;
  }
  private async getTokens(user: User): Promise<ITokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: user.id, email: user.email },
        {
          secret: this.configService.get<string>('jwt.secret'),
          expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
        },
        {
          secret: this.configService.get<string>('jwt.secret'),
          expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
}
