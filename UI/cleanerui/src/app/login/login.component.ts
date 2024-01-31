import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { UserAuth } from '../model/user.auth.model';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;
  model: UserAuth = new UserAuth();
  loading = false;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService,
    private alertifyService: AlertifyService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.model.username = this.username?.value;
    this.model.password = this.password?.value;

    this.authService.loginMethod(this.model).subscribe(
      () => {
        this.alertifyService.successAlert("Login Successful!")
        this.loginForm.reset();
        this.router.navigate(['/home']);
      },
      error => {
        console.log(error);
        this.loading = false;
      }
    );
  }

  cancelLogin() {
    this.router.navigate(['/home']);
  }
}
