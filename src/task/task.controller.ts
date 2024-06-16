import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { FindAllParameters, TaskDto } from './task.dto';
import { TaskService } from './task.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
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

  @Get()
  findAll(@Query() params: FindAllParameters): TaskDto[] {
    return this.taskservice.findAll(params);
  }

  @Put()
  update(@Body() task: TaskDto) {
    this.taskservice.update(task);
  }

  @Delete('/:id')
  remove(@Param('id') id: string){
    return this.taskservice.remove(id);
  }
}
