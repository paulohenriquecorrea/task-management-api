import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { TaskDto } from './task.dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskservice: TaskService) {}

  @Post()
  create(@Body() task: TaskDto) {
    this.taskservice.create(task);
  }

  @Get('/:id')
  findById(@Param('id') id: string): TaskDto {
    return this.taskservice.findById(id);
  }

  @Put()
  update(@Body() task: TaskDto) {
    this.taskservice.update(task);
  }
}
