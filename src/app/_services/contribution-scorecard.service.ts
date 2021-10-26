import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { MessengerService } from './messengerservice.service';
import { AuthService } from '../_services/auth.service';
import { PostService } from './post.service';
import { AppSettings } from '../_models';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};


@Injectable()
export class ContributionScorecardService {

  _contributionScorecards = [];
  _departmentContributionScorecards = [];
  _companyContributionScorecards = [];
  _contributionScorecardData = {};
  _KRAView = 'personal';

  constructor(
    private _mService: MessengerService,
    private _http: HttpClient,
    public _authService: AuthService,
    public _pService: PostService) {
  }

  async getContributionScorecards(P5Corp_userUID: string) {

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'ContributionScorecard',
      'activeTab': this._KRAView,
      'P5Corp_userUID': P5Corp_userUID,
      'sFunction': 'getContributionScorecards'
    });

    this._contributionScorecards = await this._pService.postData('getContributionScorecards', bodyString, 'get');
    return this._contributionScorecards;
  }

  getDepartmentContributionScorecards(P5Corp_userUID: string) {

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'ContributionScorecard',
      'activeTab': this._KRAView,
      'P5Corp_userUID': P5Corp_userUID,
      'sFunction': 'getDepartmentContributionScorecards'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._departmentContributionScorecards = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getDepartmentContributionScorecards', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getDepartmentContributionScorecards'))
    );
  }


  getCompanyContributionScorecards(P5Corp_userUID: string) {

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'ContributionScorecard',
      'activeTab': this._KRAView,
      'P5Corp_userUID': P5Corp_userUID,
      'sFunction': 'getCompanyContributionScorecards'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._companyContributionScorecards = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getCompanyContributionScorecards', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getCompanyContributionScorecards'))
    );
  }

  getContributionScorecardData(P5Corp_userUID: string, dbMonthDate: string) {

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'ContributionScorecard',
      'activeTab': this._KRAView,
      'P5Corp_userUID': P5Corp_userUID,
      'dbMonthDate': dbMonthDate,
      'sFunction': 'getContributionScorecardData'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._contributionScorecardData = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getContributionScorecardData', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getContributionScorecardData'))
    );
  }

  getDepartmentContributionScorecardData(P5Corp_userUID: string, dbMonthDate: string) {

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'ContributionScorecard',
      'activeTab': this._KRAView,
      'P5Corp_userUID': P5Corp_userUID,
      'dbMonthDate': dbMonthDate,
      'sFunction': 'getDepartmentContributionScorecardData'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._contributionScorecardData = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getDepartmentContributionScorecardData', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getDepartmentContributionScorecardData'))
    );
  }

  getCompanyContributionScorecardData(P5Corp_userUID: string, dbMonthDate: string) {

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'ContributionScorecard',
      'activeTab': this._KRAView,
      'P5Corp_userUID': P5Corp_userUID,
      'dbMonthDate': dbMonthDate,
      'sFunction': 'getCompanyContributionScorecardData'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._contributionScorecardData = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getCompanyContributionScorecardData', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getCompanyContributionScorecardData'))
    );
  }

  printContributionScorecardPDFData(P5Corp_userUID: string, dbMonthDate: string) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'ContributionScorecard',
      'P5Corp_userUID': P5Corp_userUID,
      'dbMonthDate': dbMonthDate,
      'sFunction': 'printContributionScorecardPDFData',
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
      tap(_ => this._mService.handleTap(this.constructor.name, 'printContributionScorecardPDFData', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'printContributionScorecardPDFData'))
    );
  }

  printCompanyContributionScorecardPDFData(P5Corp_userUID: string, dbMonthDate: string, bDepartmentData: boolean) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'ContributionScorecard',
      'P5Corp_userUID': P5Corp_userUID,
      'dbMonthDate': dbMonthDate,
      'bDepartmentData': bDepartmentData,
      'sFunction': 'printCompanyContributionScorecardPDFData',
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
      tap(_ => this._mService.handleTap(this.constructor.name, 'printCompanyContributionScorecardPDFData', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'printCompanyContributionScorecardPDFData'))
    );
  }
}
