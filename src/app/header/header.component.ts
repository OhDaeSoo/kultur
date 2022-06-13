import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { ToastrService } from 'ngx-toastr';

import { UserSession } from '../user/user-session.model';
import { User } from '../user/user.model';

import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @ViewChild(MatMenuTrigger, {static: true}) triggerUserMenu: MatMenuTrigger;
  private userSessionSub: Subscription;
  private userKulturSub: Subscription;
  userK: User = null;
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService,
              private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.userSessionSub = this.authService.userSessionSubject.subscribe((userSession: UserSession) => {
      console.log("user Firebase ::", userSession);
      this.isLoggedIn = userSession !== null ? true : false;
    });
    this.userKulturSub = this.authService.userKulturSubject.subscribe((userKultur: User) => {
      console.log("user Kult(u)r ::", userKultur);
      this.userK = userKultur;
      console.log("this.userK", this.userK);
      // TODO : Traiter userK..
    });
    this.authService.autologin();
  }

  onClickAvatar() {
    if(this.triggerUserMenu) {
      this.triggerUserMenu.openMenu();
    }
  }

  onLogout() {
    this.authService.logout();
    this.toastrService.success('Vous nous quittez déjà ? On espère vous revoir bientôt ! N\'hésitez pas à revenir pour déposer un nouvel avis','Quel dommage :(');
  }

  ngOnDestroy(): void {
    if (this.userSessionSub) {
      this.userSessionSub.unsubscribe();
    }
    if (this.userKulturSub) {
      this.userKulturSub.unsubscribe();
    }
  }

}
