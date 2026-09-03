import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  finishDate?: string;
}

export class UpdateBoardDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  finishDate?: string;
}

export class InviteBoardMemberDto {
  @IsUUID()
  userId!: string;
}
