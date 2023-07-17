import { IsEnum, IsOptional, IsString } from 'class-validator';

import { ETaskStatus } from '../task.model';

export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(ETaskStatus)
  status?: ETaskStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
