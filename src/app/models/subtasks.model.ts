export class Subtasks {
    id: number;
    title: string;
    is_checked: boolean;
    constructor(id: number, title: string, is_checked: boolean) {
        this.id = id;
        this.title = title;
        this.is_checked = is_checked;
    }
}
