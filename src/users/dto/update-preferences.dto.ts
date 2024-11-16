import {
  IsOptional,
  IsString,
  IsIn,
  IsBoolean,
  IsObject,
} from 'class-validator';

export class UpdatePreferencesDto {
  @IsOptional()
  @IsString()
  @IsIn(['light', 'dark'])
  theme?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @IsOptional()
  @IsObject()
  notifications?: {
    marketing: boolean;
    security: boolean;
    updates: boolean;
  };
}
