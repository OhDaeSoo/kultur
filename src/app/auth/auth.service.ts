import { environment } from 'src/environments/environment';

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject, throwError, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { User } from '../user/user.model';
import { UserSession } from '../user/user-session.model';

import { ToastrService } from 'ngx-toastr';

// On crée cette interface qui va mapper l'objet JSON de retour du POST signup/signin à Firebase
// https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean; // Champ en plus dans le sign in (pas présent dans le sign up) de Firebase
}

@Injectable({providedIn: 'root'})
export class AuthService {

  user: User = null; // user sur site Kult(u)r
  userSessionSubject = new BehaviorSubject<UserSession>(null); // Subject user FB
  userKulturSubject = new Subject<User>(); // Subject user Kult(u)r
  private tokenExpirationTimer: any;

  constructor(private httpClient: HttpClient,
              private toastrService: ToastrService,
              private router: Router) {}

  // Signup Section
  /////////////////
  signUp(userEmail: string, userPassword: string, userPseudo: string, userUrlAvatar: string, userDesc: string) {
    return this.httpClient
    .post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
      {
        email: userEmail,
        password: userPassword,
        returnSecureToken: true
      }
    ).pipe(
      catchError(this.handleErrorAuthentication),
      tap((resData: AuthResponseData) => {
        this.user = new User(userEmail, userPseudo, userUrlAvatar, userDesc);
        this.createUserOnKultur(resData, this.user).subscribe(
          (response: any) => {
            console.log("User cree sur Kult(u)r ::",response);
            this.toastrService.success('Vous êtes désormais membre du site Kult(u)r','Félicitations !');
          },
          (errorRes: string) => {
            // Rollback de la creation de l'user auth sur Firebase
            this.httpClient
            .post(
              'https://identitytoolkit.googleapis.com/v1/accounts:delete?key=' + environment.firebaseAPIKey,
              {
                idToken: resData.idToken
              }
            ).pipe(
              catchError(this.handleErrorDeleteFBAccount)
            ).subscribe(
              () => {
                this.toastrService.error(errorRes,'Problème');
              },
              (errorResDelFBAccount: string) => {
                this.toastrService.error(errorResDelFBAccount,'Problème');
              }
            );
          }
        );
      })
    );
  }

  private handleErrorAuthentication(errorRes: HttpErrorResponse) {
    let errorMessage = "Une erreur est apparue !";
    console.log("Erreur ret by Firebase ::",errorRes);
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'Email déjà associé à un compte Kult(u)r existant';
        break;
      case 'WEAK_PASSWORD : Password should be at least 6 characters':
        errorMessage = 'Votre mot de passe doit contenir au moins 6 caractères';
        break;
    }
    return throwError(errorMessage);
  }

  private createUserOnKultur(resData: AuthResponseData, userK: User) {
    return this.httpClient.put(
      'https://mon-app-kultur.firebaseio.com/users/' + userK.pseudo + '.json',
      userK,
      {
        params: {
          'auth': resData.idToken
        }
      }
    ).pipe(
      catchError(this.handleErrorCreateUserOnKultur),
      tap(() => {
        // Creation user en local storage, emission du Subject et redirection vers accueil
        let expirationDate = new Date(new Date().getTime() + (+resData.expiresIn * 1000));
        let hoursDiff = expirationDate.getHours() - expirationDate.getTimezoneOffset() / 60;
        expirationDate.setHours(hoursDiff);
        const userSession = new UserSession(resData.email, resData.localId, resData.idToken, new Date(expirationDate));
        this.userSessionSubject.next(userSession);
        this.autologout(+resData.expiresIn * 1000);
        this.userKulturSubject.next(userK);
        localStorage.setItem("userSession", JSON.stringify(userSession));
        localStorage.setItem("userKultur", JSON.stringify(userK));
        this.router.navigate(['']);
      })
    );
  }

  private handleErrorCreateUserOnKultur(errorRes: HttpErrorResponse) {
    let errorMessage = "Une erreur est apparue pendant l'envoi de votre profil sur Kult(u)r";
    if (!errorRes.error || !errorRes.error.error || errorRes.error.error == 'Permission denied') {
      return throwError(errorMessage);
    }
  }

  private handleErrorDeleteFBAccount(errorRes: HttpErrorResponse) {
    let errorMessage = "Une erreur est apparue !";
    if (!errorRes.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.message) {
      case 'INVALID_ID_TOKEN':
        errorMessage = 'Suppression de compte Firebase impossible : Token invalide pour cet identifiant, cet utilisateur doit se reconnecter';
        break;
      case 'USER_NOT_FOUND':
        errorMessage = 'Suppression de compte Firebase impossible : Compte Firebase non trouvé pour cet identifiant';
        break;
    }
    return throwError(errorMessage);
  }

  // Signin Section
  /////////////////
  signIn(userEmail: string, userPassword: string) {
    return this.httpClient
    .post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
      {
        email: userEmail,
        password: userPassword,
        returnSecureToken: true
      }
    ).pipe(
      catchError(this.handleErrorSignIn),
      tap((resData: AuthResponseData) => {
        console.log("user Auth Firebase recupere ::", resData);
        this.getUserOnKultur(resData).subscribe(
          (resData: User) => {
            console.log("User recupere sur Kult(u)r ::", resData);
          },
          (errorRes: string) => {
            console.log("Un probleme est survenu lors de la recuperation du compte utilisateur sur Kult(u)r");
            this.toastrService.error(errorRes,'Problème');
          }
        );
      })
    );
  }

  private handleErrorSignIn(errorRes: HttpErrorResponse) {
    let errorMessage = "Une erreur est apparue !";
    console.log("Erreur ret by Firebase ::", errorRes);
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'Aucun compte Kult(u)r pour cet email';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Le mot de passe saisi est invalide';
        break;
      case 'USER_DISABLED':
        errorMessage = 'Ce compte utilisateur a été désactivé';
        break;
    }
    return throwError(errorMessage);
  }

  private getUserOnKultur(user: AuthResponseData) {
    return this.httpClient
    .get<User>(
      'https://mon-app-kultur.firebaseio.com/users.json?email=' + user.email
    ).pipe(
      catchError(this.handleErrorGetUserOnKultur),
      tap((userKFromFB: any) => {
        // Creation user de type User depuis un objet retourne par Firebase
        const snapshotToArray = Object.entries(userKFromFB).map(e => Object.assign(e[1], { key: e[0] }));
        const userK: User = new User(snapshotToArray[0]['email'],
          snapshotToArray[0]['pseudo'],
          snapshotToArray[0]['urlAvatar'],
          snapshotToArray[0]['desc'],
          snapshotToArray[0]['tabMovieReviews'],
          snapshotToArray[0]['tabBookReviews'],
          snapshotToArray[0]['tabGameReviews'],
          snapshotToArray[0]['tabAlbumReviews']);
        // Creation user en local storage, emission du Subject et redirection vers accueil
        let expirationDate = new Date(new Date().getTime() + (+user.expiresIn * 1000));
        let hoursDiff = expirationDate.getHours() - expirationDate.getTimezoneOffset() / 60;
        expirationDate.setHours(hoursDiff);
        const userSession = new UserSession(user.email, user.localId, user.idToken, new Date(expirationDate));
        this.userSessionSubject.next(userSession);
        this.userKulturSubject.next(userK);
        localStorage.setItem("userSession", JSON.stringify(userSession));
        this.autologout(+user.expiresIn * 1000);
        localStorage.setItem("userKultur", JSON.stringify(userK));
        this.router.navigate(['']);
      })
    );
  }

  private handleErrorGetUserOnKultur(errorRes: HttpErrorResponse) {
    let errorMessage = "Une erreur est apparue pendant la récupération de votre profil sur Kult(u)r";
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
  }

  // Login/Logout Section
  ///////////////////////
  logout() {
    this.userSessionSubject.next(null);
    localStorage.removeItem('userSession');
    this.userKulturSubject.next(null);
    localStorage.removeItem('userKultur');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
    if (localStorage.getItem('spotifyAccessToken')) {
      localStorage.removeItem('spotifyAccessToken');
    }
    if (localStorage.getItem('twitchAccessToken')) {
      localStorage.removeItem('twitchAccessToken');
    }
    this.router.navigate(['']);
  }

  autologin() {
    if (localStorage.getItem('userSession')) {
      const jsonObjUserSession: any = JSON.parse(localStorage.getItem('userSession'));
      const userSession: UserSession = new UserSession(jsonObjUserSession.email,
        jsonObjUserSession.localId,
        jsonObjUserSession.idToken,
        new Date(jsonObjUserSession.tokenExpirationDate));
      if(userSession.token && localStorage.getItem('userKultur')) {
        const jsonObjUserKultur: any = JSON.parse(localStorage.getItem('userKultur'));
        const userK: User = new User(jsonObjUserKultur.email,
          jsonObjUserKultur.pseudo,
          jsonObjUserKultur.urlAvatar,
          jsonObjUserKultur.desc,
          jsonObjUserKultur.tabMovieReviews,
          jsonObjUserKultur.tabBookReviews,
          jsonObjUserKultur.tabGameReviews,
          jsonObjUserKultur.tabAlbumReviews);
        this.userSessionSubject.next(userSession);
        this.userKulturSubject.next(userK);
        const expirationDuration = new Date(userSession.tokenExpirationDate).getTime() - new Date().getTime();
        this.autologout(expirationDuration);
      }
    }
  }

  autologout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

}
