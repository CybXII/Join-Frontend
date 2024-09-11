import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginFormComponent } from './login-form/login-form.component';
import { MatCardModule } from '@angular/material/card';
import { JoinComponent } from './join/join.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    LoginFormComponent,
    JoinComponent,
    MatCardModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService) {}

  /**
   * Performs initialization tasks when the component is created.
   * Calls the autoLogin method from the AuthService to handle user login state restoration.
   */
  ngOnInit() {
    this.authService.autoLogin();
  }
}