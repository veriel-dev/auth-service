import { IsOptional, IsString, IsPhoneNumber, IsObject } from 'class-validator';

export class UpdatePersonalInfoDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @IsOptional()
  @IsObject()
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
}
