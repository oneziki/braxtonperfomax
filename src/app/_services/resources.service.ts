/* eslint-disable space-before-function-paren */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-underscore-dangle */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {
  Resource,
  AppSettings,
  Notification,
  FeaturedResource,
  PersonalDocumentsCategories
} from '../_models/index';
import { AuthService } from '../_services/auth.service';
import { PostService } from './post.service';
import { MessengerService } from '../_services/messengerservice.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable()
export class ResourcesService implements OnDestroy {
  private AUTHSubscription: Subscription;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  _resources: Resource[] = [];
  _academies: Resource[] = [];
  _notifications: Notification[] = [];
  _featuredResources: FeaturedResource[] = [];
  _tipsAndTutorialsList: Resource[] = [];
  _resourceTypes = [];
  _currentResource: object;
  _employeePersonalDocuments: PersonalDocumentsCategories[] = [];
  _employeeDocumentsChanged = new EventEmitter();
  _dataChanged_resources = new EventEmitter();
  _dataChanged_notifications = new EventEmitter();
  _dataChanged_featuredResources = new EventEmitter();
  _dataChanged_resourceTypes = new EventEmitter();
  _dataChanged_subSection = new EventEmitter();
  _selected_resource: Resource;
  _sCompanyResourceDescription: string;

  constructor(private _mService: MessengerService,
    private _http: HttpClient,
    public _authService: AuthService,
    private _pService: PostService
  ) {}

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  setCurrentResource(res) {
    this._currentResource = res;
  }

  getResources() {
    const bodyString = JSON.stringify({
      peformaxToken: AppSettings.PEFORMAX_TOKEN,
      sModule: 'setup',
      subModule: 'resources',
      sFunction: 'getResources',
      organisationTiersUUID:
        this._authService._sessionUser.organisationTiersUUID,
      P6CompanyUID: this._authService._sessionUser.P6CompanyUID,
      bIsSetup: false,
    });
    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        if (result.hasOwnProperty('category')) {
          this._resources = JSON.parse(JSON.stringify(result.category));
          if (result && result['sCompanyResourceDescription']) {
            this._sCompanyResourceDescription = JSON.parse(JSON.stringify(result.sCompanyResourceDescription));
          }
          this._dataChanged_resources.emit();
        }
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getResources', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getResources'))
    );
  }

  getAcademies() {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'setup',
      'subModule': 'resources',
      'sFunction': 'getAcademies',
      'P6CompanyUID': this._authService._sessionUser.P6CompanyUID
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        if (result.hasOwnProperty('category')) {
          this._academies = JSON.parse(JSON.stringify(result.category));
          if (result && result['sCompanyResourceDescription']) {
            this._sCompanyResourceDescription = JSON.parse(JSON.stringify(result.sCompanyResourceDescription));
          }
          this._dataChanged_resources.emit();
        }
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getAcademies', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getAcademies'))
    );
  }

  getTipsAndTutorials() {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'setup',
      'subModule': 'resources',
      'sFunction': 'getTipsAndTutorials',
      'P6CompanyUID': this._authService._sessionUser.P6CompanyUID
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        if (result.hasOwnProperty('category')) {
          this._tipsAndTutorialsList = JSON.parse(JSON.stringify(result.category));
          if (result && result['sCompanyResourceDescription']) {
            this._sCompanyResourceDescription = JSON.parse(JSON.stringify(result.sCompanyResourceDescription));
          }
          this._dataChanged_resources.emit();
        }
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getTipsAndTutorials', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getTipsAndTutorials'))
    );
  }

  trackAcademyActivity(resUpload) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'setup',
      'subModule': 'resources',
      'sFunction': 'trackAcademyActivity',
      'P6CompanyUID': this._authService._sessionUser.P6CompanyUID,
      'P6_userUID': this._authService._sessionUser.P6_userUID,
      'resUpload': resUpload
    });
    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'trackAcademyActivity', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'trackAcademyActivity'))
    );
  }

  getNotifications(sFlag) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'setup',
      'subModule': 'resources',
      'sFunction': 'getNotifications',
      'sFlag': sFlag,
      'P6CompanyUID': this._authService._sessionUser.P6CompanyUID
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        if (result.hasOwnProperty('notifications')) {
          this._notifications = JSON.parse(JSON.stringify(result.notifications));
          this._dataChanged_notifications.emit();
        }
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getNotifications', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getNotifications'))
    );
  }

  getFeaturedResources() {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'setup',
      'subModule': 'resources',
      'sFunction': 'getFeaturedResources',
      'P6CompanyUID': this._authService._sessionUser.P6CompanyUID
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        if (result.hasOwnProperty('category')) {
          this._featuredResources = JSON.parse(JSON.stringify(result.category));
          this._dataChanged_featuredResources.emit();
        }
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getFeaturedResources', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getFeaturedResources'))
    );
  }

  async getUserPersonalDocuments() {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'setup',
      'subModule': 'corporateTools',
      'secondSubModule': 'corporateTools_employee',
      'sFunction': 'getUserPersonalDocsAndCategories',
      'employee_P6_userUID': this._authService._sessionUser.P6_userUID,
      'P6_userUID': this._authService._sessionUser.P6_userUID
    });

    const result = await this._pService.postData('getUserPersonalDocsAndCategories', bodyString, 'get');
    this._employeePersonalDocuments = JSON.parse(JSON.stringify(result));
    this._employeeDocumentsChanged.emit();

  }
}
