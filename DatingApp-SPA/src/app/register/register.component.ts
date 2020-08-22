import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter();
  model: any = {};


  constructor(private _authService: AuthService, private _alertify: AlertifyService) { }

  ngOnInit() {
  }

  register() {
    this._authService.register(this.model).subscribe(() => {
      this._alertify.success("registeration successfull");
    },
      err => {
        this._alertify.error(err);
      });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

}
