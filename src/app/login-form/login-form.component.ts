import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login-form',
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  email: string = '';
  password: string = '';
  remember = false;
  logoAnimation = true;

  constructor(private authService: AuthService, private router: Router) {}

  hide = signal(true);

  /**
   * Toggles the visibility of the password field.
   * 
   * @param {MouseEvent} event - The mouse event triggering the toggle.
   */
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  

  /**
   * Handles the login process with email and password.
   * Sets the token in AuthService and navigates to the 'join' route.
   * 
   * @async
   */
  async login() {
    try {
      const response = await lastValueFrom(
        this.authService.loginWithEmailAndPassword(this.email, this.password, this.remember)
      );
      this.authService.setToken(response.token);
      localStorage.setItem('remember', this.remember.toString());
      this.router.navigate(['join']);
    } catch (error) {
      console.log(error);
    }
  }
  

  /**
   * Sets predefined guest credentials and calls the login method.
   * 
   * @async
   */
  async guestlogin() {
    this.email = 'guest.test@guest.de';
    this.password = 'J0inGuestMember';
    this.login();
  }
}
