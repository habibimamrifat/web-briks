import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'john@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Password@123',
  })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiPropertyOptional({
    enum: UserRole,
    example: UserRole.MEMBER,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role!: UserRole;

  @ApiPropertyOptional({
    example: 'https://example.com/profile.jpg',
  })
  @IsString()
  @IsOptional()
  image?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'John Updated',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 'john.updated@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    enum: UserRole,
    example: UserRole.MEMBER,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({
    example: 'https://example.com/new-profile.jpg',
  })
  @IsString()
  @IsOptional()
  image?: string;
}
