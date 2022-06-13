import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';

import { AuthService, AuthResponseData } from './auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  loginModeBtn: boolean = true;
  labelBtnLogin: string = "Je m'identifie";
  labelHelpBtnLogin: string = "Vous n'avez pas encore de compte ?";
  nbMinCharsForPwd: number = 6;

  userForm = this.fb.group({
    userEmail: ['', [Validators.required, Validators.email]],
    userPassword: ['', [Validators.required, Validators.minLength(this.nbMinCharsForPwd)]],
    userPseudo: [''],
    userUrlAvatar: [''],
    userDesc: ['']
  });

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private toastrService: ToastrService) { }

  switchStateBtn() {
    this.userForm.reset({
      userEmail: '',
      userPassword: '',
      userPseudo: '',
      userUrlAvatar: '',
      userDesc: ''
    });
    if (this.loginModeBtn) {
      this.userForm.get('userPseudo').setValidators(Validators.required);
      this.loginModeBtn = false;
      this.labelBtnLogin = "Je crée mon compte !";
      this.labelHelpBtnLogin = "J'ai un compte, c'est parti !";
    } else {
      this.userForm.get('userPseudo').clearValidators();
      this.loginModeBtn = true;
      this.labelBtnLogin = "Je m'identifie";
      this.labelHelpBtnLogin = "Vous n'avez pas encore de compte ?";
    }
    this.userForm.get('userPseudo').updateValueAndValidity();
  }

  onSubmit() {
    // Soumission de l'user à Firebase
    // SignUp
    if (!this.loginModeBtn) {
      this.authService
      .signUp(this.userForm.controls['userEmail'].value,
      this.userForm.controls['userPassword'].value,
      this.userForm.controls['userPseudo'].value,
      this.userForm.controls['userUrlAvatar'].value,
      this.userForm.controls['userDesc'].value)
      .subscribe(
        (response: AuthResponseData) => {
          console.log("Creation user sur Auth Firebase en succes ::",response);
        },
        (errorRes: string) => {
          console.log("Creation user sur Auth Firebase en erreur ::", errorRes);
          this.toastrService.error(errorRes,'Problème');
        }
      );
    } else { // SignIn
      this.authService
      .signIn(this.userForm.controls['userEmail'].value, this.userForm.controls['userPassword'].value)
      .subscribe(
        (response: AuthResponseData) => {
          console.log("Recuperation compte Auth Firebase en succes ::",response);
        },
        (errorRes: string) => {
          console.log("Recuperation compte Auth Firebase en erreur ::", errorRes);
          this.toastrService.error(errorRes,'Problème');
        }
      );
    }

  }

  ngOnInit(): void {
  }

}
