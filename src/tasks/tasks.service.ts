import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { ITask, ETaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

const initTasks: ITask[] = [
  { id: uuid(), title: 'tasks1', description: '', status: ETaskStatus.OPEN },
  { id: uuid(), title: 'tasks2', description: '', status: ETaskStatus.OPEN },
];

@Injectable()
export class TasksService {
  private tasks: ITask[] = [...initTasks];

  getAllTasks(): ITask[] {
    return this.tasks;
  }

  getTasksWithFilter(filterDto: GetTasksFilterDto): ITask[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }
    if (search) {
      tasks = tasks.filter((task) => task.title.toLocaleLowerCase().includes(search) || task.description.toLocaleLowerCase().includes(search));
    }
    return tasks;
  }

  getTaskById(taskId: string): ITask {
    return this.tasks.find((task) => task.id === taskId);
  }

  createTask(createTaskDto: CreateTaskDto): ITask {
    const { title, description } = createTaskDto;
    const task = {
      id: uuid(),
      title,
      description,
      status: ETaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  updateTaskStatus(taskId: string, status: ETaskStatus): ITask {
    console.log({ status })
    const foundTask = this.tasks.find((task) => task.id === taskId);
    if (!foundTask) {
      return null;
    }
    foundTask.status = status;
    return foundTask;
  }

  deleteTaskById(taskId: string): ITask[] {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    return this.tasks;
  }
}
