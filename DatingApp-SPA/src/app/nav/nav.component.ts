import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};
  constructor(private _authService: AuthService) { }

  ngOnInit() {
  }

  login() {
    console.log(this.model);
    this._authService.login(this.model).subscribe(next => {
      console.log("Logged in successfully");
    },
      error => {
        console.log("Failed");
      });
  }

  loggedIn() {
    const token = localStorage.getItem("token");
    return !!token; //if token =null then false else true
  }

  logout() {
    localStorage.removeItem("token");
    console.log("LoggedOut");
  }

}
