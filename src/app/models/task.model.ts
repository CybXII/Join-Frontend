import { Subtasks } from './subtasks.model';

export interface Task {
    id?: number; // Optional, weil es beim Erstellen noch nicht vorhanden ist
    title: string;
    description?: string;
    assignedTo?: number[];
    due_date: string;
    prio: number;
    category: string;
    task_status?: number;
    subtasks?: Subtasks[] | undefined;
}

export class Task implements Task {
    title: string;
    description?: string;
    assignedTo?: number[];
    due_date: string;
    prio: number;
    category: string;
    task_status?: number;
    subtasks?: Subtasks[] | undefined;
    position: number;
    id?: number; // Optional

    constructor(
        title: string,
        description: string,
        assignedTo: number[],
        due_date: string,
        prio: number,
        category: string,
        task_status: number,
        subtasks: Subtasks[] | undefined,
        position: number,
        id?: number,
    ) {
        this.title = title;
        this.description = description;
        this.assignedTo = assignedTo;
        this.due_date = due_date;
        this.prio = prio;
        this.category = category;
        this.task_status = task_status;
        this.subtasks = subtasks;
        this.position = position;
        if (id !== undefined) this.id = id;
    }
}
