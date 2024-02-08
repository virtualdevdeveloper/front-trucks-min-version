import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/utils/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  error = '';
  returnUrl!: string;
  showPassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    } else {
      this.authenticationService
        .loginZulema({
          email: this.f.email.value,
          password: this.f.password.value,
        })
        .subscribe(
          (data) => {
            console.log(data);
            this.router.navigate(['/dashboard']).then(() => {
              window.location.reload();
            });
          },
          (error) => {
            this.error = error.error.excepcion;
            console.log(error.error.excepcion);
          }
        );
    }
  }
}
