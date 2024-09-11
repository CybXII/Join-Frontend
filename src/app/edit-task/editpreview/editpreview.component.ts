import { Component, EventEmitter, inject, Inject, Output } from '@angular/core';
import { DeleteTaskDialogComponent } from '../../delete-task-dialog/delete-task-dialog.component';
import { Task } from '../../models/task.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditTaskComponent } from '../edit-task.component';
import { MatIcon } from '@angular/material/icon';
import { AssignableUser } from '../../models/board.model';
import { TaskService } from '../../services/task.service';
import { Subtasks } from '../../models/subtasks.model';

@Component({
  selector: 'app-editpreview',
  standalone: true,
  imports: [MatIcon, EditTaskComponent],
  templateUrl: './editpreview.component.html',
  styleUrls: ['./editpreview.component.scss', '../../board/task-card/task-card.component.scss', '../edit-task.component.scss']
})

export class EditpreviewComponent {
  @Output() editModeToggled = new EventEmitter<void>();

  assignableUsers: AssignableUser[] = [];
  editTask: Task;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: { task: Task, assignableUsers: AssignableUser[] },
    private taskService: TaskService,
    public dialogRef: MatDialogRef<EditpreviewComponent>,
    private dialog: MatDialog
  ) {
    this.editTask = data.task;
    this.assignableUsers = data.assignableUsers;
  }

  /**
   * Closes the dialog without making changes.
   */
  onNoClick(): void {
    this.dialogRef.close();
  }


  /**
   * Checks if a specific user ID is included in the assigned users array of a task.
   *
   * @param {number} id - The ID of the user to check.
   * @param {number[] | undefined} assignedTo - The array of user IDs assigned to the task.
   * @returns {boolean} - Returns true if the user ID is included, otherwise false.
   */
  check(id: number, assignedTo: number[] | undefined) {
    return assignedTo ? assignedTo.includes(id) : false;
  }


  /**
   * Emits an event to toggle the edit mode of the component.
   */
  editCard() {
    this.editModeToggled.emit();
  }


  /**
   * Opens a dialog to confirm the deletion of a task. If confirmed, closes the edit dialog.
   *
   * @param {Task} task - The task to be deleted.
   */
  openDeleteDialog(task: Task) {
    const dialogRef = this.dialog.open(DeleteTaskDialogComponent, {
      data: { task }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close(true);
      }
    });
  }


  /**
   * Updates the status of a subtask and sends the updated task to the backend.
   *
   * @param {number} subtaskId - The ID of the subtask to be updated.
   * @param {Event} event - The event triggered by the checkbox change.
   */
  updateSubtask(subtaskId: number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    // Find the corresponding subtask and update its status
    const subtask = this.editTask.subtasks?.find(st => st.id === subtaskId);
    if (subtask) {
      subtask.is_checked = isChecked;

      // Update the task through the service
      this.taskService.updateTask(this.editTask).subscribe(
        () => console.log('Task updated successfully'),
        (error) => console.error('Error updating task', error)
      );
    }
  }
  
  /**
   * Track by function for Angular's *ngFor directive to improve performance.
   *
   * @param {number} index - The index of the current item in the list.
   * @param {Subtasks} item - The current subtask item.
   * @returns {number} - Returns the ID of the subtask.
   */
  trackBySubtask(index: number, item: Subtasks): number {
    return item.id;
  }
}