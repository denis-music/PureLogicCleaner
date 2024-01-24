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
  constructor(private http: HttpClient) { }

  // getUser(id: string): Observable<User | null> {
  //   const item = localStorage.getItem('user');

  //   if (item) {
  //     const user: User[] = JSON.parse(item);
  //     return this.http.get<User>(environment.baseUrl + `Users/${user[0].id}`);
  //   } else {
  //     return of(null); // or throwError(new Error('No user data found in localStorage'));
  //   }
  // }

  getUserByUsername(username: string): Observable<User | null> {
    const item = this.http.get<User>(environment.baseUrl + `username/${username}`);
    console.log(item);
    return item;
  }
}