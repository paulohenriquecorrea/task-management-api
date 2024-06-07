export class TaskDto {
    id: string;
    title: string;
    description: string;
    status: string;
    expiration: Date;

}

export interface FindAllParameters{
    title: string,
    status: string
}