import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { ETaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    private readonly taskRepository: TasksRepository,
  ) {
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return await this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(taskId: string, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id: taskId, user } });
    if (!found) {
      throw new NotFoundException(`Task with id ${taskId} is not found`)
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async updateTaskStatus(taskId: string, status: ETaskStatus, user: User): Promise<Task> {
    const foundTask = await this.getTaskById(taskId, user);
    foundTask.status = status;
    await this.taskRepository.save(foundTask);
    return foundTask;
  }

  async deleteTaskById(taskId: string, user: User): Promise<void> {
    const deletedTasks = await this.taskRepository.delete({ id: taskId, user });
    if (deletedTasks.affected === 0) {
      throw new NotFoundException(`Task with id ${taskId} is not found`)
    }
  }

  async deleteAllTasks(): Promise<void> {
    await this.taskRepository.delete({});
  }
}
