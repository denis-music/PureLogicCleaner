import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  // user: User = new User();
  model: any ={};

  apiUrl = environment.baseUrl +"/register"; 


  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required]],
      age: ['', [Validators.required]],

      password: ['', [Validators.required]],
      passwordConfirm: ['', [Validators.required]],
    }, {
      validators: this.passwordsMatchValidator
    });
  }

  constructor(private fb:FormBuilder, private router: Router, /* private authService: AuthService */ private http: HttpClient)
  {
    this.registerForm = this.fb.group({
        firstname: ['', [Validators.required]],
        lastname: ['', [Validators.required]],
        username: ['', [Validators.required]],
        email: ['', [Validators.required]],
        age: ['', [Validators.required]],
  
        password: ['', [Validators.required]],
        passwordConfirm: ['', [Validators.required]],
      }, {
        validators: this.passwordsMatchValidator
    });
   }

   get firstname() { return this.registerForm.get('firstname'); }
   get lastname() { return this.registerForm.get('lastname'); }
   get username() { return this.registerForm.get('username'); }
   get email() { return this.registerForm.get('email'); }
   get age() { return this.registerForm.get('age'); }
   get password() { return this.registerForm.get('password'); }
   get passwordconfirm() { return this.registerForm.get('passwordConfirm'); }


   passwordsMatchValidator(formGroup: FormGroup)
   {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('passwordConfirm')?.value;
  
    return password === confirmPassword ? null : { passwordsNotMatch: true };
  }
  
  passwordsDoNotMatch()
  {
    return this.registerForm.hasError('passwordsNotMatch') &&
           (this.registerForm.get('passwordConfirm')?.dirty || this.registerForm.get('passwordConfirm')?.touched);
  }


   onSubmit()
  {
    if(this.registerForm.invalid)
    {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.model.FirstName = this.firstname?.value;
    this.model.LastName = this.lastname?.value;
    this.model.Username = this.username?.value;
    this.model.Email = this.email?.value;
    this.model.Age = this.age?.value;
    this.model.Password = this.password?.value;
    this.model.passwordConfirm = this.passwordconfirm?.value;

    // this.authService.register(this.user).subscribe(e =>{

    //   this.router.navigate(['/home']);
    // this.registerForm.reset();

    // },error =>{
    //   console.log(error);
    // });
  }

   cancelLogin()
   {
     this.router.navigate(['/home'])
   }
}
