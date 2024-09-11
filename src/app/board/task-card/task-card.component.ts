import { Component, inject, Input } from '@angular/core';
import { Task } from '../../models/task.model';
import { AssignableUser } from '../../models/board.model';
import { MatDialog } from '@angular/material/dialog';
import { Subtasks } from '../../models/subtasks.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Input() assignableUsers: AssignableUser[] = [];
  readonly dialog = inject(MatDialog);


  /**
   * Checks if a user ID is included in the assigned users of a task.
   *
   * @param {number} id - The ID of the user to check.
   * @param {number[] | undefined} assignedTo - The array of user IDs assigned to the task.
   * @returns {boolean} - Returns true if the user ID is in the assignedTo array, otherwise false.
   */
  check(id: number , assignedTo: number[]|undefined) {
    if (assignedTo === undefined) {
      return false;
    }
    if (assignedTo.includes(id)) {
      return true;
    } else {
      return false;
    }
  }


  /**
   * Calculates and returns the number of finished subtasks for a given task.
   *
   * @param {Task} task - The task for which to count finished subtasks.
   * @returns {number} - The number of finished subtasks.
   */
  getFinishedSubtasks(task: Task) {
    let finishedSubtasks: number = 0;
    if (task.subtasks === undefined) {
      return 0;
    } else {
      task.subtasks.forEach(subtask => {
        if (subtask.is_checked) {
          finishedSubtasks++;
        }
      });
      return finishedSubtasks;
    }
  }


  /**
   * Calculates the percentage of completed subtasks and returns a style string.
   *
   * @param {Subtasks[] | undefined} subtasks - The array of subtasks to calculate.
   * @returns {string} - The style string representing the width percentage.
   */
  calculatePercentage(subtasks: Subtasks[]|undefined) {
    let percent = 0;
    if (subtasks === undefined) {
      return percent;
    } else { 
      let finished: number = 0;
      subtasks.forEach(subtask => {if (subtask.is_checked) finished++;});
      percent = Math.round((finished / subtasks.length) * 100);
      let returnstring = `width: ${percent}%`;
      return returnstring
    }
  }
}
