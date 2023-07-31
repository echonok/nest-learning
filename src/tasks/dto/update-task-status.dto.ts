import { IsEnum } from 'class-validator';

import { ETaskStatus } from '../task-status.enum';

export class UpdateTaskStatusDto {
  @IsEnum(ETaskStatus)
  status: ETaskStatus;
}
