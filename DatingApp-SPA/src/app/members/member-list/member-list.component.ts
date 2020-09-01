import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { User } from '../../_models/user';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  users: User[];
  constructor(private _userService: UserService, private _alertify: AlertifyService,private _route: ActivatedRoute) { }

  ngOnInit() {
    this._route.data.subscribe((data=>{
      this.users=data['users'];
    }));
  }


  // loadUsers() {
  //   this._userService.getUsers().subscribe((response: User[]) => {
  //     this.users = response;
  //   }, error => {
  //     this._alertify.error(error);
  //   })
  // }

}
