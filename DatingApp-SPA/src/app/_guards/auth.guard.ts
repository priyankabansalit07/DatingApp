import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private _authService: AuthService, private _router: Router, private _alertify: AlertifyService) { }
  canActivate(): boolean {
    if (this._authService.loggedIn()) {
      return true;
    } else {
      this._alertify.warning("You must login to perform this action");
      this._router.navigate(["/home"]);
    }
  };
}
