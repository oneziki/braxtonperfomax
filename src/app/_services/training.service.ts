import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AppSettings, SessionUser, Task, UserData } from '../_models/index';
import { AuthService } from './auth.service';
import { MessengerService } from './messengerservice.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class TrainingService implements OnDestroy {

  _sessionUser: SessionUser;
  _userData: UserData = new UserData();
  _trainingNeedTasks: Task;
  _sRoleToEmployee: string;
  _currentTask: {};
  taskStatusOptions: object = {};
  _userTrainingProfile: object = {};
  _result = false;
  _userTask = [];
  _userTrainingProfileManager = [];
  _bViewUsers = false;
  _trainersUID = '';


  _userTrainingList = [];
  _trainersFilterData = {};

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private AUTHSubscription: Subscription;

  constructor (private _mService: MessengerService,
    private _http: HttpClient,
    private _router: Router,
    private _authService: AuthService) {
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


  getUserTrainingProfile(P5Corp_userUID) {
    const bodyString = JSON.stringify({
      peformaxToken: AppSettings.PEFORMAX_TOKEN,
      sModule: 'TrainingNeeds',
      P5Corp_userUID,
      sFunction: 'getUserTrainingProfile'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._userTrainingProfile = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getUserTrainingProfile', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getUserTrainingProfile'))
    );
  }



  submitTrainingNeeds(trainingNeeds, sRoleToEmployee, EmployeeID) {
    const bodyString = JSON.stringify({
      peformaxToken: AppSettings.PEFORMAX_TOKEN,
      sModule: 'TrainingNeeds',
      P5Corp_userUID: this._sessionUser.P5Corp_userUID,
      trainingNeedsData: trainingNeeds,
      sRoleToEmployee,
      EmployeeID,
      sFunction: 'submitTrainingNeeds'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._result = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'submitTrainingNeeds', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'submitTrainingNeeds'))
    );
  }

  getUserTrainingProfileManager(P5Corp_userUID) {
    const bodyString = JSON.stringify({
      peformaxToken: AppSettings.PEFORMAX_TOKEN,
      sModule: 'TrainingNeeds',
      P5Corp_userUID,
      sFunction: 'getUserTrainingProfileManager'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._userTrainingProfileManager = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getUserTrainingProfileManager', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getUserTrainingProfileManager'))
    );
  }

  getTrainingUsers(trainersUID, bIsExternalUser) {
    const bodyString = JSON.stringify({
      peformaxToken: AppSettings.PEFORMAX_TOKEN,
      sModule: 'TrainingNeeds',
      trainersUID,
      bIsExternalUser,
      sFunction: 'getTrainingUsers'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._userTrainingList = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getTrainingUsers', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getTrainingUsers'))
    );
  }

  getUserFilterData(trainersUID, bIsExternalUser) {
    const bodyString = JSON.stringify({
      peformaxToken: AppSettings.PEFORMAX_TOKEN,
      sModule: 'TrainingNeeds',
      trainersUID,
      bIsExternalUser,
      sFunction: 'getUserFilterData'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._trainersFilterData = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getUserFilterData', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getUserFilterData'))
    );
  }

  saveCandidateTrainingNeedsData(userData) {
    const bodyString = JSON.stringify({
      peformaxToken: AppSettings.PEFORMAX_TOKEN,
      sModule: 'TrainingNeeds',
      userData,
      sFunction: 'saveCandidateTrainingNeedsData'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'saveCandidateTrainingNeedsData', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'saveCandidateTrainingNeedsData'))
    );
  }
}
