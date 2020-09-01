import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  user: User;
  photoURL: string;

  @ViewChild("editForm", { static: true }) editForm: NgForm;

  // To prevent accidently closing browser or tab when there are some unsaved changes.
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty)
      $event.returnValue = true;
  }

  constructor(private _route: ActivatedRoute, private _alertify: AlertifyService, private _userService: UserService, private _authService: AuthService) { }

  ngOnInit() {
    this._route.data.subscribe((data => {
      this.user = data['user'];
    }));

    this._authService.currentPhotoUrl.subscribe(res=>this.photoURL=res);
  }

  updateProfile() {
    // console.log(this.user);
    this._userService.updateUser(this._authService.decodeToken.nameid, this.user).subscribe(next => {
      this._alertify.success("Profile updated");
      this.editForm.reset(this.user);
    }, error => {
      this._alertify.error(error);
    });

  }

  // updateMainPhoto(url: string) {
  //   this.user.photoUrl = url;
  // }

}
