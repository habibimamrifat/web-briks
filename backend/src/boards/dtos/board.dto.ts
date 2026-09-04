import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBoardDto {
  @ApiProperty({
    example: 'Website Redesign',
  })
  @IsString()
  name!: string;

  @ApiPropertyOptional({
    example: 'Redesign the company website',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: '2026-09-05T00:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({
    example: '2026-10-05T00:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  finishDate?: string;
}

export class UpdateBoardDto {
  @ApiPropertyOptional({
    example: 'Updated Website Redesign',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 'Updated project description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: '2026-09-10T00:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({
    example: '2026-10-10T00:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  finishDate?: string;
}

export class InviteBoardMemberDto {
  @ApiProperty({
    example: ['550e8400-e29b-41d4-a716-446655440000'],
  })
  @IsUUID('4', { each: true })
  addMemberIds!: string[];

  @ApiProperty({
    example: ['650e8400-e29b-41d4-a716-446655440001'],
  })
  @IsUUID('4', { each: true })
  removeMemberIds!: string[];
}
