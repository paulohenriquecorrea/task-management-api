/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, Query } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { FindAllParameters, TaskDto, TaskStatusEnum } from './task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from 'src/db/entities/task.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';

@Injectable()
export class TaskService {

  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>
  ) {}


  private tasks: TaskDto[] = [];

  async create(task: TaskDto) {
    const taskToSave: TaskEntity = {
      title: task.title,
      description: task.description,
      expirationDate: task.expirationDate,
      status: TaskStatusEnum.TO_DO
    }

    /** OUTRA FORMA DE FAZER */

    // const taskToSave = new TaskEntity();
    // taskToSave.title = task.title;
    // taskToSave.description = task.description;
    // taskToSave.expirationDate = task.expirationDate;
    // taskToSave.status = TaskStatusEnum.TO_DO;

    const createdTask = await this.taskRepository.save(taskToSave);

    return this.mapEntityToDto(createdTask);
 
  }

  async findById(id: string): Promise<TaskDto> {
    const foundTask = await this.taskRepository.findOne({ where: {id}}) ;

    if (!foundTask) {
      
      throw new HttpException(
        `Task with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );

      // Ou throw new NotFoundException(`Task with id ${id} not found`);
    }

    return this.mapEntityToDto(foundTask);

   
  }

 async findAll(params: FindAllParameters): Promise<TaskDto[]> {
    const searchParams: FindOptionsWhere<TaskEntity> = {}

    if (params.title) {
      searchParams.title = Like(`%${params.title}%`);
    }

    if (params.status) {
      searchParams.status = Like(`%${params.status}%`);
    }

    const tasksFound = await this.taskRepository.find({
      where: searchParams
    })

    return tasksFound.map(taskEntity => this.mapEntityToDto(taskEntity));
 }

  async update(id: string, task: TaskDto) {
    const foundTask = await this.taskRepository.findOne({ where: { id }});

    if (!foundTask) {
      throw new HttpException(`Task with id ${task.id} not found`, HttpStatus.BAD_REQUEST);
    }

    await this.taskRepository.update(id, this.mapDtoToEntity(task) );
  }

  async remove(id: string) {
  
    const result = await this.taskRepository.delete(id);

    if (!result) {
      throw new HttpException(`Task with id ${id} not found`, HttpStatus.BAD_REQUEST);

    }

  }

  private mapEntityToDto(taskEntity: TaskEntity): TaskDto{
    return {
      id: taskEntity.id,
      title: taskEntity.title,
      description: taskEntity.description,
      expirationDate: taskEntity.expirationDate,
      status: TaskStatusEnum[taskEntity.status]
    }
  }

  private mapDtoToEntity(taskDto: TaskDto): Partial<TaskEntity>{

    return {
      title: taskDto.title,
      description: taskDto.description,
      expirationDate: taskDto.expirationDate,
      status: taskDto.status.toString()
    }

  }
}
