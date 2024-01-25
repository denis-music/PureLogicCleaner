import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Rooms } from '../model/rooms.model';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  apiUrl = environment.baseUrl + "Rooms/";

  constructor(private http: HttpClient) { }

  getRoomById(roomId: string): Observable<Rooms> {
    return this.http.get<Rooms>(this.apiUrl + `${roomId}`);
  }

  saveRoom(room: Rooms): Observable<Rooms | null> {
    return this.http.post<Rooms>(this.apiUrl, room);
  }
}
