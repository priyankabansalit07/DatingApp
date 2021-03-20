import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { User } from '../_models/user';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter();
  // model: any = {}; 
  user: User;

  registerForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(private _authService: AuthService, private _alertify: AlertifyService, private _router: Router, private _fb: FormBuilder) { }

  ngOnInit() {

    this.bsConfig = {
      containerClass: 'theme-red'
    };

    this.createRegisterForm();
    // console.log(this.registerForm.get('comparePassword.password'));
  }

  createRegisterForm() {
    this.registerForm = this._fb.group({
      gender: ['male', Validators.required],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      comparePassword: this._fb.group({
        password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
        confirmPassword: ['', Validators.required]
      }, { validator: this.comparePasswordValidator }),

    });
  }

  //custom Validator
  comparePasswordValidator(g: FormGroup) {
    const pswdctrlvalue = g.get('password').value;
    const confirmpswdvalue = g.get('confirmPassword').value;

    if (pswdctrlvalue === confirmpswdvalue)
      return null;
    else
      return { 'mismatch': true };

  }

  register() {

    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      this.user.password = this.registerForm.get('comparePassword.password').value;
      this._authService.register(this.user).subscribe(() => {
        this._alertify.success("Registeration successfull");
      },
        err => {
          this._alertify.error(err);
        },
        () => {
          //On Completion
          this._authService.login(this.user).subscribe(() => {
            this._router.navigate(['/members']);
          })
        });
    }
    console.log(this.registerForm.value);

  }

  cancel() {
    this.cancelRegister.emit(false);
  }

}
