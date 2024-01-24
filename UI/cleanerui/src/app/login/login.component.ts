import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { Observable } from 'rxjs';
import { UserAuth } from '../model/user.auth.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;
  model: UserAuth = new UserAuth;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.required]],
      password: ['', [Validators.required, Validators.required]]
    });
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }


  onSubmit() {
    this.model.username = this.username?.value;
    this.model.password = this.password?.value;

    this.authService.loginMethod(this.model).subscribe(x => {
      this.loginForm.reset();
      this.router.navigate(['/home']);
    }, error => {
      console.log(error);
    })
  }

  cancelLogin() {
    this.router.navigate(['/home'])
  }
}
