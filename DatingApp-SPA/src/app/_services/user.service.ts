import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';


// const httpOptions = {
//   headers: new HttpHeaders({
//     'Authorization': 'Bearer ' + localStorage.getItem('token')
//   })
// };

@Injectable({
  providedIn: 'root'
})


export class UserService {

  baseUrl = environment.apiUrl;


  constructor(private _http: HttpClient) { }

  getUsers(): Observable<User[]> {
    // return this._http.get<User[]>(this.baseUrl + "users", httpOptions);
    return this._http.get<User[]>(this.baseUrl + "users");
  }

  getUser(id): Observable<User> {
    // return this._http.get<User>(this.baseUrl + "users/" + id, httpOptions);
    return this._http.get<User>(this.baseUrl + "users/" + id);
  }

  updateUser(id: number, user: User) {
    return this._http.put(this.baseUrl + "users/" + id, user);
  }

  setMainPhoto(userid: number, photoid: number) {
    return this._http.post(this.baseUrl + "users/" + userid + "/photo/" + photoid + "/setMain", {});
  }

  deletePhoto(userid: number, photoid: number) {
    return this._http.delete(this.baseUrl + "users/" + userid + "/photo/" + photoid);
  }
}
