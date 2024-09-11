import { ChangeDetectionStrategy, Component, Inject, inject, Optional, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { Task } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { AssignableUser, Board } from '../models/board.model';
import { Subtasks } from '../models/subtasks.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatRadioModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatAutocompleteModule
  ],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTaskComponent {
  public taskForm: FormGroup;
  todayDate: Date = new Date();
  readonly categories: string[] = ['Urgent', 'Medium', 'Low'];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currentSubtask = signal('');
  readonly subtasks = signal<Subtasks[]>([]);
  readonly allSubtasks: string[] = [];
  readonly announcer = inject(LiveAnnouncer);
  tasks: Task[] = [];
  assignableUsers: AssignableUser[] = [];
  error = '';

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { taskStatus: number },
    private taskService: TaskService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.taskForm = this.createTaskForm();
  }

  /**
   * Creates and returns a FormGroup for the task form.
   */
  private createTaskForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      description: [''],
      assignedTo: [[]],
      dueDate: ['', Validators.required],
      priority: ['Medium', Validators.required],
      category: ['', Validators.required],
      task_status: [this.data?.taskStatus ?? 0],
      position: [0],
      subtasks: this.fb.array([])
    });
  }

  /**
   * Adds a new subtask to the list of subtasks.
   */
  addSubtask() {
    const newSubtask = this.createSubtask();
    this.subtasks.update(subtasks => [...subtasks, newSubtask]);
  }

  /**
   * Creates a new subtask with a unique ID.
   */
  private createSubtask(): Subtasks {
    const existingSubtasks = this.subtasks();
    const newId = this.getNextId(existingSubtasks);
    return new Subtasks(newId, '', false);
  }

  /**
   * Initializes the component by loading the tasks.
   */
  async ngOnInit() {
    await this.loadTasks();
  }

  /**
   * Loads tasks from the TaskService and handles potential errors.
   */
  private async loadTasks() {
    try {
      const board: Board = await this.taskService.getTodos();
      this.assignableUsers = board.assignAble;
    } catch (error) {
      this.error = 'Fehler beim Laden!';
    }
  }

  /**
   * Handles form submission, resets the form and form directive.
   * 
   * @param {FormGroupDirective} formDirective - The form directive to reset.
   */
  public onSubmit(formDirective: FormGroupDirective): void {
    this.resetForm(formDirective);
  }

  /**
   * Resets the form and the form directive.
   * 
   * @param {FormGroupDirective} formDirective - The form directive to reset.
   */
  private resetForm(formDirective: FormGroupDirective): void {
    this.taskForm.reset();
    formDirective.resetForm();
  }

  /**
   * Adds a new subtask from a chip input event.
   * 
   * @param {MatChipInputEvent} event - The chip input event containing the new subtask value.
   */
  add(event: MatChipInputEvent): void {
    this.addSubtaskFromEvent(event);
    this.currentSubtask.set('');
    event.chipInput!.clear();
    this.updateSubtasksInForm();
  }

  /**
   * Adds a new subtask from the chip input event.
   * 
   * @param {MatChipInputEvent} event - The chip input event containing the new subtask value.
   */
  private addSubtaskFromEvent(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      const newSubtask = this.createSubtaskFromValue(value);
      this.subtasks.update(subtasks => [...subtasks, newSubtask]);
    }
  }

  /**
   * Creates a subtask from a string value.
   * 
   * @param {string} value - The value of the new subtask.
   * @returns {Subtasks} - The created subtask.
   */
  private createSubtaskFromValue(value: string): Subtasks {
    const existingSubtasks = this.subtasks();
    const newId = this.getNextId(existingSubtasks);
    return new Subtasks(newId, value, false);
  }

  /**
   * Generates the next subtask ID based on existing subtasks.
   * 
   * @param {Subtasks[]} existingSubtasks - The current list of subtasks.
   * @returns {number} - The next subtask ID.
   */
  private getNextId(existingSubtasks: Subtasks[]): number {
    if (existingSubtasks.length === 0) {
      return 1;
    }
    const maxId = Math.max(...existingSubtasks.map(subtask => subtask.id));
    return maxId + 1;
  }

  /**
   * Removes a specified subtask from the list and announces the removal.
   * 
   * @param {Subtasks} subtask - The subtask to remove.
   */
  remove(subtask: Subtasks): void {
    this.subtasks.update(subtasks => this.removeSubtask(subtasks, subtask));
    this.announcer.announce(`Removed ${subtask.title}`);
    this.updateSubtasksInForm();
  }

  /**
   * Removes a subtask from the list.
   * 
   * @param {Subtasks[]} subtasks - The list of subtasks.
   * @param {Subtasks} subtask - The subtask to remove.
   * @returns {Subtasks[]} - The updated list of subtasks.
   */
  private removeSubtask(subtasks: Subtasks[], subtask: Subtasks): Subtasks[] {
    const index = subtasks.indexOf(subtask);
    if (index >= 0) {
      subtasks.splice(index, 1);
    }
    return [...subtasks];
  }

  /**
   * Adds a subtask when selected from the autocomplete options.
   * 
   * @param {MatAutocompleteSelectedEvent} event - The autocomplete selected event.
   */
  selected(event: MatAutocompleteSelectedEvent): void {
    this.addSelectedSubtask(event);
    this.currentSubtask.set('');
    event.option.deselect();
    this.updateSubtasksInForm();
  }

  /**
   * Adds a selected subtask from the autocomplete event.
   * 
   * @param {MatAutocompleteSelectedEvent} event - The autocomplete selected event.
   */
  private addSelectedSubtask(event: MatAutocompleteSelectedEvent): void {
    const newSubtask = new Subtasks(0, event.option.viewValue, false);
    this.subtasks.update(subtasks => [...subtasks, newSubtask]);
  }

  /**
   * Updates the subtasks in the task form.
   */
  private updateSubtasksInForm(): void {
    this.taskForm.patchValue({ subtasks: this.subtasks() });
  }

  /**
   * Clears the form and resets the list of subtasks.
   */
  clearForm() {
    this.subtasks.set([]);
    this.taskForm.reset();
  }

  /**
   * Formats a Date object into a string with the format 'YYYY-MM-DD'.
   * 
   * @param {Date} date - The date to format.
   * @returns {string} - The formatted date string.
   */
  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  /**
   * Collects task form data, formats it, and sends it to the task service to be added.
   */
  addTask() {
    const taskData = this.prepareTaskData();
    this.taskService.addTask(taskData).subscribe({});
  }

  /**
   * Prepares the task data from the form for submission.
   * 
   * @returns {Task} - The task data object.
   */
  private prepareTaskData(): Task {
    const dueDate = this.taskForm.get('dueDate')?.value;
    const formattedDueDate = dueDate ? this.formatDate(new Date(dueDate)) : '';
    const priority = this.taskForm.get('priority')?.value;
    const priorityNumber = this.getPriorityNumber(priority);

    const subtasks = this.subtasks().map(subtask => ({
      id: subtask.id,
      title: subtask.title,
      is_checked: subtask.is_checked,
    }));

    return {
      title: this.taskForm.get('title')?.value,
      description: this.taskForm.get('description')?.value,
      assignedTo: this.taskForm.get('assignedTo')?.value,
      due_date: formattedDueDate,
      prio: priorityNumber,
      category: this.taskForm.get('category')?.value,
      task_status: this.taskForm.get('task_status')?.value,
      subtasks: subtasks,
      position: this.taskForm.get('position')?.value || 0,
    };
  }

  /**
   * Converts the priority string to a corresponding number.
   * 
   * @param {string} priority - The priority string.
   * @returns {number} - The priority number.
   */
  private getPriorityNumber(priority: string): number {
    return priority === 'low' ? 1 : priority === 'medium' ? 2 : 3;
  }
}
