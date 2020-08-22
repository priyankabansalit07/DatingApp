import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseURL = "http://localhost:5000/api/auth/";
  jwtservice = new JwtHelperService();
  decodeToken: any;

  constructor(private _http: HttpClient) { }

  login(model: any) {
    return this._http.post(this.baseURL + "login", model).pipe(map((response: any) => {
      const user = response;
      if (user) {
        localStorage.setItem("token", user.token);
        this.decodeToken = this.jwtservice.decodeToken(user.token);
      }

    }));
  }

  loggedIn() {
    const token = localStorage.getItem("token");
    return !this.jwtservice.isTokenExpired(token);
  }

  register(model: any) {
    return this._http.post(this.baseURL + "register", model);
  }
}
