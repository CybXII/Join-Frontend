import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginFormComponent } from '../login-form/login-form.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, LoginFormComponent, MatCardModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  animation: boolean;
  currentPath: string;
  
  /**
   * Initializes the LoginComponent.
   * Sets up the animation state and retrieves the current URL from AuthService.
   * Navigates to the 'join/login' route.
   *
   * @param {AuthService} as - The AuthService for authentication related operations.
   * @param {Router} router - The Angular Router service used for navigation.
   */
  constructor(private as: AuthService, private router: Router) {
    this.animation = this.as.logoAnimation;
    this.as.getCurrentURL();
    this.currentPath = '';
    this.move();
    this.router.navigate(['join/login']);
  }
  

  /**
   * Subscribes to the currentPath observable from AuthService
   * and updates the component's currentPath property accordingly.
   */
  ngOnInit() {
    this.as.currentPath$.subscribe(path => {
      this.currentPath = path;
    });
  }
  

  /**
   * Handles the animation state. If animation is enabled, it will
   * disable the animation after a timeout of 1000 milliseconds.
   */
  move() {
    if (this.animation) {
      setTimeout(() => {
        this.as.disableAnimation();
        this.animation = this.as.logoAnimation;
      }, 1000);
    }
  }
}
