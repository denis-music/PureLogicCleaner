import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../model/users.model';
import { environment } from 'src/environments/environment';
import { UserSearch } from '../model/user.search.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = environment.baseUrl + "Users/";

  constructor(private http: HttpClient) { }

  getUserByUsername(username: string): Observable<User | null> {
    return this.http.get<User>(environment.baseUrl + `username/${username}`);
  }

  getUser(): Observable<User | null> {
    const item = localStorage.getItem('user');
    if (item) {
      const user: User[] = JSON.parse(item);
      return this.http.get<User>(this.apiUrl + `${user[0].id}`);
    } else {
      console.log('No user data found in localStorage');
      return of(null);
    }
  }
}