import { DataSource, Repository } from 'typeorm';

import { Task } from './task.entity';
import { CustomRepository } from '../database/typeorm-ex.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { ETaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@CustomRepository(Task)
export class TaskRepository extends Repository<Task> {

  constructor(
    private dataSource: DataSource
  ) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere('LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)', { search: `%${search}%` });
    }
    return await query.getMany();
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.create({
      title,
      description,
      status: ETaskStatus.OPEN,
    });
    await this.save(task);
    return task;
  }

}
