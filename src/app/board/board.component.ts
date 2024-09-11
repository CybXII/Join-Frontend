import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { MatIcon } from '@angular/material/icon';
import { Task } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from '../add-task/add-task.component';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { AssignableUser, Board } from '../models/board.model';
import { TaskCardComponent } from "./task-card/task-card.component";
import { Subtasks } from '../models/subtasks.model';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [MatCardModule, CdkDropList, CdkDrag, MatIcon, TaskCardComponent, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  prioritys = ['low', 'medium', 'urgent'];
  readonly dialog = inject(MatDialog);
  tasks: Task[] = [];
  todos: Task[] = [];
  progress: Task[] = [];
  done: Task[] = [];
  awaitFeedback: Task[] = [];
  assignableUsers: AssignableUser[] = [];
  error = '';
  private intervalId: any;

  constructor(private taskService: TaskService) {}


  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * Here, it loads tasks and sets up an interval to refresh tasks every 2500 milliseconds.
   */
  async ngOnInit() {
    await this.loadTasks();
    this.setupAutoRefresh();
  }


  /**
   * Sets up an interval to automatically refresh tasks every 2500 milliseconds.
   */
  setupAutoRefresh() {
    this.intervalId = setInterval(() => {
      this.loadTasks();
    }, 2500);
  }
  

  /**
   * Lifecycle hook that is called when a directive, pipe, or service is destroyed.
   * Clears the interval to stop the periodic task loading.
   */
  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  

  /**
   * Checks if a user ID is included in the assigned users of a task.
   *
   * @param {number} id - The ID of the user to check.
   * @param {number[] | undefined} assignedTo - The array of user IDs assigned to the task.
   * @returns {boolean} - Returns true if the user ID is in the assignedTo array, otherwise false.
   */
  check(id: number, assignedTo: number[] | undefined): boolean {
    return assignedTo ? assignedTo.includes(id) : false;
  }
  

  /**
   * Loads tasks from the TaskService, categorizes them by status, 
   * and assigns them to the corresponding task arrays.
   */
  async loadTasks() {
    try {
      const board: Board = await this.taskService.getTodos();
      this.extractBoardData(board);
    } catch (error) {
      this.error = 'Fehler beim Laden!';
      console.error('Fehler beim Laden der Daten:', error);
    }
  }

  /**
   * Extracts tasks and assignable users from the board and categorizes the tasks.
   *
   * @param {Board} board - The board object containing tasks and assignable users.
   */
  extractBoardData(board: Board) {
    this.tasks = board.tasks;
    this.assignableUsers = board.assignAble;
    this.categorizeTasks();
  }
  

  /**
   * Categorizes tasks based on their status.
   */
  categorizeTasks() {
    this.todos = this.tasks.filter((task) => task.task_status === 0);
    this.progress = this.tasks.filter((task) => task.task_status === 1);
    this.awaitFeedback = this.tasks.filter((task) => task.task_status === 2);
    this.done = this.tasks.filter((task) => task.task_status === 3);
  }
  

  /**
   * Handles the drag-and-drop event for tasks, updating their positions
   * and status in the task list accordingly.
   *
   * @param {CdkDragDrop<Task[]>} event - The drag-and-drop event containing task data.
   */
  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      this.reorderTasks(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.moveTaskToNewStatus(event);
    }
  }
  

  /**
   * Reorders tasks within the same list and updates their positions.
   *
   * @param {Task[]} tasks - The array of tasks to reorder.
   * @param {number} previousIndex - The previous index of the task being moved.
   * @param {number} currentIndex - The current index of the task being moved.
   */
  reorderTasks(tasks: Task[], previousIndex: number, currentIndex: number) {
    moveItemInArray(tasks, previousIndex, currentIndex);
    this.updateTaskPositions(tasks);
  }
  

  /**
   * Moves a task to a new status list and updates its status.
   *
   * @param {CdkDragDrop<Task[]>} event - The drag-and-drop event containing task data.
   */
  moveTaskToNewStatus(event: CdkDragDrop<Task[]>) {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
    const newStatus = this.getNewStatus(event.container.id);
    const movedTask = event.container.data[event.currentIndex];
    this.updateTaskStatus(movedTask, newStatus, event.previousContainer.data);
  }
  

  /**
   * Returns the new status based on the container ID.
   *
   * @param {string} containerId - The ID of the container where the task is dropped.
   * @returns {number} - The new status of the task.
   */
  getNewStatus(containerId: string): number {
    switch (containerId) {
      case 'cdk-drop-list-0':
        return 0;
      case 'cdk-drop-list-1':
        return 1;
      case 'cdk-drop-list-2':
        return 2;
      case 'cdk-drop-list-3':
        return 3;
      default:
        throw new Error('Unexpected container id');
    }
  }
  

  /**
   * Updates the status of a moved task and its position in the previous list.
   *
   * @param {Task} task - The task that was moved.
   * @param {number} newStatus - The new status to assign to the task.
   * @param {Task[]} previousTasks - The array of tasks in the previous list.
   */
  updateTaskStatus(task: Task, newStatus: number, previousTasks: Task[]) {
    task.task_status = newStatus;
    if (task && task.id) {
      this.updateTaskPositions(previousTasks);
      this.taskService.updateTask(task).subscribe({});
    } else {
      console.error('Error: Task or Task ID is undefined');
    }
  }
  

  /**
   * Updates the positions of the tasks in the provided array.
   *
   * @param {Task[]} tasks - The array of tasks whose positions need to be updated.
   */
  updateTaskPositions(tasks: Task[]) {
    tasks.forEach((task, index) => {
      task.position = index + 1;
      this.taskService.updateTask(task).subscribe({});
    });
  }
  

  /**
   * Calculates and returns the number of finished subtasks for a given task.
   *
   * @param {Task} task - The task for which to count finished subtasks.
   * @returns {number} - The number of finished subtasks.
   */
  getFinishedSubtasks(task: Task) {
    let finishedSubtasks = 0;
    if (task.subtasks) {
      finishedSubtasks = this.countFinishedSubtasks(task.subtasks);
    }
    return finishedSubtasks;
  }
  

  /**
   * Counts the number of finished subtasks in an array of subtasks.
   *
   * @param {Subtasks[]} subtasks - The array of subtasks to count.
   * @returns {number} - The number of finished subtasks.
   */
  countFinishedSubtasks(subtasks: Subtasks[]): number {
    return subtasks.filter(subtask => subtask.is_checked).length;
  }
  

  /**
   * Opens the AddTask dialog to create a new task.
   *
   * @param {number} taskStatus - The status to assign to the new task.
   */
  openDialog(taskStatus: number) {
    const dialogRef = this.dialog.open(AddTaskComponent, {
      data: { taskStatus },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasks();
      }
    });
  }
  

  /**
   * Tracks the task by its unique ID to improve performance in lists.
   *
   * @param {number} index - The index of the task in the list.
   * @param {any} task - The task object.
   * @returns {number} - The unique ID of the task.
   */
  trackByTaskId(index: number, task: any): number {
    return task.id;
  }


  /**
   * Opens the EditTask dialog to modify an existing task.
   *
   * @param {Task} task - The task to be edited.
   */
  openTask(task: Task) {
    const dialogRef = this.dialog.open(EditTaskComponent, {
      data: { task, assignableUsers: this.assignableUsers },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasks();
      }
    });
  }
}