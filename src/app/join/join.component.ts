import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BoardComponent } from '../board/board.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-join',
  standalone: true,
  imports: [RouterOutlet, BoardComponent, RouterLink, MatMenuModule, MatIconModule, RouterLinkActive, MatCardModule, MatSidenavModule, MatButtonModule, MatToolbar],
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent {
  /**
   * Initializes the JoinComponent and navigates to the 'join/summary' route.
   *
   * @param {Router} router - The Angular Router service used for navigation.
   */
  constructor(private router: Router) {
    this.router.navigate(['join/summary']);
  }
  

  /**
   * Logs out the user by removing the token and remember key from localStorage.
   * Redirects the user to the '/join/login' route after logout.
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('remember');
    this.router.navigate(['/join/login']);
  }
}
