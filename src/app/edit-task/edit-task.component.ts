import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { EditpreviewComponent } from './editpreview/editpreview.component';
import { EditableComponent } from './editable/editable.component';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [MatIcon, EditpreviewComponent, EditableComponent],
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent {
  edit: boolean = true;


  /**
   * Toggles the edit mode state between true and false.
   * When true, the component is in edit mode. When false, it is in view mode.
   */
  toggleEditMode() {
    this.edit = !this.edit;
  }
}
