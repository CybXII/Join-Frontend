import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { FormBuilder, FormArray, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AssignableUser, Board } from '../../models/board.model';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subtasks } from '../../models/subtasks.model';

@Component({
  selector: 'app-editable',
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
    MatAutocompleteModule,
  ],
  templateUrl: './editable.component.html',
  styleUrls: ['./editable.component.scss'],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditableComponent {
  @Output() editModeToggled = new EventEmitter<void>();

  public taskForm: FormGroup;
  todayDate: Date = new Date();
  readonly categories: string[] = ['Urgent', 'Medium', 'Low'];
  prio: string = 'Medium';
  prioNumber: number = 0;
  assigneAbles: AssignableUser[] = [];
  assignedToArray: number[] = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currentSubtask = signal('');
  readonly subtasks = signal<Subtasks[]>([]);
  readonly allSubtasks: string[] = [];
  task: Task;
  readonly announcer = inject(LiveAnnouncer);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { task: Task; assignableUsers: AssignableUser[] },
    private taskService: TaskService,
    private fb: FormBuilder
  ) {
    this.task = this.data.task;
    this.prioNumber = this.task.prio;
    this.prio = this.categories[this.prioNumber - 1];
    this.assigneAbles = this.data.assignableUsers;
    const dueDate = this.convertToDate(this.task.due_date) || new Date();
    this.taskForm = this.fb.group({
      title: [this.task.title, Validators.required],
      description: [this.task.description],
      assignedTo: [this.task.assignedTo],
      task_status: [this.task.task_status],
      dueDate: [this.formatDate(dueDate), Validators.required],
      priority: [this.prio, Validators.required],
      category: [this.task.category, Validators.required],
      subtasks: this.fb.array([])
    });
    this.setSubtasks(this.task.subtasks ?? []);
  }

  
  /**
   * Initializes priority value based on the task's priority.
   */
  ngOnInit() {
    this.initPrio();
  }
  

  /**
   * Sets the subtasks for the form.
   *
   * @param {Subtasks[]} subtasks - An array of subtasks to set in the form.
   */
  private setSubtasks(subtasks: Subtasks[]) {
    const subtaskArray = this.taskForm.get('subtasks') as FormArray;
    subtaskArray.clear();
    subtasks.forEach(subtask => {
      subtaskArray.push(this.createSubtaskGroup(subtask));
    });
    this.subtasks.set(subtasks);
  }
  

  /**
   * Creates a FormGroup for a subtask.
   *
   * @param {Subtasks} subtask - The subtask to create a FormGroup for.
   * @returns {FormGroup} - The FormGroup representing the subtask.
   */
  private createSubtaskGroup(subtask: Subtasks): FormGroup {
    return this.fb.group({
      id: [subtask.id],
      title: [subtask.title, Validators.required],
      is_checked: [subtask.is_checked]
    });
  }
  

  /**
   * Retrieves the form array of subtasks.
   *
   * @returns {FormArray} - The form array containing subtasks.
   */
  get subtasksFormArray() {
    return this.taskForm.get('subtasks') as FormArray;
  }
  

  /**
   * Gets the next available ID for a new subtask based on existing subtasks.
   *
   * @param {Subtasks[]} existingSubtasks - An array of existing subtasks.
   * @returns {number} - The next available ID.
   */
  getNextId(existingSubtasks: Subtasks[]): number {
    if (existingSubtasks.length === 0) {
      return 1;
    }
    return Math.max(...existingSubtasks.map(subtask => subtask.id)) + 1;
  }
  

  /**
   * Adds a new subtask with the specified title to the form.
   *
   * @param {string} title - The title of the new subtask.
   */
  addSubtask(title: string): void {
    const currentSubtasks = this.subtasks();
    const newId = this.getNextId(currentSubtasks);
    const newSubtask = new Subtasks(newId, title, false);
    this.subtasksFormArray.push(this.createSubtaskGroup(newSubtask));
    this.subtasks.update(current => [...current, newSubtask]);
  }
  

  /**
   * Removes a subtask at the specified index from the form.
   *
   * @param {number} index - The index of the subtask to remove.
   */
  removeSubtask(index: number): void {
    this.subtasksFormArray.removeAt(index);
    this.subtasks.update(current => current.filter((_, i) => i !== index));
    this.announcer.announce(`Removed subtask at index ${index}`);
  }
  

  /**
   * Initializes the priority value based on the task's priority number.
   */
  private initPrio() {
    const result = this.getPriorityLabel(this.data.task.prio);
    this.prioNumber = this.getPriorityNumber(result);
    this.taskForm.patchValue({ priority: result });
  }
  

  /**
   * Gets the priority label based on the priority number.
   *
   * @param {number} prioNumber - The priority number.
   * @returns {string} - The corresponding priority label.
   */
  private getPriorityLabel(prioNumber: number): string {
    switch (prioNumber) {
      case 1: return 'Low';
      case 2: return 'Medium';
      case 3: return 'Urgent';
      default: return 'Medium';
    }
  }
  

  /**
   * Gets the priority number based on the priority label.
   *
   * @param {string} prio - The priority label.
   * @returns {number} - The corresponding priority number.
   */
  private getPriorityNumber(prio: string): number {
    switch (prio) {
      case 'Low': return 1;
      case 'Medium': return 2;
      case 'Urgent': return 3;
      default: return 2;
    }
  }
  

  /**
   * Sets the priority value in the form.
   *
   * @param {string} prio - The priority value to set.
   */
  setPrio(prio: string) {
    this.taskForm.patchValue({ priority: prio });
  }
  

  /**
   * Resets the form and clears the form directive.
   *
   * @param {FormGroupDirective} formDirective - The form directive to reset.
   */
  public onSubmit(formDirective: FormGroupDirective): void {
    this.taskForm.reset();
    formDirective.resetForm();
  }
  

  /**
   * Adds a new subtask from the MatChipInputEvent.
   *
   * @param {MatChipInputEvent} event - The event containing the new subtask title.
   */
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.addSubtask(value);
    }
    this.currentSubtask.set('');
    event.chipInput!.clear();
  }
  

  /**
   * Removes a subtask by ID.
   *
   * @param {number} subtaskid - The ID of the subtask to remove.
   */
  remove(subtaskid: number): void {
    const index = this.subtasksFormArray.controls.findIndex(control => control.value.id === subtaskid);
    if (index >= 0) {
      this.removeSubtask(index);
    }
  }
  

  /**
   * Adds a subtask from the selected option in MatAutocomplete.
   *
   * @param {MatAutocompleteSelectedEvent} event - The selected event from autocomplete.
   */
  selected(event: MatAutocompleteSelectedEvent): void {
    this.addSubtask(event.option.viewValue);
    this.currentSubtask.set('');
    event.option.deselect();
  }
  

  /**
   * Emits an event to toggle the edit mode.
   */
  abortForm() {
    this.editModeToggled.emit();
  }
  

  /**
   * Converts a date string in 'YYYY-MM-DD' format to a Date object.
   *
   * @param {string} dateString - The date string to convert.
   * @returns {Date | null} - The resulting Date object or null if conversion fails.
   */
  convertToDate(dateString: string): Date | null {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  

  /**
   * Formats a Date object to a string in 'YYYY-MM-DD' format.
   *
   * @param {Date} date - The Date object to format.
   * @returns {string} - The formatted date string.
   */
  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }
  

  /**
   * Saves the task data from the form and updates it via the TaskService.
   */
  saveTask() {
    const taskData: Task = this.buildTaskData();
    this.taskService.updateTask(taskData).subscribe({});
  }
  

  /**
   * Builds the task data object from the form values.
   *
   * @returns {Task} - The task data object.
   */
  private buildTaskData(): Task {
    const dueDate = this.taskForm.get('dueDate')?.value;
    const formattedDueDate = dueDate ? this.formatDate(new Date(dueDate)) : '';
    const priorityNumber = this.getPriorityNumber(this.taskForm.get('priority')?.value || 'Medium');

    return {
      title: this.taskForm.get('title')?.value,
      description: this.taskForm.get('description')?.value,
      assignedTo: this.taskForm.get('assignedTo')?.value,
      due_date: formattedDueDate,
      prio: priorityNumber,
      category: this.taskForm.get('category')?.value,
      task_status: this.taskForm.get('task_status')?.value,
      subtasks: this.taskForm.get('subtasks')?.value || [],
      position: this.taskForm.get('position')?.value || 0,
      id: this.data.task.id
    };
  }
}
