import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { TasksService } from './tasks.service';
import { ITask } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Controller('tasks')
export class TasksController {
  constructor(
    private tasksService: TasksService,
  ) {
  }

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto): ITask[] {
    if (Object.keys(filterDto).length) {
      return this.tasksService.getTasksWithFilter(filterDto);
    }
    return this.tasksService.getAllTasks();
  }

  @Get('/:taskId')
  getTaskById(@Param('taskId') taskId): ITask {
    return this.tasksService.getTaskById(taskId);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): ITask {
    return this.tasksService.createTask(createTaskDto);
  }

  @Delete('/:taskId')
  deleteTaskById(@Param('taskId') taskId): ITask[] {
    return this.tasksService.deleteTaskById(taskId);
  }

  @Patch('/:taskId/status')
  updateTaskStatus(
    @Param('taskId') taskId: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): ITask {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(taskId, status);
  }
}
