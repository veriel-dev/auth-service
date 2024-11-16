import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class DeactivateAccountDto {
  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsBoolean()
  @IsOptional()
  deleteData?: boolean;
}
