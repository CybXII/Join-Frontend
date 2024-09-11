import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-delete-task-dialog',
  standalone: true,
  templateUrl: './delete-task-dialog.component.html',
  styleUrls: ['./delete-task-dialog.component.scss']
})
export class DeleteTaskDialogComponent {
  readonly dialogRef = inject(MatDialogRef<DeleteTaskDialogComponent>);
  task: Task;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { task: Task },
    private taskService: TaskService
  ) {
    this.task = data.task;
  }


  /**
   * Closes the dialog without making any changes.
   */
  closeDialog(): void {
    this.dialogRef.close();
  }


  /**
   * Deletes the task by calling the TaskService and closes the dialog with the result.
   * 
   * @returns {Promise<void>} - A promise that resolves when the operation completes.
   */
  async deleteTask() {
    try {
      const response = await lastValueFrom(this.taskService.deleteTask(this.task));
      this.dialogRef.close(true);
    } catch (error) {
      this.dialogRef.close(false);
    }
  }
}
