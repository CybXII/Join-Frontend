import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public logoAnimation = true;
  private currentPathSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public currentPath$: Observable<string> = this.currentPathSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.getCurrentURL();
      }
    });
    this.getCurrentURL();
  }


  /**
   * Disables the logo animation by setting the `logoAnimation` property to `false`.
   */
  disableAnimation() {
    this.logoAnimation = false;
  }


  /**
   * Updates the current path observable with the current URL of the router.
   */
  getCurrentURL() {
    this.currentPathSubject.next(this.router.url.replace('/', ''));
  }


  /**
   * Sends a POST request to log in a user with email and password.
   * 
   * @param {string} username - The username or email of the user.
   * @param {string} password - The password of the user.
   * @param {boolean} remember - Whether to remember the user or not.
   * @returns {Observable<any>} - An observable with the response from the server.
   */
  loginWithEmailAndPassword(username: string, password: string, remember: boolean): Observable<any> {
    return this.http.post<any>(`${environment.baseURL}/join/login/`, { username, password, remember });
  }


  /**
   * Sends a POST request to sign up a new user with email and password.
   * 
   * @param {string} username - The username of the user.
   * @param {string} lastname - The last name of the user.
   * @param {string} email - The email of the user.
   * @param {string} password - The password of the user.
   * @returns {Observable<Object>} - An observable with the response from the server.
   */
  signUPWithEmailAndPassword(username: string, lastname: string, email: string, password: string): Observable<Object> {
    return this.http.post(`${environment.baseURL}/join/signup/`, { username, lastname, email, password });
  }


  /**
   * Stores the provided token in local storage.
   * 
   * @param {string} token - The token to be stored.
   */
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }


  /**
   * Retrieves the token from local storage.
   * 
   * @returns {string | null} - The stored token or null if not found.
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }


  /**
   * Automatically logs in the user if a token is present in local storage and 'remember' is true.
   */
  autoLogin(): void {
    const token = this.getToken();
    const remember = localStorage.getItem('remember') === 'true';
    if (token && remember) {
      this.router.navigate(['join/tasks']);
    }
  }
}