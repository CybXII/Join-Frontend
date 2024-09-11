import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Board } from '../models/board.model';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';
import { PriosComponent } from './prios/prios.component';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, PriosComponent],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent {
  tasks: Task[] = [];
  todos: Task[] = [];
  progress: Task[] = [];
  awaitFeedback: Task[] = [];
  done: Task[] = [];
  upcomingDeadline: { date: Date; prio: number } | null = null;

  constructor(private taskService: TaskService) {}

  /**
   * Initializes the component by fetching the board data and categorizing tasks.
   * Sets the `upcomingDeadline` property based on the calculated upcoming deadline.
   */
  async ngOnInit() {
    const board: Board = await this.taskService.getTodos();
    this.tasks = board.tasks;
    this.todos = this.tasks.filter((task) => task.task_status === 0);
    this.progress = this.tasks.filter((task) => task.task_status === 1);
    this.awaitFeedback = this.tasks.filter((task) => task.task_status === 2);
    this.done = this.tasks.filter((task) => task.task_status === 3);
    this.upcomingDeadline = this.calculateUpcoming();
  }

  /**
   * Calculates the upcoming deadline based on task priority and due dates.
   * 
   * @returns {Object | null} - An object containing the date and priority of the upcoming deadline, or `null` if no upcoming deadline is found.
   */
  calculateUpcoming(): { date: Date; prio: number } | null {
    const priorities = [3, 2, 1];
    for (const prio of priorities) {
      const tasksWithPrio = this.tasks.filter((task) => task.prio === prio);
      if (tasksWithPrio.length > 0) {
        const upcomingTask = tasksWithPrio.reduce((earliest, current) =>
          new Date(current.due_date) < new Date(earliest.due_date) ? current : earliest
        );
        return { date: new Date(upcomingTask.due_date), prio };
      }
    }
    return null;
  }
}
