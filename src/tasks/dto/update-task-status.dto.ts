import { IsEnum } from 'class-validator';

import { ETaskStatus } from '../task.model';

export class UpdateTaskStatusDto {
  @IsEnum(ETaskStatus)
  status: ETaskStatus;
}
