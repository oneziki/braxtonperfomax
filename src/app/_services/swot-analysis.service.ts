import { Injectable, OnDestroy, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  SWOTAnalysis,
  SWOTAnalysisScales,
  AppSettings,
  SessionUser,
  SWOTAnalysisManual
} from '../_models/index';
import { AuthService } from './auth.service';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessengerService } from './messengerservice.service';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class SWOTAnalysisService implements OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();
  private AUTHSubscription: Subscription;

  _sessionUser: SessionUser;
  _P5Corp_userUID = '';
  _swotAnalysisScales: SWOTAnalysisScales[] = [];
  _personalSWOTAnalysis: SWOTAnalysis;
  _SWOTAnalysisManual: SWOTAnalysisManual;
  _SWOTAnalysisPDFReportData: {};
  _SWOTYears = [];
  _SWOTMonths = [];
  public _isLoading = false;

  _personalSWOTAnalysisChanged = new EventEmitter();
  _SWOTProfileChanged = new EventEmitter();
  _swotAnalysisScalesChanged = new EventEmitter();
  _SWOTAnalysisChanged = new EventEmitter();
  _SWOTMonthsChanged = new EventEmitter();
  _SWOTYearsChanged = new EventEmitter();
  _SWOTAnalysisPDFReportDataChanged = new EventEmitter();

  constructor(private _mService: MessengerService,
    private _http: HttpClient,
    private _router: Router,
    public _authService: AuthService) {

    this._sessionUser = this._authService._sessionUser;
    this.AUTHSubscription = this._authService._userSessionChanged.subscribe(value => this.updateSessionUser());
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.AUTHSubscription.unsubscribe();
  }

  updateSessionUser() {
    this._sessionUser = this._authService._sessionUser;
  }


  // year and month filter
  getSWOTAnalyisYears() {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'SWOTAnalysis',
      'P5Corp_userUID': this._sessionUser.P5Corp_userUID,
      'sFunction': 'getSWOTAnalyisYears'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._SWOTYears = JSON.parse(JSON.stringify(result));
        this._SWOTYearsChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getSWOTAnalyisYears', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getSWOTAnalyisYears'))
    );
  }

  getSWOTAnalysisMonths(sYear: string) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'SWOTAnalysis',
      'P5Corp_userUID': this._sessionUser.P5Corp_userUID,
      'iYear': sYear,
      'sFunction': 'getSWOTAnalysisMonths'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._SWOTMonths = JSON.parse(JSON.stringify(result));
        this._SWOTMonthsChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getSWOTAnalysisMonths', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getSWOTAnalysisMonths'))
    );
  }

  getSWOTAnalysisScales() {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'SWOTAnalysis',
      'P5ClientUID': this._sessionUser.P5ClientUID,
      'sFunction': 'getSWOTAnalysisScales'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._swotAnalysisScales = JSON.parse(JSON.stringify(result));
        this._swotAnalysisScalesChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getSWOTAnalysisScales', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getSWOTAnalysisScales'))
    );
  }

  getPersonalSWOTAnalysis(compAssessmentAssessorsUID, compAssessmentUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'SWOTAnalysis',
      'compAssessmentAssessorsUID': compAssessmentAssessorsUID,
      'compAssessmentUID': compAssessmentUID,
      'P5Corp_userUID': this._authService._sessionUser.P5Corp_userUID,
      'sFunction': 'getSWOTAnalysis'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._personalSWOTAnalysis = JSON.parse(JSON.stringify(result));
        this._personalSWOTAnalysisChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getPersonalSWOTAnalysis', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getPersonalSWOTAnalysis'))
    );
  }

  getPersonalSWOTAnalysisManual(iYear, iMonth) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'SWOTAnalysis',
      'iYear': iYear,
      'iMonth': iMonth,
      'P5Corp_userUID': this._authService._sessionUser.P5Corp_userUID,
      'sFunction': 'getPersonalSWOTAnalysisManual'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._SWOTAnalysisManual = JSON.parse(JSON.stringify(result));
        this._personalSWOTAnalysisChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getPersonalSWOTAnalysisManual', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getPersonalSWOTAnalysisManual'))
    );
  }

  getSWOTAnalysisPDFReportData(task) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'SWOTAnalysis',
      'task': task,
      'P5Corp_userUID': this._authService._sessionUser.P5Corp_userUID,
      'sFunction': 'getSWOTAnalysisPDFReportData'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._SWOTAnalysisPDFReportData = JSON.parse(JSON.stringify(result));
        this._SWOTAnalysisPDFReportDataChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getSWOTAnalysisPDFReportData', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getSWOTAnalysisPDFReportData'))
    );
  }

  savePersonalSWOTAnalysis(removedSWOTAnalysisItems, compAssessmentAssessorsUID, compAssessmentUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'SWOTAnalysis',
      'compAssessmentAssessorsUID': compAssessmentAssessorsUID,
      'compAssessmentUID': compAssessmentUID,
      'P5Corp_userUID': this._authService._sessionUser.P5Corp_userUID,
      'personalSWOTAnalysis': this._personalSWOTAnalysis,
      'removedSWOTAnalysisItems': removedSWOTAnalysisItems,
      'sFunction': 'savePersonalSWOTAnalysis',
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._personalSWOTAnalysis = JSON.parse(JSON.stringify(result));
        this._SWOTProfileChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'savePersonalSWOTAnalysis', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'savePersonalSWOTAnalysis'))
    );
  }

  saveSWOTAnalysisManual(removedSWOTAnalysisItems, iYear, iMonth) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'SWOTAnalysis',
      'iYear': iYear,
      'iMonth': iMonth,
      'P5Corp_userUID': this._authService._sessionUser.P5Corp_userUID,
      'SWOTAnalysisManual': this._SWOTAnalysisManual,
      'removedSWOTAnalysisItems': removedSWOTAnalysisItems,
      'sFunction': 'saveSWOTAnalysisManual',
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'saveSWOTAnalysisManual', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'saveSWOTAnalysisManual'))
    );
  }

  printSWOTAnalysisReport(sEmployeeFullName: string, EmployeeUID: string, iMonth, iYear, SWOTAnalysisManualObjectivesUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'SWOTAnalysis',
      'clientUID': this._authService._sessionUser.P5ClientUID,
      'sEmployeeFullName': sEmployeeFullName,
      'P5Corp_userUID': EmployeeUID,
      'iMonth': iMonth,
      'iYear': iYear,
      'SWOTAnalysisManualObjectivesUID': SWOTAnalysisManualObjectivesUID,
      'sFunction': 'printSWOTAnalysisReport'
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
      tap(_ => this._mService.handleTap(this.constructor.name, 'printSWOTAnalysisReport', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'printSWOTAnalysisReport'))
    );
  }

}

