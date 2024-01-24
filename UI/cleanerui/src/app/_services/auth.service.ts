import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserAuth } from '../model/user.auth.model';
import { UserUpsert } from '../model/user.upsert.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.baseUrl + "Users/";

  helper = new JwtHelperService();
  decodedToken: any;

  constructor(private http: HttpClient) { }

  loginMethod(model: UserAuth) {

    return this.http.post(this.apiUrl + 'login', model)
      .pipe(
        map((response: any) => {
          const user = response;
          if (user) {
            localStorage.setItem('token', user.token);
            this.decodedToken = this.helper.decodeToken(user.token);
          }
        })
      )
  }

  register(model: UserUpsert) {
    return this.http.post(this.apiUrl + 'register', model);
  }
}
