import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseURL = environment.apiUrl + "auth/";
  jwtservice = new JwtHelperService();
  decodeToken: any;
  currentUser: User;
  photoUrl = new BehaviorSubject<string>("/src/app/assets/user.png");
  currentPhotoUrl = this.photoUrl.asObservable();

  constructor(private _http: HttpClient) { }

  changeMemberPhoto(url: string) {
    this.photoUrl.next(url);
  }


  login(model: any) {
    return this._http.post(this.baseURL + "login", model).pipe(map((response: any) => {
      const user = response;
      if (user) {
        localStorage.setItem("token", user.token);
        localStorage.setItem("user", JSON.stringify(user.userdata));
        this.currentUser = user.userdata;
        this.decodeToken = this.jwtservice.decodeToken(user.token);
        this.changeMemberPhoto(this.currentUser.photoUrl);
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
