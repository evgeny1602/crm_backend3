import { Task } from "../entities/task.entity";

export interface TasksResponseInterface {
    tasks: Task[],
    tasksCount: number
}