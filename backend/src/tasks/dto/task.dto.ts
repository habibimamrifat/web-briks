import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Implement user authentication',
  })
  @IsString()
  title!: string;

  @ApiPropertyOptional({
    example: 'Implement JWT login and refresh token functionality',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  boardId!: string;

  @ApiProperty({
    example: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  })
  @IsUUID()
  workflowStateId!: string;

  @ApiPropertyOptional({
    example: 0,
    description: 'Task position inside the workflow state',
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  priorityIndex?: number;

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

export class UpdateTaskDto {
  @ApiPropertyOptional({ example: 'Implement authentication' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'Updated task description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsOptional()
  workflowStateId?: string;

  @ApiPropertyOptional({
    example: 2,
    description: 'Task position inside the workflow state',
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  priorityIndex?: number;

  @ApiPropertyOptional({
    example: ['550e8400-e29b-41d4-a716-446655440000'],
    description: 'User IDs to assign to the task',
  })
  @IsUUID('4', { each: true })
  @IsOptional()
  assigneeIds?: string[];

  @ApiPropertyOptional({ example: '2026-09-06T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-09-20T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  finishDate?: string;
}

export class MoveTaskDto {
  @ApiProperty({
    example: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    description: 'Target workflow state. Must belong to the same board.',
  })
  @IsUUID()
  workflowStateId!: string;

  @ApiProperty({
    example: 2,
    description: 'New task position inside the workflow state',
  })
  @IsInt()
  @Min(0)
  priorityIndex!: number;
}
