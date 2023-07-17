import { ETaskStatus } from '../task.model';

export class GetTasksFilterDto {
  status?: ETaskStatus;
  search?: string;
}
