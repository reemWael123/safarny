import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/dashboard/components/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  isHide: boolean = true;
  erroMsg: string = '';
  constructor(
    private _AuthService: AuthService,
    private _ToastrService: ToastrService
  ) {}
  regform: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\w{6}$/),
    ]),
    userName: new FormControl('', [Validators.required]),
    nationality: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  whenregister(data: FormGroup): void {
    let myForm = new FormData();
    myForm.append('email', data.value.email);
    myForm.append('userName', data.value.userName);
    myForm.append('password', data.value.password);
    myForm.append('nationality', data.value.nationality);
    myForm.append('firstName', data.value.firstName);
    myForm.append('confirmPassword', data.value.confirmPassword);
    myForm.append('lastName', data.value.lastName);
    this._AuthService.register(data.value).subscribe({
      next: (responce) => {
        console.log(responce);
      },
      error: (err) => {
        console.log(err);
        this.erroMsg = err.errors;
        console.timeLog(this.erroMsg);
        this._ToastrService.warning(this.erroMsg);
      },
      complete: () => {
        console.log('completed');
        this._ToastrService.success('success');
      },
    });
  }
}
