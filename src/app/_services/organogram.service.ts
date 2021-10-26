import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { AppSettings, SessionUser } from '../_models/index';
import { AuthService } from './auth.service';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';
import { MessengerService } from './messengerservice.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};


@Injectable()
export class OrganogramService implements OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private AUTHSubscription: Subscription;

  _sessionUser: SessionUser;
  _reportingStructure: any[] = [];
  _filterDates = [];
  _userDetailsChanged = new EventEmitter();
  _reportingStructureChanged = new EventEmitter();
  _dateFilterChanged = new EventEmitter();

  constructor(private _mService: MessengerService,
    private _http: HttpClient,
    public _authService: AuthService) {
    this.AUTHSubscription = this._authService._userSessionChanged.subscribe(value => this.updateSessionUser(value));
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

  getBusinessUnitStructure(P6_userUID: string, P5Corp_userUID: string, filterDate) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'P5Corp_userUID': P5Corp_userUID,
      'P6_userUID': P6_userUID,
      'sModule': 'organogram',
      'sFunction': 'getBusinessUnitStructure',
      'filterDate': filterDate
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._reportingStructure = JSON.parse(JSON.stringify(result));
        this._reportingStructureChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getBusinessUnitStructure', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getBusinessUnitStructure'))
    );
  }

  getReportingLineStructure(P6_userUID: string, P5Corp_userUID: string, filterDate) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'P5Corp_userUID': P5Corp_userUID,
      'P6_userUID': P6_userUID,
      'sModule': 'organogram',
      'sFunction': 'getReportingLineStructure',
      'filterDate': filterDate
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._reportingStructure = JSON.parse(JSON.stringify(result));
        this._reportingStructureChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getReportingLineStructure', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getReportingLineStructure'))
    );
  }

  getFilterDate(P6_userUID: string, P5Corp_userUID: string) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'P5Corp_userUID': P5Corp_userUID,
      'P6_userUID': P6_userUID,
      'sModule': 'organogram',
      'sFunction': 'getFilterDate'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._filterDates = JSON.parse(JSON.stringify(result));
        this._dateFilterChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getBusinessUnitStructure', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getBusinessUnitStructure'))
    );
  }

  printOrganogramExcelReport(P6_userUID: string, P5Corp_userUID: string) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'P5Corp_userUID': P5Corp_userUID,
      'P6_userUID': P6_userUID,
      'sModule': 'organogram',
      'sFunction': 'getOrganogramExcelReport',

    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        const sURL = JSON.parse(JSON.stringify(result));
        window.location.assign(sURL);

      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getOrganogramExcelReport', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getOrganogramExcelReport'))
    );
  }
}
