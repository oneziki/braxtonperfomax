import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { AppSettings, SessionUser, UserData } from '../_models/index';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessengerService } from './messengerservice.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class PersonalPortfolioService implements OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private AUTHSubscription: Subscription;

  _sessionUser: SessionUser;
  _userData = [];


  constructor(private _mService: MessengerService,
    private _http: HttpClient,
    private _router: Router,
    public _authService: AuthService) {
    this._sessionUser = this._authService._sessionUser;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.AUTHSubscription.unsubscribe();
  }

  updateSessionUser(value) {
    this._sessionUser = this._authService._sessionUser;
  }

  getPortfolioData(P5Corp_userUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'PersonalPortfolio',
      'sFunction': 'getPortfolioData',
      'P5Corp_userUID': P5Corp_userUID
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._userData = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getPortfolioData', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getPortfolioData'))
    );
  }

  printPersonalPortfolio(P5Corp_userUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'PersonalPortfolio',
      'sFunction': 'printPersonalPortfolio',
      'P5Corp_userUID': P5Corp_userUID
    });

    const downloadWindow = window.open('about:blank');
    var doc = downloadWindow.document;
    doc.open("text/html");
    doc.write("<br><br><br><br><center><h2 style='color: #8d9098;'>Please wait while your PDF is downloading...</h2></center>");

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        const sURL = JSON.parse(JSON.stringify(result));
        downloadWindow.location.href = sURL;
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'printPersonalPortfolio', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'printPersonalPortfolio'))
    );
  }


  savePortfolioImages(P5Corp_userUID, sFullName, images) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'PersonalPortfolio',
      'P5Corp_userUID': P5Corp_userUID,
      'images': images,
      'sFullName': sFullName,
      'sFunction': 'savePortfolioImages'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        // do nothing
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'savePortfolioImages', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'savePortfolioImages'))
    );

  }



}
