import { IsEmail, IsJWT, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'admin@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Admin@12345',
  })
  @IsString()
  @MinLength(8)
  password!: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsJWT()
  refreshToken!: string;
}

export class SetPasswordDto {
  @ApiProperty({
    example: 'NewPassword@123',
  })
  @IsString()
  @MinLength(8)
  password!: string;
}

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
  })
  @IsEmail()
  email!: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsJWT()
  token!: string;

  @ApiProperty({
    example: 'NewPassword@123',
  })
  @IsString()
  @MinLength(8)
  password!: string;
}
