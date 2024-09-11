import { Task } from './task.model';

export interface AssignableUser {
    first_name: string;
    last_name: string;
    id: number;
}

export interface Board {
    tasks: Task[];               
    assignAble: AssignableUser[];
}
