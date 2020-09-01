import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};
  photoURL: string;
  constructor(public _authService: AuthService, private _alertify: AlertifyService, private _router: Router) { }

  ngOnInit() {
    this._authService.currentPhotoUrl.subscribe(response => this.photoURL = response);
  }

  login() {
    // console.log(this.model);
    this._authService.login(this.model).subscribe(next => {
      this._alertify.success("Logged in successfully");
    },
      error => {
        this._alertify.error(error);
      },
      () => {
        this._router.navigate(['/members']);
      });
  }


  loggedIn() {
    // const token = localStorage.getItem("token");
    // return !!token; //if token =null then false else true

    return this._authService.loggedIn();
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this._authService.decodeToken = null;
    this._authService.currentUser = null;
    this._alertify.message("LoggedOut");
    this._router.navigate(['/home']);
  }

}
