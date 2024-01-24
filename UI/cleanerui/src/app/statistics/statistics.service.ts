import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Rooms } from '../model/rooms.model';
import { CleaningHistory } from '../model/cleaningHistory.model';
import { environment } from 'src/environments/environment';
import { User } from '../model/users.model';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private apiUrl = 'https://localhost:7079/Rooms'; // Update this URL as needed
  constructor(private http: HttpClient) {}

  getCleaningType(): Observable<Rooms[]> {
    return this.http.get<Rooms[]>(this.apiUrl);
  }

  getCleaningStatus(): Observable<CleaningHistory[] | null> {
    const item = localStorage.getItem('user');
    if (item) {
      const user: User[] = JSON.parse(item);
      var apiUrlClean = environment.baseUrl + 'CleaningHistory/memberRoom/'
      return this.http.get<CleaningHistory[]>(apiUrlClean + `${user[0].id}`);
    } else {
      console.log('No user data found in localStorage');
      return of(null);
    }
  }

  changeCleaningStatus(id: string): Observable<boolean> {
    return this.http.put<boolean>(`https://localhost:7079/CleaningHistory/${id}/completed`, id);
  }
}
