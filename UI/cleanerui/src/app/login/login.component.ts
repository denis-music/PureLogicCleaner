import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../_models/User';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;
  model: any;

  constructor(private fb:FormBuilder, private router:Router, private authService: AuthService)
  {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.required]],
      password: ['', [Validators.required, Validators.required]]
    });
   }

   get username() { return this.loginForm.get('username'); }
   get password() { return this.loginForm.get('password'); }


   onSubmit()
  {
    this.model.Username = this.username?.value;
    this.model.Password = this.password?.value;

    this.authService.loginMethod(this.model).subscribe(x => {

      this.loginForm.reset();
      this.router.navigate(['/home']);

    },error =>{
      console.log(error);
    })
  }

  cancelLogin()
  {
    this.router.navigate(['/home'])
  }
}
