import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../model/users.model';
import { UserRoom } from '../model/userRoom.model';

@Injectable({
  providedIn: 'root'
})
export class UserRoomsService {

  apiUrl = environment.baseUrl + "UserRooms/";

  constructor(private http: HttpClient) { }

  saveUserRoom(userroom: UserRoom): Observable<boolean | null> {
    const item = localStorage.getItem('user');
    if (item) {
      const user: User[] = JSON.parse(item);
      userroom.userId = user[0].id;
      return this.http.post<boolean>(this.apiUrl, userroom);
    } else {
      console.log('No user data found in localStorage');
      return of(null);
    }
  }

  getUserRooms(): Observable<UserRoom[] | null> {
    const item = localStorage.getItem('user');
    if (item) {
      const user: User[] = JSON.parse(item);
      return this.http.get<UserRoom[]>(this.apiUrl + `?UserId=${user[0].id}`);
    } else {
      console.log('No user data found in localStorage');
      return of(null);
    }
  }

  getUserRoomById(userRoomId: string): Observable<UserRoom | null> {
    return this.http.get<UserRoom>(this.apiUrl + `${userRoomId}`);
  }
}
