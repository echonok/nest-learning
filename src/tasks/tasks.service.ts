import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { ETaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    private readonly taskRepository: TaskRepository,
  ) {
  }

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return await this.taskRepository.getTasks(filterDto);
  }

  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.find({});
  }

  async getTasksWithFilter(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    let tasks = await this.getAllTasks();
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }
    if (search) {
      tasks = tasks.filter((task) => task.title.toLocaleLowerCase().includes(search) || task.description.toLocaleLowerCase().includes(search));
    }
    return tasks;
  }

  async getTaskById(taskId: string): Promise<Task> {
    const found = await this.taskRepository.findOneBy({ id: taskId });
    if (!found) {
      throw new NotFoundException(`Task with id ${taskId} is not found`)
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async updateTaskStatus(taskId: string, status: ETaskStatus): Promise<Task> {
    const foundTask = await this.getTaskById(taskId);
    foundTask.status = status;
    await this.taskRepository.save(foundTask);
    return foundTask;
  }

  async deleteTaskById(taskId: string): Promise<void> {
    const deletedTasks = await this.taskRepository.delete({ id: taskId });
    if (deletedTasks.affected === 0) {
      throw new NotFoundException(`Task with id ${taskId} is not found`)
    }
  }
}
