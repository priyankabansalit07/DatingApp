import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class MemberEditResolver implements Resolve<User> {

    constructor(private _userService: UserService, private _router: Router, private _altertify: AlertifyService,
         private _authService:AuthService) {


    }
    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        //Resolver automatically subscribes the method so we dont need to do that
        return this._userService.getUser(this._authService.decodeToken.nameid).pipe(catchError(err => {
            this._altertify.error("Problem retrieving you detail");
            this._router.navigate(['/members']);
            return of(null); //returning observable of null
        }));

        // this._authService.decodeToken.nameid = Login ID of user
    }
}