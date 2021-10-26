import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { AppSettings, SessionUser } from '../_models/index';
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
export class ChooseQuestionnaireService implements OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private AUTHSubscription: Subscription;

  _sessionUser: SessionUser;
  _userQuestionnaire = {};
  _questionnaireSettings = {};
  _roleProfiles = [];
  _mobilities = [];
  _reportData: Object = {};
  _userChooseQuestionnaireUID = '';
  _departments = [];

  _roleProfilesDataChanged = new EventEmitter();
  _questionnaireDataChanged = new EventEmitter();
  _questionnaireUserDataChanged = new EventEmitter();
  _reportChanged = new EventEmitter();
  _userQuestionnaireDataChanged = new EventEmitter();

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

  getQuestionnaireForUser() {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'ChooseQuestionnaire',
      'sFunction': 'getQuestionnaireForUser',
      'P5Corp_userUID': this._authService._sessionUser.P5Corp_userUID
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._userQuestionnaire = JSON.parse(JSON.stringify(result));
        this._questionnaireUserDataChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getQuestionnaireForUser', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getQuestionnaireForUser'))
    );
  }

  getQuestionnaireSettings() {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'ChooseQuestionnaire',
      'sFunction': 'getQuestionnaireSettings',
      'P5Corp_userUID': this._authService._sessionUser.P5Corp_userUID
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._questionnaireSettings = JSON.parse(JSON.stringify(result));
        this._questionnaireDataChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getQuestionnaireSettings', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getQuestionnaireSettings'))
    );
  }

  getChooseQuestionnaireReportData(UserChooseQuestionnaireUID, bReport: boolean) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'ChooseQuestionnaire',
      'sFunction': 'getChooseQuestionnaireReportData',
      'P5Corp_userUID': this._authService._sessionUser.P5Corp_userUID,
      'bReport': bReport,
      'UserChooseQuestionnaireUID': UserChooseQuestionnaireUID
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._reportData = JSON.parse(JSON.stringify(result));
        this._reportChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getChooseQuestionnaireReportData', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getChooseQuestionnaireReportData'))
    );
  }

  printChooseQuestionnaireReport(UserChooseQuestionnaireUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'ChooseQuestionnaire',
      'sFunction': 'printChooseQuestionnaireReport',
      'P5Corp_userUID': this._authService._sessionUser.P5Corp_userUID,
      'sFullName': this._authService._sessionUser.sFullName,
      'UserChooseQuestionnaireUID': UserChooseQuestionnaireUID
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
      tap(_ => this._mService.handleTap(this.constructor.name, 'printChooseQuestionnaireReport', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'printChooseQuestionnaireReport'))
    );
  }

  saveUserQuestionnaire(questionnaire) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'ChooseQuestionnaire',
      'sFunction': 'saveUserQuestionnaire',
      'P5Corp_userUID': this._authService._sessionUser.P5Corp_userUID,
      'questionnaire': questionnaire
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._userChooseQuestionnaireUID = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'saveUserQuestionnaire', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'saveUserQuestionnaire'))
    );
  }

  updateChooseNotifications(P5Corp_userUID, UserChooseQuestionnaireUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'UserChooseQuestionnaireUID': UserChooseQuestionnaireUID,
      'P5Corp_userUID': P5Corp_userUID,
      'sModule': 'ChooseQuestionnaire',
      'sFunction': 'updateChooseNotifications'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'updateChooseNotifications', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'updateChooseNotifications'))
    );
  }


}
