import { HttpException, HttpStatus, Injectable, Query } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { FindAllParameters, TaskDto, TaskStatusEnum } from './task.dto';

@Injectable()
export class TaskService {
  private tasks: TaskDto[] = [];

  create(task: TaskDto) {
    task.id = uuid();
    task.status = TaskStatusEnum.IN_PROGESS;
    this.tasks.push(task);
   
  }

  findById(id: string): TaskDto {
    const foundTask = this.tasks.filter((t) => t.id === id);

    if (foundTask.length) {
      return foundTask[0];
    }

    // throw new NotFoundException(`Task with id ${id} not found`);

    throw new HttpException(
      `Task with id ${id} not found`,
      HttpStatus.NOT_FOUND,
    );
  }

 findAll(params: FindAllParameters): TaskDto[] {
    return this.tasks.filter(t => {
      let match = true;

      if(params.title != undefined && !t.title.includes(params.title) ){
        match = false;
      }

      if(params.status != undefined && !t.status.includes(params.status)) {
        match = false;
      }

      return match;
    })
 }

  update(task: TaskDto) {
    const taskIndex = this.tasks.findIndex((t) => t.id === task.id);

    if (taskIndex >= 0) {
      this.tasks[taskIndex] = task;

      return;
    }

    throw new HttpException(
      `Task with id ${task.id} not found`,
      HttpStatus.BAD_REQUEST,
    );
  }

  remove(id: string) {
    const taskIndex = this.tasks.findIndex(t => t.id = id);

    if(taskIndex >= 0) {
      this.tasks.splice(taskIndex, 1);
      return 
    }

    throw new HttpException(`Task with id ${id} not found`, HttpStatus.BAD_REQUEST);
  }
}
