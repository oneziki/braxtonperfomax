import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../_services/auth.service';
import { AppSettings, SessionUser, KraItemSettings, Task, IntergratedPDP } from '../_models/index';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';

import { catchError, map, tap } from 'rxjs/operators';
import { MessengerService } from '../_services/messengerservice.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class KraPdpService implements OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private AUTHSubscription: Subscription;

  _sessionUser: SessionUser;
  _statusItem: object;
  _KRAView: string; // PORTAL TAB: PERSONAL / DEPARTMENT
  _currentPDP: {};
  _bActivitySummary = false;
  _kraPDPProfileData = [];
  _kraPDPUserPersonalDetails = [];
  _pdpYears = [];
  _kraPDPTasks: Task;
  _contractedPdpPDFData = [];
  _intergratedPDPProfileData: IntergratedPDP;
  _integratedPdpPDFData = [];
  _kraURPRoleData: KraItemSettings;
  taskStatusOptions: object = {};
  _pdpDataChanged = new EventEmitter();
  _kraGetRoleChanged = new EventEmitter();
  _pdpViewChange = new EventEmitter();
  _pdpUserPersonalDetailsChanged = new EventEmitter();
  _intergratedPdpDataChanged = new EventEmitter();
  _intergratedPdpViewChanged = new EventEmitter();
  _contractedPdpPDFDataChanged = new EventEmitter();
  _integratedPdpPDFDataChanged = new EventEmitter();
  _sYear = '';

  constructor(private _mService: MessengerService,
    private _http: HttpClient,
    public _authService: AuthService) {

    this.AUTHSubscription = this._authService._userSessionChanged.subscribe(value => this.updateSessionUser());
    this._sessionUser = this._authService._sessionUser;
    this._KRAView = this._authService._KRAView;

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.AUTHSubscription.unsubscribe();
  }

  updateSessionUser() {
    this._sessionUser = this._authService._sessionUser;
  }

  // PDP Years
  getPDPYears() {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraPDP',
      'activeTab': this._authService._KRAView,
      'P5Corp_userUID': this._sessionUser.P5Corp_userUID,
      'bIsManager': this._sessionUser.bIsManager,
      'sFunction': 'getPDPYears'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._pdpYears = JSON.parse(JSON.stringify(result));
        this._pdpDataChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getPDPYears', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getPDPYears'))
    );
  }

  getPDPTasks(sYear: string) {

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraPDP',
      'activeTab': this._authService._KRAView,
      'P5Corp_userUID': this._sessionUser.P5Corp_userUID,
      'bIsManager': this._sessionUser.bIsManager,
      'sYear': sYear,
      'companyTemplate': this._sessionUser.companytemplate,
      'sFunction': 'getPDPTasks'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._kraPDPTasks = JSON.parse(JSON.stringify(result));
        this._pdpDataChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getPDPTasks', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getPDPTasks'))
    );
  }

  getUserPDPProfile(sYear: string, bIsManager: boolean, P5Corp_userUID) {

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraPDP',
      'bIsManager': bIsManager,
      'clientUID': this._sessionUser.P5ClientUID,
      'P5Corp_userUID': P5Corp_userUID,
      'sYear': sYear,
      'sFunction': 'getUserPDPProfile'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._kraPDPProfileData = JSON.parse(JSON.stringify(result));
        this._pdpDataChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getUserPDPProfile', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getUserPDPProfile'))
    );
  }

  // save as Draft/Submit to manager
  savePDPContract(pageData: Array<object>, bManager: boolean, userUUID) {

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraPDP',
      'bIsManager': bManager,
      'P5Corp_userUID': this._sessionUser.P5Corp_userUID,
      'userUUID': userUUID,
      'pageData': pageData,
      'sFunction': 'savePDPContract'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._pdpViewChange.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'savePDPContract', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'savePDPContract'))
    );

  }

  getStatusList() {
    return ['draft', 'upcoming', 'current', 'arrears', 'completed', 'optional'];
  }

  getStatusOption() {
    this.taskStatusOptions = this._authService.getNotificationStatusData();
    // DEFAULT ORDERING
    // [{ id: 1, sStatusName: 'ALL', sColor: '' }];
    // { id: 1, sStatusName: 'Draft' },
    // { id: 2, sStatusName: 'Coming Up' },
    // { id: 3, sStatusName: 'To Complete' },
    // { id: 4, sStatusName: 'Overdue' },
    // { id: 5, sStatusName: 'Completed' }];

    // const taskStatusOptions = {
    //   'ALL': '',
    //   'Draft': 'bContinue',
    //   'Coming Up': 'bComingUp',
    //   'To Complete': 'bComplete',
    //   'Overdue': 'bComplete',
    //   'Completed': 'bView',
    //   'Optional': ''
    // };

    if (!this._currentPDP) {
      return false;
    }

    if (this._currentPDP && !this._currentPDP['sStatusOption']) {
      this._currentPDP['sStatusOption'] = this.taskStatusOptions[this._currentPDP['status']];
      return this._currentPDP['sStatusOption'];
    }

    if (this._currentPDP && this._currentPDP['sStatusOption']) {
      return this._currentPDP['sStatusOption'];
    }

  }

  // combined pdp functions
  getUserCombinedPDPProfile(kraHrURPRoleUID: string, bIsManager: boolean) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraPDP',
      'bIsManager': bIsManager,
      'kraHrURPRoleUID': kraHrURPRoleUID,
      'clientUID': this._sessionUser.P5ClientUID,
      'sFunction': 'getUserCombinedPDPProfile'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._kraPDPProfileData = JSON.parse(JSON.stringify(result));
        this._pdpDataChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getUserCombinedPDPProfile', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getUserCombinedPDPProfile'))
    );
  }

  // Intergrated PDP Functions
  getIntergratedPDPSection1Data(P5Corp_userUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraPDP',
      'P5Corp_userUID': P5Corp_userUID,
      'sFunction': 'getIntergratedPDPSection1Data'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._kraPDPUserPersonalDetails = JSON.parse(JSON.stringify(result));
        this._pdpUserPersonalDetailsChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getIntergratedPDPSection1Data', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getIntergratedPDPSection1Data'))
    );
  }

  getIntergratedPDPUserProfile(CompAssessmentUID: string, P5Corp_userUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraPDP',
      'CompAssessmentUID': CompAssessmentUID,
      'P5Corp_userUID': P5Corp_userUID,
      'sFunction': 'getIntergratedPDPUserProfile'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._intergratedPDPProfileData = JSON.parse(JSON.stringify(result));
        this._intergratedPdpDataChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getIntergratedPDPUserProfile', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getIntergratedPDPUserProfile'))
    );
  }

  saveIntergratedPDP(bDraft, CompAssessmentUID: string, bManager: boolean) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraPDP',
      'CompAssessmentUID': CompAssessmentUID,
      'bDraft': bDraft,
      'bIsManager': bManager,
      'P5Corp_userUID': this._sessionUser.P5Corp_userUID,
      'pdpObject': this._intergratedPDPProfileData,
      'sFunction': 'saveIntergratedPDP'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._intergratedPDPProfileData = JSON.parse(JSON.stringify(result));
        this._intergratedPdpViewChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'saveIntergratedPDP', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'saveIntergratedPDP'))
    );
  }

  getContractedPdpPdfData(kraHrURPRoleUID: string) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraPDP',
      'kraHrURPRoleUID': kraHrURPRoleUID,
      'P5Corp_userUID': this._sessionUser.P5Corp_userUID,
      'sFunction': 'getContractedPdpPdfData'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._contractedPdpPDFData = JSON.parse(JSON.stringify(result));
        this._contractedPdpPDFDataChanged.emit();
      }),

      tap(_ => this._mService.handleTap(this.constructor.name, 'getContractedPdpPdfData', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getContractedPdpPdfData'))
    );
  }

  getIntegratedPdpPdfReportData(CompAssessmentUID: string, P5Corp_userUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraPDP',
      'CompAssessmentUID': CompAssessmentUID,
      'P5Corp_userUID': P5Corp_userUID,
      'sFunction': 'getIntegratedPdpPdfReportData'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._integratedPdpPDFData = JSON.parse(JSON.stringify(result));
      }),

      tap(_ => this._mService.handleTap(this.constructor.name, 'getIntegratedPdpPdfReportData', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getIntegratedPdpPdfReportData'))
    );
  }

  printIntegratedPDPReport(CompAssessmentUID: string, P5Corp_userUID, sEmployeeFullName) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraPDP',
      'P5Corp_userUID': P5Corp_userUID,
      'CompAssessmentUID': CompAssessmentUID,
      'sEmployeeFullName': sEmployeeFullName,
      'sFunction': 'printIntegratedPDPReport',
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
      tap(_ => this._mService.handleTap(this.constructor.name, 'printIntegratedPDPReport', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'printIntegratedPDPReport'))
    );
  }

  printManualPDPReport(kraHrURPRoleUID: string, P5Corp_userUID, sEmployeeFullName) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraPDP',
      'P5Corp_userUID': P5Corp_userUID,
      'kraHrURPRoleUID': kraHrURPRoleUID,
      'sEmployeeFullName': sEmployeeFullName,
      'sFunction': 'printManualPDPReport',
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
      tap(_ => this._mService.handleTap(this.constructor.name, 'printManualPDPReport', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'printManualPDPReport'))
    );
  }
}
