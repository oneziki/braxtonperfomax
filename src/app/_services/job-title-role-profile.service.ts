import { Injectable, OnDestroy, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings, SessionUser, JobTitleRoleProfile } from '../_models/index';
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
export class JobTitleRoleProfileService implements OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();
  private AUTHSubscription: Subscription;

  _sessionUser: SessionUser;
  _selectedJobTitle = '';
  _roleProfile: JobTitleRoleProfile[] = [];
  _OrgDepartments = [];

  _assesseesChanged = new EventEmitter();
  _roleProfileDataChanged = new EventEmitter();
  _OrgDepartmentsChanged = new EventEmitter();

  constructor(private _mService: MessengerService,
    private _http: HttpClient,
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
    this._roleProfile = [];
    this._OrgDepartments = [];
  }

  getJobTitleRoleProfileByJobTitleUUID() {

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'setup',
      'subModule': 'corporateTools',
      'secondSubModule': 'corporateTools_JobTitleRole',
      'JobTitleUUID': this._selectedJobTitle,
      'P5Corp_userUID': this._authService._sessionUser.P5Corp_userUID,
      'sFunction': 'getJobTitleRoleProfileByJobTitleUUID'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._roleProfile = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getJobTitleRoleProfileByJobTitleUUID', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getJobTitleRoleProfileByJobTitleUUID'))
    );
  }

  getJobTileRoleProfileDepartments(P5Corp_userUID: string) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'setup',
      'subModule': 'corporateTools',
      'secondSubModule': 'corporateTools_JobTitleRole',
      'P5Corp_userUID': P5Corp_userUID,
      'sFunction': 'getJobTileRoleProfileDepartments'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._OrgDepartments = JSON.parse(JSON.stringify(result));
        this._OrgDepartmentsChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getJobTileRoleProfileDepartments', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getJobTileRoleProfileDepartments'))
    );
  }


  getAllRoleProfiles() {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'setup',
      'subModule': 'corporateTools',
      'secondSubModule': 'corporateTools_JobTitleRole',
      'JobTitleUUID': 'All',
      'P5Corp_userUID': this._authService._sessionUser.P5Corp_userUID,
      'sFunction': 'getJobTitleRoleProfileByJobTitleUUID'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._roleProfile = JSON.parse(JSON.stringify(result));
        this._roleProfileDataChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getJobTitleRoleProfileByJobTitleUUID', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getJobTitleRoleProfileByJobTitleUUID'))
    );
  }

  printRoleProfileReport(JobTitleUUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'setup',
      'subModule': 'corporateTools',
      'secondSubModule': 'corporateTools_JobTitleRole',
      'JobTitleUUID': JobTitleUUID,
      'P5Corp_userUID': this._authService._sessionUser.P5Corp_userUID,
      'sFunction': 'printRoleProfileReport'
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
      tap(_ => this._mService.handleTap(this.constructor.name, 'printRoleProfileReport', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'printRoleProfileReport'))
    );
  }


}
