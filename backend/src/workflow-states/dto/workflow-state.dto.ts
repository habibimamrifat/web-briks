import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWorkflowStateDto {
  @ApiProperty({
    example: 'In Progress',
  })
  @IsString()
  name!: string;

  @ApiPropertyOptional({
    example: 'Tasks currently being worked on',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Position of the workflow state',
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  position?: number;

  @ApiPropertyOptional({
    example: '2026-09-05T00:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({
    example: '2026-09-15T00:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  finishDate?: string;
}

export class UpdateWorkflowStateDto {
  @ApiPropertyOptional({
    example: 'Completed',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 'All completed tasks',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 2,
    description: 'Position of the workflow state',
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  position?: number;

  @ApiPropertyOptional({
    example: '2026-09-10T00:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({
    example: '2026-09-20T00:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  finishDate?: string;
}
