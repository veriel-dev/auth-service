import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';

export class UserFilterParamsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsEnum(['createdAt', 'email', 'role'])
  orderBy?: string = 'createdAt';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'DESC';
}
