import { Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-signup-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent {
  username: string = '';
  lastname: string = '';
  email: string = '';
  password: string = '';
  passwordChecker: string = '';
  accepted = false;
  currentPath = '';
  hide = signal(true);
  checkhide = signal(true);

  constructor(private as: AuthService, private router: Router) {
    this.as.getCurrentURL();
    this.router.navigate(['join/signup']);
  }


  /**
   * Initializes the component and subscribes to the `currentPath$` observable
   * from the `AuthService` to update the `currentPath` property.
   */
  ngOnInit(): void {
    this.as.currentPath$.subscribe(path => {
      this.currentPath = path;
    });
  }


  /**
   * Toggles the visibility of the password field by updating the `hide` signal.
   * Stops event propagation to prevent default action.
   *
   * @param {MouseEvent} event - The mouse event that triggered the function.
   */
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }


  /**
   * Toggles the visibility of the password checker field by updating the `checkhide` signal.
   * Stops event propagation to prevent default action.
   *
   * @param {MouseEvent} event - The mouse event that triggered the function.
   */
  clickEventcheck(event: MouseEvent) {
    this.checkhide.set(!this.checkhide());
    event.stopPropagation();
  }


  /**
   * Handles the signup process by sending user details to the `AuthService`.
   * Redirects to the login page upon successful signup.
   * 
   * Logs an error message if the signup process fails.
   */
  async signup() {
    try {
      const response = await lastValueFrom(
        this.as.signUPWithEmailAndPassword(this.username, this.lastname, this.email, this.password)
      );
      await this.router.navigate(['join/login']);
    } catch (error: any) {
      console.error('Signup error:', error.error || error.message);
    }
  }
}
