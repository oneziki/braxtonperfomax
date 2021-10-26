import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor (private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (sessionStorage.getItem('loginUser') && localStorage.getItem('sessionUser')) {
      // logged in so return true
      return true;
    }
    if (localStorage.getItem('rememberUser') && localStorage.getItem('sessionUser')) {
      // logged in so return true
      return true;
    }
    let bCookie = false;
    if (localStorage.getItem('cookieFooter')) {
      bCookie = true;
    }
    // let bChatCookie = false;
    // if (localStorage.getItem('showCookieChat')) {
    //   bChatCookie = true;
    // }
    localStorage.clear();
    if (bCookie) {
      localStorage.setItem('cookieFooter', JSON.stringify(true));
    }
    // if (bChatCookie) {
    //   localStorage.setItem('showCookieChat', JSON.stringify(true));
    // }
    // not logged in so redirect to login page with the return url
    this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
    return false;
  }

}
