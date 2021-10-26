import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AppSettings, SessionUser, KraCompanySettings, KraItemSettings, Task, CareerObjectivesSettings, DiscussionNotes } from '../_models/index';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';

import { catchError, map, tap } from 'rxjs/operators';
import { MessengerService } from './messengerservice.service';
import { PostService } from './post.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class KraService implements OnDestroy {

  _sessionUser: SessionUser;
  today: Date = new Date();
  localhours: number = this.today.getHours();
  utchours: number = this.today.getUTCHours();
  _currentTask: {};

  _performanceAgreementProfile = {
    kraData: [],
    objectivesData: [],
    pdpData: [],
    careerPlanData: {},
    kraURPData: {},
    employeeDetails: {}
  };

  _performanceReviewProfile = {
    keyResultAreas: {},
    kraURPData: {},
    performanceDiscussion: {},
    // moderation data
    sScoreModeratedReason: '',
    moderateKra: {}
  };

  sYear: number;
  _P5Corp_userUID: string;
  _sRoleToEmployee: string;
  _currentTaskStatus: string;
  _bEdit = false;
  _kraPerformanceAgreementData: KraItemSettings;
  _kraPerformanceReviewData: KraItemSettings;
  _kraPerformanceDraftData: KraItemSettings;
  _agreementFiltersData: KraItemSettings;
  _employeeDetails: KraItemSettings;
  _kraURPRoleData: KraItemSettings;
  _kraCompanySettings: KraCompanySettings;
  _kraContractYears: KraItemSettings[] = [];
  _kraScoringYears: KraItemSettings[] = [];
  _kraScoringMonths: KraItemSettings[] = [];
  _kraAgreementTasks: Task;
  _taskYears = [];
  _taskMonths = [];
  _kraScoringTasks: Task;
  _totalKraAgreementTasks: 0;
  _careerObjectivesSettings: CareerObjectivesSettings = new CareerObjectivesSettings();
  taskStatusOptions: object = {};
  _agreementPDFProfileData: object = {};
  _clientUID = '';
  _discussionNotes = [new DiscussionNotes()];
  _directReportEmployees = [];
  _discussionScaleItems = [];
  _discussionAccuracyScaleItems = [];

  _p7kraRoleProfileData: object = {};

  _reviewMonth: Number;
  _reviewYear: String;
  _employeeUID: String;
  _kraOverallSummary = [];
  _kraOverallResult = [];

  _KRAReviewPDFData: {};
  _bShowModerationMode = false;
  _assessor_kraHrURPRoleUID: String;

  _kraViewChange = new EventEmitter();
  _kraURPRoleChanged = new EventEmitter();
  _kraGetTaskChanged = new EventEmitter();
  _agreementFilterDataChanged = new EventEmitter();
  _kraCompanySettingsDataChanged = new EventEmitter();
  _employeeDetailsChanged = new EventEmitter();

  _agreementDesignChanged = new EventEmitter();
  _agreementMonthsDataChanged = new EventEmitter();
  _agreementDataChanged = new EventEmitter();
  _agreementPDFProfileDataChanged = new EventEmitter();
  _scoringDataChanged = new EventEmitter();
  _careerObjectivesSettingsDataChanged = new EventEmitter();
  _monthFilterDataChanged = new EventEmitter();

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private AUTHSubscription: Subscription;

  constructor(private _mService: MessengerService,
    private _http: HttpClient,
    public _authService: AuthService,
    private _pService: PostService) {
    this.AUTHSubscription = this._authService._userSessionChanged.subscribe(value => this.updateSessionUser());
    this._sessionUser = this._authService._sessionUser;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  updateSessionUser() {
    this._sessionUser = this._authService._sessionUser;
    this._clientUID = this._sessionUser.P5ClientUID;
  }

  getKraCompanySettings() {
    const bodyString = JSON.stringify({
      peformaxToken: AppSettings.PEFORMAX_TOKEN,
      sModule: 'kra',
      subModule: '',
      P5Corp_userUID: this._authService._sessionUser.P5Corp_userUID,
      sFunction: 'getKraCompanySettings'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._kraCompanySettings = JSON.parse(JSON.stringify(result));
        this._kraCompanySettings['decimalFormat'] = '1.' +
          this._kraCompanySettings['iReportDecimals'] +
          '-' + this._kraCompanySettings['iReportDecimals'];
        this._kraCompanySettingsDataChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getKraCompanySettings', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getKraCompanySettings'))
    );
  }

  getKraRoleData() {
    const bodyString = JSON.stringify({
      peformaxToken: AppSettings.PEFORMAX_TOKEN,
      sModule: 'kra',
      subModule: 'kraContracting',
      roleUUID: this._currentTask['kraHrURPRoleUID'],
      utcHours: this.localhours - this.utchours,
      sFunction: 'getKraRoleData'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._kraURPRoleData = JSON.parse(JSON.stringify(result));
        this._kraURPRoleChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getKraRoleData', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getKraRoleData'))
    );
  }

  getKraPerformanceAgreement() {
    const bodyString = JSON.stringify({
      peformaxToken: AppSettings.PEFORMAX_TOKEN,
      sModule: 'kra',
      subModule: 'kraContracting',
      clientUID: this._clientUID,
      roleUUID: this._currentTask['kraHrURPRoleUID'],
      bShowObjectivesBeforeKRA: true,
      sFunction: 'getKraPerformanceAgreement'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._kraPerformanceAgreementData = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getKraPerformanceAgreement', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getKraPerformanceAgreement'))
    );
  }

  getTaskFiltersData(task?: object) {
    let employeeUID: string;

    if (task) {
      employeeUID = task['EmployeeUID'];
    } else if (this._currentTask) {
      employeeUID = this._currentTask['EmployeeUID'];
    }

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraContracting',
      'clientUID': this._clientUID,
      'employeeUID': employeeUID === undefined ? '' : employeeUID,
      'organisationTiersUUID': this._authService._sessionUser['organisationTiersUUID'],
      'sFunction': 'getAgreementFiltersData'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._agreementFiltersData = JSON.parse(JSON.stringify(result));
        this._agreementFilterDataChanged.emit();
        // if sRoleToEmployee is an empty string that means the user is not a manager or a second manager
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getTaskFiltersData', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getTaskFiltersData'))
    );
  }

  async getEmployeeDetails(employeeUID?: string): Promise<any> {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraContracting',
      'P5Corp_userUID': employeeUID,
      'sFunction': 'getEmployeeDetails'
    });

    this._employeeDetails = await this._pService.postData('getEmployeeDetails', bodyString, 'get');
    return this._employeeDetails[0];
  }

  getDirectReportEmployees(P5Corp_userUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraManualDiscussion',
      'P5Corp_userUID': P5Corp_userUID,
      'sFunction': 'getDirectReportEmployees'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._directReportEmployees = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getDirectReportEmployees', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getDirectReportEmployees'))
    );
  }

  getKraHRUrpRoleDiscussionNotes(kraHrURPRoleUID: String, iYear: number, iMonth: number) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraScoringGateway',
      'kraHrURPRoleUID': kraHrURPRoleUID,
      'iYear': iYear,
      'iMonth': iMonth,
      'sFunction': 'getKraHRUrpRoleDiscussionNotes'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._discussionNotes = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getKraHRUrpRoleDiscussionNotes', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getKraHRUrpRoleDiscussionNotes'))
    );
  }

  getOrganisationKRADiscussionScales(P5Corp_userUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'setup',
      'subModule': 'corporateTools',
      'P5Corp_userUID': P5Corp_userUID,
      'sFunction': 'getOrganisationKRADiscussionScales'
    });
    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._discussionScaleItems = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getOrganisationKRADiscussionScales', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getOrganisationKRADiscussionScales'))
    );
  }

  getOrganisationKRAAccuracyScales(P5Corp_userUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'setup',
      'subModule': 'corporateTools',
      'P5Corp_userUID': P5Corp_userUID,
      'sFunction': 'getOrganisationKRAAccuracyScales'
    });
    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._discussionAccuracyScaleItems = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getOrganisationKRAAccuracyScales', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getOrganisationKRAAccuracyScales'))
    );
  }

  // save as Draft/Submit to manager
  savePerformanceAgreement(bIsDraft: boolean, removedKras: Array<object>) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraContracting',
      'clientUID': this._clientUID,
      'bIsManager': this._sessionUser.bIsManager,
      'P5Corp_userUID': this._sessionUser.P5Corp_userUID,
      'agreementData': this._performanceAgreementProfile,
      'bIsDraft': bIsDraft,
      'removedKras': removedKras,
      'sRoleToEmployee': this._sRoleToEmployee,
      'performanceData': this._performanceAgreementProfile.kraURPData,
      'sEmployeeUUID': this._currentTask['EmployeeUID'],
      'activeTab': 'personal',
      'sFunction': 'savePerformanceAgreement'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._kraPerformanceDraftData = JSON.parse(JSON.stringify(result));
        this._agreementDataChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'savePerformanceAgreement', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'savePerformanceAgreement'))
    );
  }

  getStatusList() {
    return ['draft', 'upcoming', 'current', 'arrears', 'completed', 'optional'];
  }

  getStatusOption() {

    if (!this._currentTask) {
      return '';
    }

    if (this._currentTask && !this._currentTask['sStatusOption']) {
      this._currentTask['sStatusOption'] = this.taskStatusOptions[this._currentTask['status']];
      return this._currentTask['sStatusOption'];
    }

    if (this._currentTask && this._currentTask['sStatusOption']) {
      return this._currentTask['sStatusOption'];
    }

  }

  getKraCareerPlan(userUUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraCareerPlan',
      'P5Corp_userUID': userUUID,
      'roleUUID': this._currentTask['kraHrURPRoleUID'],
      'sFunction': 'getKraCareerPlan',
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._careerObjectivesSettings = JSON.parse(JSON.stringify(result));
        // console.log('getKraCareerPlan', this._careerObjectivesSettings);
        this._careerObjectivesSettingsDataChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getKraCareerPlan', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getKraCareerPlan'))
    );
  }

  getKRAPerformanceAgreementPDFProfile() {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraContracting',
      'P5Corp_userUID': this._currentTask['EmployeeUID'],
      'roleUUID': this._currentTask['kraHrURPRoleUID'],
      'utcHours': this.localhours - this.utchours,
      'sFunction': 'getKRAPerformanceAgreementPDFProfile',
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._agreementPDFProfileData = JSON.parse(JSON.stringify(result));
        this._agreementPDFProfileDataChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getKRAPerformanceAgreementPDFProfile', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getKRAPerformanceAgreementPDFProfile'))
    );
  }

  getUserRoleProfileData() {
    const bodyString = JSON.stringify({
      peformaxToken: AppSettings.PEFORMAX_TOKEN,
      sModule: 'kra',
      subModule: 'kraContracting',
      roleUUID: this._currentTask['kraHrURPRoleUID'],
      utcHours: this.localhours - this.utchours,
      clientUID: this._authService._sessionUser['P5ClientUID'],
      organisationTiersUUID: this._authService._sessionUser['organisationTiersUUID'],
      sFunction: 'getUserRoleProfileData'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._p7kraRoleProfileData = JSON.parse(JSON.stringify(result));
        this._kraURPRoleChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getUserRoleProfileData', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getUserRoleProfileData'))
    );
  }

  // KRA REVIEW 
  getKraPerformanceReviewDraft() {
    const bodyString = JSON.stringify({
      peformaxToken: AppSettings.PEFORMAX_TOKEN,
      sModule: 'kra',
      subModule: 'kraScoringGateway',
      clientUID: this._clientUID,
      employeeUID: this._currentTask['EmployeeUID'],
      P5Corp_userUID: this._authService['_sessionUser']['P5Corp_userUID'],
      roleUUID: this._currentTask['kraHrURPRoleUID'],
      isManager: this._sRoleToEmployee === 'Employee' ? false : true,
      iYear: this._reviewYear,
      iMonth: this._reviewMonth,
      sFunction: 'getKraPerformanceAgreementDraft'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._kraPerformanceReviewData = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getKraPerformanceReviewDraft', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getKraPerformanceReviewDraft'))
    );
  }

  getKraPerformanceReview() {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraScoringGateway',
      'clientUID': this._clientUID,
      'employeeUID': this._currentTask['EmployeeUID'],
      'P5Corp_userUID': this._authService._sessionUser.P5Corp_userUID,
      'roleUUID': this._currentTask['kraHrURPRoleUID'],
      'iYear': this._reviewYear,
      'iMonth': this._reviewMonth,
      'sFunction': 'getKraPerformanceAgreement'

    });
    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._kraPerformanceReviewData = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getKraPerformanceAgreement', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getKraPerformanceAgreement'))
    );

  }

  getKraSummary() {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraScoringGateway',
      'iYear': this._reviewYear,
      'iMonth': this._reviewMonth,
      'utcHours': this.localhours - this.utchours,
      'clientUID': this._clientUID,
      'P5Corp_userUID': this._currentTask['EmployeeUID'],
      'sFunction': 'getKraSummary'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._kraOverallSummary = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getKraSummary', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getKraSummary'))
    );
  }

  getKraOverallResult() {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraScoringGateway',
      'iYear': this._reviewYear,
      'iMonth': this._reviewMonth,
      'sRoleUUID': this._currentTask['kraHrURPRoleUID'],
      'utcHours': this.localhours - this.utchours,
      'clientUID': this._clientUID,
      'P5Corp_userUID': this._currentTask['EmployeeUID'],
      'sFunction': 'getKraOverallResult'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._kraOverallResult = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getKraOverallResult', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getKraOverallResult'))
    );
  }

  // SAVE SCORING DATA
  saveKraPerformanceReview(sType: String, bModerateMode: Boolean, bManager: boolean, bDraft: Boolean, isDraft: Boolean, bResultsNoficationToEmployee: Boolean = false) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraScoringDAO',
      'P5Corp_userUID': this._authService._sessionUser.P5Corp_userUID,
      'sFunction': 'saveKraPerformanceReview',
      'scoringData': this._performanceReviewProfile,
      'sType': sType,
      'bModerateMode': bModerateMode,
      'bManager': bManager,
      'bDraft': bDraft,
      'isDraft': isDraft,
      'sRoleToEmployee': this._sRoleToEmployee,
      'employeeUID': this._currentTask['EmployeeUID'],
      'clientUID': this._sessionUser.P5ClientUID,
      'bResultsNoficationToEmployee': bResultsNoficationToEmployee ? bResultsNoficationToEmployee : false
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        //if (bResultsNoficationToEmployee) {
        //  this._dataChanged_emailSubmitted.emit();
        // } else {
        //  this._router.navigate(['home/activity-summary']);
        // }
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'saveKraPerformanceReview', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'saveKraPerformanceReview'))
    );
  }


  saveProjectPlanDocument(documentObject, P5Corp_userUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraContracting',
      'documentObject': documentObject,
      'P5Corp_userUID': P5Corp_userUID,
      'sFunction': 'saveProjectPlanDocument'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._agreementDataChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'saveProjectPlanDocument', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'saveProjectPlanDocument'))
    );
  }

  updateAgreementNotifications(EmployeeUID, kraHrURPRoleUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraContracting',
      'kraHrURPRoleUID': kraHrURPRoleUID,
      'P5Corp_userUID': EmployeeUID,
      'sFunction': 'updateAgreementNotifications'
    });
    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'updateAgreementNotifications', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'updateAgreementNotifications'))
    );
  }

  printKRAPerformanceAgreementPDFProfile(employeeUID: string, kraHrURPRoleUID: string) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraContracting',
      'P5Corp_userUID': employeeUID,
      'roleUUID': kraHrURPRoleUID,
      'utcHours': this.localhours - this.utchours,
      'clientUID': this._sessionUser.P5ClientUID,
      'sFunction': 'printKRAPerformanceAgreementPDFProfile',
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
      tap(_ => this._mService.handleTap(this.constructor.name, 'printKRAPerformanceAgreementPDFProfile', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'printKRAPerformanceAgreementPDFProfile'))
    );
  }

  updateReviewNotifications(EmployeeUID, kraHrURPRoleUID, iYear, iMonth) {

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraScoringDAO',
      'kraHrURPRoleUID': kraHrURPRoleUID,
      'P5Corp_userUID': EmployeeUID,
      'iYear': iYear,
      'iMonth': iMonth,
      'sFunction': 'updateReviewNotifications'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'updateReviewNotifications', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'updateReviewNotifications'))
    );
  }

  getReviewPDFData() {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'KraScoringPDFGateway',
      'clientUID': this._authService._sessionUser.P5ClientUID,
      'sEmployeeNumber': this._currentTask['sEmployeeNumber'],
      'iYear': this._currentTask['sYear'],
      'iMonth': this._currentTask['iMonth'],
      'bDraft': this._currentTask['bScoreInDraft'],
      'utcHours': this.localhours - this.utchours,
      'sFunction': 'getReviewPDFData'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._KRAReviewPDFData = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getReviewPDFData', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getReviewPDFData'))
    );
  }

  printReviewPDFData(employeeUID: string, kraHrURPRoleUID: string, dMonthScoredFor: string, bScoreInDraft: boolean) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'KraScoringPDFGateway',
      'clientUID': this._authService._sessionUser.P5ClientUID,
      'P5Corp_userUID': employeeUID,
      'roleUUID': kraHrURPRoleUID,
      'dMonthScoredFor': dMonthScoredFor,
      'utcHours': this.localhours - this.utchours,
      'bScoreInDraft': bScoreInDraft,
      'sFunction': 'printReviewPDFData'
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
      tap(_ => this._mService.handleTap(this.constructor.name, 'printReviewPDFData', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'printReviewPDFData'))
    );
  }

  downloadReviewPDFForm(task: object) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'KraScoringPDFGateway',
      'P5ClientUID': this._authService._sessionUser.P5ClientUID,
      'P6CompanyUID': this._authService._sessionUser.P6CompanyUID,
      'loggedInUserUID': this._authService._sessionUser.P5Corp_userUID,
      'P5Corp_userUID': task['EmployeeUID'],
      'roleUUID': task['kraHrURPRoleUID'],
      'iMonth': task['iMonth'],
      'sYear': task['sYear'],
      'sFunction': 'downloadReviewPDFForm'
    });

    const downloadWindow = window.open('about:blank');
    var doc = downloadWindow.document;
    doc.open("text/html");
    doc.write("<br><br><br><br><center><h2 style='color: #8d9098;'>Please wait while your PDF Form is downloading...</h2></center>");
    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        const sURL = JSON.parse(JSON.stringify(result));

        downloadWindow.location.href = sURL;

        setTimeout(() => {
          downloadWindow.close();
        }, 4000);

      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'downloadReviewPDFForm', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'downloadReviewPDFForm'))

    );
  }

  downloadAgreementPDFForm(task: object) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraContracting',
      'P5ClientUID': this._authService._sessionUser.P5ClientUID,
      'P6CompanyUID': this._authService._sessionUser.P6CompanyUID,
      'loggedInUserUID': this._authService._sessionUser.P5Corp_userUID,
      'P5Corp_userUID': task['EmployeeUID'],
      'roleUUID': task['kraHrURPRoleUID'],
      'sFunction': 'downloadAgreementPDFForm'
    });

    const downloadWindow = window.open('about:blank');
    var doc = downloadWindow.document;
    doc.open("text/html");
    doc.write("<br><br><br><br><center><h2 style='color: #8d9098;'>Please wait while your PDF Form is downloading...</h2></center>");
    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        const sURL = JSON.parse(JSON.stringify(result));
        downloadWindow.location.href = sURL;

        setTimeout(() => {
          downloadWindow.close();
        }, 4000);
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'downloadAgreementPDFForm', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'downloadAgreementPDFForm'))
    );
  }

  saveDiscussionNotes(discussionNotes, discussionDocs, discussionRating) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraManualDiscussion',
      'P5Corp_userUID': this._sessionUser.P5Corp_userUID,
      'discussionNotes': discussionNotes,
      'discussionDocs': discussionDocs,
      'discussionRating': discussionRating,
      'sFunction': 'saveDiscussionNotes'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'saveDiscussionNotes', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'saveDiscussionNotes'))
    );
  }

  saveKraCompentencyModeration(sType: String, bModerateMode: Boolean, bManager: boolean, bDraft: Boolean, isDraft: Boolean) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraScoringDAO',
      'P5Corp_userUID': this._sessionUser.P5Corp_userUID,
      'sFunction': 'saveKraCompentencyModeration',
      'scoringData': this._performanceReviewProfile,
      'sType': sType,
      'bModerateMode': bModerateMode,
      'bManager': bManager,
      'sRoleToEmployee': this._sRoleToEmployee,
      'employeeUID': this._employeeUID,
      'clientUID': this._clientUID
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'moderateKra', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'moderateKra'))
    );
  }
}
