import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { AppSettings, SessionUser, KraItemSettings, Task, KraCompanySettings, DiscussionNotes } from '../_models/index';
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
export class KraReviewService implements OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private AUTHSubscription: Subscription;

  _kraScoringTasks: Task;
  _kraScoringTask: Task;
  _KRAView: string; // PORTAL TAB: PERSONAL / DEPARTMENT
  today: Date = new Date();
  localhours: number = this.today.getHours();
  utchours: number = this.today.getUTCHours();
  _P5Corp_userUID: string;
  _sRoleToEmployee: string;
  _reviewMonth: Number;
  _reviewsMonth: string;
  _reviewYear: String;
  _employeeUID: String;
  _bShowModerationMode = false;
  _assessor_kraHrURPRoleUID: String;
  _deletedExternalAssessors = [];

  _linkedAssessors = [];
  _kraOverallSummary = [];
  _kraOverallResult = [];
  _competency_questionnaire = {};
  _completedLinkedAssessors = [];
  _outstandingLinkedAssessors = [];
  _discussionScaleItems = [];
  _kraItems = [];
  _discussionItems = {};
  _legendItems = [];
  _pdfData = {};
  _performanceReviewProfile = {
    inviteOthers: {},
    keyResultAreas: {},
    behaviouralCompentencies: {},
    overallFeedback: {},
    kraURPData: {},
    midYearReviews: {},
    performanceDiscussion: {},
    // moderation data
    sScoreModeratedReason: '',
    moderateKra: {}
  };
  _reviewDeletedDocuments = [];
  _usersToInvite: [{ 'sFullName': ''; }];
  _KRAReviewPDFData: {};
  _sessionUser: SessionUser;
  _kraPerformanceAgreementData: KraItemSettings;
  _kraURPRoleData: KraItemSettings;
  _kraPerformanceAgreementDraftData: KraItemSettings;
  _kraScoringYears: KraItemSettings[] = [];
  _kraScoringMonths: KraItemSettings[] = [];
  _employeeEmailDetails: KraItemSettings;
  _kraCompanySettings: KraCompanySettings;
  _currentReview: {};
  taskStatusOptions: object = {};
  _periodSummaryReviewYears = [];
  _individualPeriodSummaryReportData = [];
  _bExternalAssessor = false;
  _clientUID = '';

  _directReportEmployees = [];
  _discussionNotes = [new DiscussionNotes()];
  _discussionRating = [];
  _discussionAccuracyScaleItems = [];

  _individualPeriodSummaryReportDataChanged = new EventEmitter();
  _periodSummaryReviewYearsChanged = new EventEmitter();
  _legendDataChanged = new EventEmitter();
  _employeeDetailsChanged = new EventEmitter();
  _scoringMonthsChanged = new EventEmitter();
  _scoringYearsChanged = new EventEmitter();
  _scoringTasksChanged = new EventEmitter();
  _scoringProcessChanged = new EventEmitter();
  _scoringRedirectChanged = new EventEmitter();
  _reviewAssessorListChanged = new EventEmitter();
  _questionnaireChanged = new EventEmitter();
  _dataChanged_scales = new EventEmitter();
  _pdfDataChanged = new EventEmitter();
  _kraCompanySettingsDataChanged = new EventEmitter();
  _KRAReviewPrintDataChanged = new EventEmitter();
  _dataChanged_emailSubmitted = new EventEmitter();
  constructor(private _mService: MessengerService,
    private _http: HttpClient,
    private _router: Router,
    public _authService: AuthService) {

    this.AUTHSubscription = this._authService._userSessionChanged.subscribe(value => this.updateSessionUser());
    this._sessionUser = this._authService._sessionUser;
    this._KRAView = this._authService._KRAView;
  }

  updateSessionUser() {
    this._sessionUser = this._authService._sessionUser;
    // this._bExternalAssessor = this._authService._isExternalAssessor;
    this._clientUID = this._sessionUser.P5ClientUID;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.AUTHSubscription.unsubscribe();
  }

  // Prefered order to bodystring maintain this order
  /////////////////////
  // peformaxToken
  // activeTab
  // sModule
  // sFunction
  // P5Corp_userUID
  // bIsManager
  // bIsSecondManager
  // subModule
  // sYear
  // sMonth

  getKraLegendItems() {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraScoringGateway',
      'P5Corp_userUID': this._sessionUser.P5Corp_userUID,
      'sFunction': 'getKraLegendItems'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._legendItems = JSON.parse(JSON.stringify(result));
        this._legendDataChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getKraLegendItems', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getKraLegendItems'))
    );
  }

  // KRA REVIEW
  getKraScoringYears() {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraScoringGateway',
      'activeTab': this._authService._KRAView,
      'P5Corp_userUID': this._sessionUser.P5Corp_userUID,
      'assessor_kraHrURPRoleUID': this._assessor_kraHrURPRoleUID,
      'bIsManager': this._sessionUser.bIsManager,
      'bIsSecondManager': this._sessionUser.bIsSecondManager,
      'sFunction': 'getKraScoringYears'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._kraScoringYears = JSON.parse(JSON.stringify(result));
        this._scoringYearsChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getKraScoringYears', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getKraScoringYears'))
    );
  }

  getKraScoringMonths(sYear: string, sContractPeriodStart: string, sContractPeriodEnd: string) {
    const bExternalAssessor = this._bExternalAssessor ? this._bExternalAssessor : false;

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraScoringGateway',
      'activeTab': this._authService._KRAView,
      'P5Corp_userUID': this._sessionUser.P5Corp_userUID,
      'bExternalAssessor': bExternalAssessor,
      'assessor_kraHrURPRoleUID': this._assessor_kraHrURPRoleUID,
      'iYear': sYear,
      'sContractPeriodStart': sContractPeriodStart,
      'sContractPeriodEnd': sContractPeriodEnd,
      'sFunction': 'getKraScoringMonths'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._kraScoringMonths = JSON.parse(JSON.stringify(result));
        // if the length is 1 meaning there's only iMonth '0' then dont diaply the years
        if (this._kraScoringMonths.length === 1) {
          this._kraScoringYears = [];
        }
        this._scoringMonthsChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getKraScoringMonths', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getKraScoringMonths'))
    );
  }

  // called from list-item.component
  getKraRoleData() {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraContracting',
      'roleUUID': this._currentReview['kraHrURPRoleUID'],
      'utcHours': this.localhours - this.utchours,
      'sFunction': 'getKraRoleData'
    });

    this._employeeUID = this._currentReview['EmployeeUID'];
    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._kraURPRoleData = JSON.parse(JSON.stringify(result));
        this._scoringProcessChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getKraRoleData', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getKraRoleData'))
    );
  }

  getStatusList() {
    return ['draft', 'upcoming', 'current', 'arrears', 'completed', 'optional'];
  }

  getStatusOption() {

    if (!this._currentReview) {
      return false;
    }

    if (this._currentReview && !this._currentReview['statusOptions']) {
      this._currentReview['statusOptions'] = this.taskStatusOptions[this._currentReview['status']];
      return this._currentReview['statusOptions'];
    }

    if (this._currentReview && this._currentReview['statusOptions']) {
      return this._currentReview['statusOptions'];
    }

  }

  getKraReviewTasks(sYear: string, iMonth: number, sMonth: string, bOverallTasks) {
    const bExternalAssessor = this._bExternalAssessor ? this._bExternalAssessor : false;
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraScoringGateway',
      'activeTab': this._authService._KRAView,
      'P5Corp_userUID': this._sessionUser.P5Corp_userUID,
      'bIsManager': this._sessionUser.bIsManager,
      'iYear': sYear,
      'iMonth': iMonth,
      'bIsSecondManager': this._sessionUser.bIsSecondManager,
      'assessor_kraHrURPRoleUID': this._assessor_kraHrURPRoleUID,
      'isExternalAssessor': bExternalAssessor,
      'companyTemplate': this._sessionUser.companytemplate,
      'utcHours': this.localhours - this.utchours,
      'bOverallTasks': bOverallTasks,
      'sFunction': 'getKraReviewTasks'
    });

    this._reviewMonth = iMonth;
    this._reviewYear = sYear;
    this._reviewsMonth = sMonth;

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._kraScoringTasks = JSON.parse(JSON.stringify(result));
        this._scoringTasksChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getKraReviewTasks', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getKraReviewTasks'))
    );
  }

  getKraPerformanceAgreement(roleUUID: string, employeeUID: string) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraScoringGateway',
      'clientUID': this._clientUID,
      'employeeUID': employeeUID,
      'P5Corp_userUID': this._sessionUser.P5Corp_userUID,
      'roleUUID': roleUUID,
      'iYear': this._reviewYear,
      'iMonth': this._reviewMonth,
      'sFunction': 'getKraPerformanceAgreement'

    });
    this._employeeUID = employeeUID;
    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._kraPerformanceAgreementData = JSON.parse(JSON.stringify(result));
        if (this.getStatusOption() === 'bView' && this._authService._KRAView === 'department' && this._reviewMonth > 0) {
          //this.getKraSummary(roleUUID);
        } else {
          this._scoringRedirectChanged.emit();
        }
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getKraPerformanceAgreement', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getKraPerformanceAgreement'))
    );

  }

  getAssessorPerformanceAssessments(roleUUID: string, employeeUID: string) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraScoringGateway',
      'clientUID': this._clientUID,
      'P5Corp_userUID': this._sessionUser.P5Corp_userUID,
      'roleUUID': roleUUID,
      'iYear': this._reviewYear,
      'iMonth': this._reviewMonth,
      'sFunction': 'getAssessorPerformanceAssessments'

    });
    this._employeeUID = employeeUID;

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._kraPerformanceAgreementData = JSON.parse(JSON.stringify(result));
        this._scoringRedirectChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getAssessorPerformanceAssessments', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getAssessorPerformanceAssessments'))
    );
  }

  getKraPerformanceAgreementDraft(roleUUID: string, employeeUID: string, isManager: Boolean) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraScoringGateway',
      'clientUID': this._clientUID,
      'employeeUID': employeeUID,
      'P5Corp_userUID': this._sessionUser.P5Corp_userUID,
      'roleUUID': roleUUID,
      'isManager': this._authService._KRAView === 'personal' ? false : true,
      'iYear': this._reviewYear,
      'iMonth': this._reviewMonth,
      'sFunction': 'getKraPerformanceAgreementDraft'
    });
    this._employeeUID = employeeUID;
    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._kraPerformanceAgreementData = JSON.parse(JSON.stringify(result));
        this._scoringRedirectChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getKraPerformanceAgreementDraft', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getKraPerformanceAgreementDraft'))
    );
  }

  getKrasAndKpis(roleUUID: string, employeeUID: string, isManager: Boolean) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraScoringGateway',
      'clientUID': this._clientUID,
      'employeeUID': employeeUID,
      'P5Corp_userUID': this._sessionUser.P5Corp_userUID,
      'roleUUID': roleUUID,
      'isManager': isManager,
      'iYear': this._reviewYear,
      'iMonth': this._reviewMonth,
      'sFunction': 'getKraPerformanceAgreementDraft'
    });
    this._employeeUID = employeeUID;

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._kraPerformanceAgreementData = JSON.parse(JSON.stringify(result));
        this.getInvitedUsers(roleUUID);
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getKrasAndKpis', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getKrasAndKpis'))
    );
  }

  getInvitedUsers(sRoleUUID: String) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraScoringGateway',
      'P5Corp_userUID': this._sessionUser.P5Corp_userUID,
      'clientUID': this._clientUID,
      'sFunction': 'getInvitedUsers'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._usersToInvite = JSON.parse(JSON.stringify(result));
        this.getCompletedLinkedAssessorsForRole(sRoleUUID);
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getInvitedUsers', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getInvitedUsers'))
    );
  }

  // SAVE SCORING DATA
  saveKraReviewPerformanceAgreement(additionalScoreData: Object, selectedDatesToScore: Array<Object>,
    scoringData = [], sType: String, bModerateMode: Boolean, bManager: boolean, bDraft: Boolean, isDraft: Boolean) {
    // additionalScoreData['sEmployeeSigned'] = this._currentReview['sEmployeeSigned'];
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraScoringDAO',
      'P5Corp_userUID': this._sessionUser.P5Corp_userUID,
      'sFunction': 'saveKraReviewPerformanceAgreement',
      'additionalScoreData': additionalScoreData,
      'selectedDatesToScore': selectedDatesToScore,
      'scoringData': scoringData,
      'sType': sType,
      'bModerateMode': bModerateMode,
      'bManager': bManager,
      'bDraft': bDraft,
      'isDraft': isDraft,
      'sRoleToEmployee': this._sRoleToEmployee,
      'employeeUID': this._employeeUID,
      'clientUID': this._clientUID
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._router.navigate(['home/activity-summary']);
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'saveKraReviewPerformanceAgreement', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'saveKraReviewPerformanceAgreement'))
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
      'employeeUID': this._employeeUID,
      'clientUID': this._clientUID,
      'bResultsNoficationToEmployee': bResultsNoficationToEmployee ? bResultsNoficationToEmployee : false
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        if (bResultsNoficationToEmployee) {
          this._dataChanged_emailSubmitted.emit();
        } else {
          this._router.navigate(['home/activity-summary']);
        }
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'saveKraPerformanceReview', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'saveKraPerformanceReview'))
    );
  }

  revertPerformanceAgreementReview(additionalScoreData: Object, selectedDatesToScore: Array<Object>,
    scoringData = [], sType: String, bModerateMode: Boolean, bManager: boolean, bDraft: Boolean, emailObject: object) {
    additionalScoreData['sEmployeeSigned'] = this._currentReview['sEmployeeSigned'];
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraScoringDAO',
      'P5Corp_userUID': this._sessionUser.P5Corp_userUID,
      'sFunction': 'revertPerformanceAgreementReview',
      'additionalScoreData': additionalScoreData,
      'selectedDatesToScore': selectedDatesToScore,
      'scoringData': scoringData,
      'sType': sType,
      'bModerateMode': bModerateMode,
      'bManager': bManager,
      'bDraft': bDraft,
      'employeeUID': this._employeeUID,
      'clientUID': this._clientUID,
      'sRoleToEmployee': this._sRoleToEmployee,
      'emailObject': emailObject
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._router.navigate(['home/activity-summary']);
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'revertPerformanceAgreementReview', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'revertPerformanceAgreementReview'))
    );
  }


  submitAssessorsForApproval(sType: String, bModerateMode: Boolean, bManager: boolean, bDraft: Boolean, isDraft: Boolean) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraScoringDAO',
      'P5Corp_userUID': this._authService._sessionUser.P5Corp_userUID,
      'sFunction': 'saveKraPerformanceReview',
      'scoringData': this._performanceReviewProfile,
      'sType': sType,
      'bModerateMode': bModerateMode,
      'bManager': false,
      'bDraft': bDraft,
      'isDraft': isDraft,
      'sRoleToEmployee': this._sRoleToEmployee,
      'employeeUID': this._employeeUID,
      'clientUID': this._clientUID,
      'bResultsNoficationToEmployee': false
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'submitAssessorsForApproval', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'submitAssessorsForApproval'))
    );
  }

  getLinkedAssessorsForRole(sRoleUUID: String) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraScoringGateway',
      'sRoleUUID': sRoleUUID,
      'iYear': this._reviewYear,
      'iMonth': this._reviewMonth,
      'sFunction': 'getLinkedAssessorsForRole'
    });
    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._linkedAssessors = JSON.parse(JSON.stringify(result));
        this.getInvitedUsers(sRoleUUID);
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getLinkedAssessorsForRole', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getLinkedAssessorsForRole'))
    );
  }

  getCompletedLinkedAssessorsForRole(sRoleUUID: String) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraScoringGateway',
      'sRoleUUID': sRoleUUID,
      'iYear': this._reviewYear,
      'iMonth': this._reviewMonth,
      'sFunction': 'getCompletedLinkedAssessorsForRole'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._completedLinkedAssessors = JSON.parse(JSON.stringify(result));
        this.getOutstandingLinkedAssessorsForRole(sRoleUUID);
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getCompletedLinkedAssessorsForRole', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getCompletedLinkedAssessorsForRole'))
    );
  }

  getOutstandingLinkedAssessorsForRole(sRoleUUID: String) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraScoringGateway',
      'sRoleUUID': sRoleUUID,
      'iYear': this._reviewYear,
      'iMonth': this._reviewMonth,
      'sFunction': 'getOutstandingLinkedAssessorsForRole'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._outstandingLinkedAssessors = JSON.parse(JSON.stringify(result));
        this._reviewAssessorListChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getOutstandingLinkedAssessorsForRole', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getOutstandingLinkedAssessorsForRole'))
    );
  }

  approveDeclineInvites(obj: Object) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraScoringDAO',
      'pageObject': obj,
      'sFunction': 'approveDeclineInvites',
      'clientUID': this._clientUID,
      'P5Corp_userUID': this._sessionUser.P5Corp_userUID
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._router.navigate(['home/activity-summary']);
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'approveDeclineInvites', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'approveDeclineInvites'))
    );
  }


  kraSendInviteUserReminder(assessorData: Object) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraScoringDAO',
      'assessorData': assessorData,
      'sFunction': 'kraSendInviteUserReminder',
      'clientUID': this._clientUID,
      'P5Corp_userUID': this._sessionUser.P5Corp_userUID
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'kraSendInviteUserReminder', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'kraSendInviteUserReminder'))
    );
  }
  // applicable when  you want to send emails to the employee
  getEmployeeDetails(employeeUID?: string) {

    if (!employeeUID && this._currentReview) {
      employeeUID = this._currentReview['EmployeeUID'];
    }

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraContracting',
      'P5Corp_userUID': employeeUID,
      'sFunction': 'getEmployeeDetails'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._employeeEmailDetails = JSON.parse(JSON.stringify(result));
        this._employeeDetailsChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getEmployeeDetails', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getEmployeeDetails'))
    );
  }

  getKraSummary(sRoleUUID: String) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraScoringGateway',
      'iYear': this._reviewYear,
      'iMonth': this._reviewMonth,
      'utcHours': this.localhours - this.utchours,
      'clientUID': this._clientUID,
      'P5Corp_userUID': this._employeeUID,
      'sFunction': 'getKraSummary'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._kraOverallSummary = JSON.parse(JSON.stringify(result));
        //this.getKraOverallResult(sRoleUUID);
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getKraSummary', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getKraSummary'))
    );
  }

  getKraOverallResult(sRoleUUID: String) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraScoringGateway',
      'iYear': this._reviewYear,
      'iMonth': this._reviewMonth,
      'sRoleUUID': sRoleUUID,
      'utcHours': this.localhours - this.utchours,
      'clientUID': this._clientUID,
      'P5Corp_userUID': this._employeeUID,
      'sFunction': 'getKraOverallResult'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._kraOverallResult = JSON.parse(JSON.stringify(result));
        this._scoringRedirectChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getKraOverallResult', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getKraOverallResult'))
    );
  }

  getCompetencyScoringProfile(assesseeUID: String, sAssessorType: String, assessorUID: String,
    assessorFullName: String) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraScoringGateway',
      'sScoredYear': this._reviewYear,
      'assesseeUID': assesseeUID,
      'sAssessorType': sAssessorType,
      'assessorUID': assessorUID,
      'assessorFullName': assessorFullName,
      'clientUID': this._clientUID,
      'sFunction': 'getCompetencyQuestionnaireForAssessor'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._competency_questionnaire = JSON.parse(JSON.stringify(result));
        this._questionnaireChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getCompetencyScoringProfile', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getCompetencyScoringProfile'))
    );
  }

  getOrganisationKRADiscussionScales() {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'setup',
      'subModule': 'corporateTools',
      'P5Corp_userUID': this._authService._sessionUser.P5Corp_userUID,
      'sFunction': 'getOrganisationKRADiscussionScales'
    });
    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._discussionScaleItems = JSON.parse(JSON.stringify(result));
        this._dataChanged_scales.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getOrganisationKRADiscussionScales', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getOrganisationKRADiscussionScales'))
    );
  }

  getOrganisationKRAAccuracyScales() {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'setup',
      'subModule': 'corporateTools',
      'P5Corp_userUID': this._authService._sessionUser.P5Corp_userUID,
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

  getReviewPDFData() {

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'KraScoringPDFGateway',
      'clientUID': this._authService._sessionUser.P5ClientUID,
      'sEmployeeNumber': this._currentReview['sEmployeeNumber'],
      'iYear': this._currentReview['sYear'],
      'iMonth': this._currentReview['iMonth'],
      'bDraft': this._currentReview['bScoreInDraft'],
      'utcHours': this.localhours - this.utchours,
      'sFunction': 'getReviewPDFData'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._KRAReviewPDFData = JSON.parse(JSON.stringify(result));
        this._KRAReviewPrintDataChanged.emit();
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

  getPeriodSummaryReportYears(userUUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'KraScoringPDFGateway',
      'userUUID': userUUID,
      'sFunction': 'getPeriodSummaryReportYears'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._periodSummaryReviewYears = JSON.parse(JSON.stringify(result));
        this._periodSummaryReviewYearsChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getPeriodSummaryReportYears', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getPeriodSummaryReportYears'))
    );
  }

  printIndividualPeriodSummaryReport(userUUID, pageData) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'KraScoringPDFGateway',
      'userUUID': userUUID,
      'clientUID': this._clientUID,
      'pageData': pageData,
      'sFunction': 'printIndividualPeriodSummaryReport'
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
      tap(_ => this._mService.handleTap(this.constructor.name, 'printIndividualPeriodSummaryReport', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'printIndividualPeriodSummaryReport'))
    );
  }

  getIndividualPeriodSummaryReportDaata(userUUID, pageData) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'KraScoringPDFGateway',
      'userUUID': userUUID,
      'clientUID': this._clientUID,
      'pageData': pageData,
      'sFunction': 'getIndividualPeriodSummary'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._individualPeriodSummaryReportData = JSON.parse(JSON.stringify(result));
        this._individualPeriodSummaryReportDataChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getIndividualPeriodSummaryReportDaata', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getIndividualPeriodSummaryReportDaata'))
    );
  }

  getDirectReportEmployees() {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'kra',
      'subModule': 'kraManualDiscussion',
      'P5Corp_userUID': this._sessionUser.P5Corp_userUID,
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
        // this._directReportEmployees = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'saveDiscussionNotes', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'saveDiscussionNotes'))
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

}
