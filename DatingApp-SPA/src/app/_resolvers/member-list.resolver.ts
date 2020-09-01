import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class MemberListResolver implements Resolve<User[]> {

    constructor(private _userService: UserService, private _router: Router, private _altertify: AlertifyService) {


    }
    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        //Resolver automatically subscribes the method so we dont need to do that
        return this._userService.getUsers().pipe(catchError(err => {
            this._altertify.error("Problem retrieving members");
            this._router.navigate(['/home']);
            return of(null); //returning observable of null
        }));
    }
}