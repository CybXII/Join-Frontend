import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Task } from '../models/task.model';
import { Board } from '../models/board.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }


  /**
   * Generates HTTP headers with the authorization token from local storage.
   * 
   * @returns {HttpHeaders} - The headers object including the authorization token.
   */
  get headers() {
    return new HttpHeaders().set('Authorization', 'Token ' + localStorage.getItem('token'));
  }


  /**
   * Retrieves all tasks for the current user from the server.
   * 
   * @returns {Promise<Board>} - A promise that resolves to a `Board` object containing the tasks.
   */
  getTodos() {
    return lastValueFrom(this.http.get<Board>(`${environment.baseURL}/join/tasks/`, { headers: this.headers }));
  }


  /**
   * Adds a new task to the server.
   * 
   * @param {Task} newTask - The task object to be added.
   * @returns {Observable<any>} - An observable with the response from the server.
   */
  addTask(newTask: Task): Observable<any> {
    return this.http.post<any>(`${environment.baseURL}/join/tasks/`, newTask, { headers: this.headers });
  }


  /**
   * Updates an existing task on the server.
   * 
   * @param {Task} task - The task object with updated details.
   * @returns {Observable<any>} - An observable with the response from the server.
   */
  updateTask(task: Task): Observable<any> {
    return this.http.put(`${environment.baseURL}/join/tasks/${task.id}/`, task, { headers: this.headers });
  }


  /**
   * Deletes a task from the server.
   * 
   * @param {Task} task - The task object to be deleted.
   * @returns {Observable<any>} - An observable with the response from the server.
   */
  deleteTask(task: Task): Observable<any> {
    return this.http.delete(`${environment.baseURL}/join/tasks/${task.id}/`, { headers: this.headers });
  }
}