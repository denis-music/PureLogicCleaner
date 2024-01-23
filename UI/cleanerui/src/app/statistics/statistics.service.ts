import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rooms } from '../model/rooms.model';
import { CleaningHistory } from '../model/cleaningHistory.model';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private apiUrl = 'https://localhost:7079/Rooms'; // Update this URL as needed
  private apiUrlClean = 'https://localhost:7079/CleaningHistory/memberRoom/d55bd14c-c380-42d5-a9c6-aa1c0b050804'
  constructor(private http: HttpClient) {}

  getCleaningType(): Observable<Rooms[]> {
    return this.http.get<Rooms[]>(this.apiUrl);
  }

  getCleaningStatus(): Observable<CleaningHistory[]> {
    return this.http.get<CleaningHistory[]>(this.apiUrlClean);
  }

  changeCleaningStatus(id: string): Observable<boolean> {
    return this.http.put<boolean>(`https://localhost:7079/CleaningHistory/${id}/completed`, id);
  }
}
