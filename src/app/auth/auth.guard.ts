import { Injectable } from "@angular/core";
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
    return this.authService.userSessionSubject
    .pipe(
      take(1),
      map(userSession => {
        const isAuth = !!userSession;
        if (isAuth) {
            // Si on a un user la route est accessible
            return true;
        }
        // Sinon on redirige vers la page d'authentification
        return this.router.createUrlTree(['/auth']);
      })
    );
  }
}
