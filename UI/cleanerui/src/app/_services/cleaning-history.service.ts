import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CleaningHistoryCompletion } from '../model/cleaningHistoryCompletion.model';

@Injectable({
  providedIn: 'root'
})
export class CleaningHistoryService {

  apiUrl = environment.baseUrl + "CleaningHistory/";

  constructor(private http: HttpClient) { }

  saveCompletionInfo(id: string, cleaningModel: CleaningHistoryCompletion): Observable<boolean> {
    return this.http.put<boolean>(this.apiUrl + `${id}/completedInfo`, cleaningModel);
  }

  setUncompletedStatus(id: string): Observable<boolean> {
    return this.http.put<boolean>(this.apiUrl + `${id}/uncompleted`, id);
  }

  getAll(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
