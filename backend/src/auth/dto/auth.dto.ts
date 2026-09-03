import { IsEmail, IsJWT, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsJWT()
  refreshToken!: string;
}

export class SetPasswordDto {
  @IsString()
  @MinLength(8)
  password!: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  email!: string;
}

export class ResetPasswordDto {
  @IsJWT()
  token!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
