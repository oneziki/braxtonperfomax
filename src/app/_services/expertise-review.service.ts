import { Injectable, OnDestroy, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  AppSettings,
  SessionUser
} from '../_models/index';
import { AuthService } from './auth.service';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessengerService } from './messengerservice.service';
import {
  ExpertiseReview,
  ExpertiseReviewAssessee,
  ExpertiseReviewQuestionnaire,
  ExpertiseReviewAssessors
} from '../_models/expertise-review';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

/*
  You can access the three-sixty module
  1. By logging into the system and complete your assessments
  2. Access the module by an encrypted link where logging into the system is skipped.

  Functions used within this service accommodates both scenarios and redirect accordingly
 */

@Injectable()
export class ExpertiseReviewService implements OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();
  private AUTHSubscription: Subscription;

  _sessionUser: SessionUser;
  _P5Corp_userUID = '';
  _sCatUIDs = '';
  _skillsAssessmentUID = '';
  _expertise_review: ExpertiseReview[] = [];
  _expertise_review_assessees_pending: ExpertiseReviewAssessee[] = [];
  _expertise_review_assessees_completed: ExpertiseReviewAssessee[] = [];
  _expertise_review_questionnaire: ExpertiseReviewQuestionnaire;
  _reportData: Object = {};

  public _linkUserUID = '';
  public _sAssesseeFullName = '';
  public _sAssesseeInitials = '';
  public _isLoading = false;

  public _selectedAssessment: ExpertiseReview;
  public _selectedAssessee: ExpertiseReviewAssessee;

  _assesseesChanged = new EventEmitter();
  _loaderChanged = new EventEmitter();
  _assessmentsChanged = new EventEmitter();
  _assessorTypeChanged = new EventEmitter();
  _inviteListChanged = new EventEmitter();
  _questionnaireChanged = new EventEmitter();
  _reportChanged = new EventEmitter();
  _assessmentSubmittedChanged = new EventEmitter();
  _assessorsChanged = new EventEmitter();
  _assessorsSubmittedChanged = new EventEmitter();

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
  }

  getExpertiseReviewForUser(P5Corp_userUID, sJobTitleUUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'P5Corp_userUID': P5Corp_userUID,
      'sJobTitleUUID': sJobTitleUUID,
      'sModule': 'expertiseReview',
      'sPortalTab': this._authService._KRAView,
      'sFunction': 'getExpertiseReviewForUser'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._expertise_review = JSON.parse(JSON.stringify(result));
        this._assessmentsChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getExpertiseReviewForUser', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getExpertiseReviewForUser'))
    );
  }



  // eslint-disable-next-line max-len
  getExpertiseReviewAssesseesForAssessor(SkillsAssessmentUID: string, sAssessorInternal_fkUserUUID: string) {

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'SkillsAssessmentUID': SkillsAssessmentUID,
      'sAssessorInternal_fkUserUUID': sAssessorInternal_fkUserUUID,
      'sModule': 'expertiseReview',
      'sPortalTab': this._authService._KRAView,
      'sFunction': 'getExpertiseReviewAssesseesForAssessor'
    });

    this._skillsAssessmentUID = SkillsAssessmentUID;

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        const qkskills_assessees = JSON.parse(JSON.stringify(result));

        this._expertise_review_assessees_pending = qkskills_assessees['pendingAssessees'];
        this._expertise_review_assessees_completed = qkskills_assessees['completedAssessees'];
        this._assesseesChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getExpertiseReviewAssesseesForAssessor', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getExpertiseReviewAssesseesForAssessor'))
    );
  }

  getExpertiseReviewQuestionnaireForAssessor(assessee: ExpertiseReviewAssessee) {

    this._isLoading = true;
    this._loaderChanged.emit();

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'skillsAssessmentUID': assessee.SkillsAssessmentUID,
      'assesseeUUID': assessee.assesseeUUID,
      'skillsAssessorTypeUID': assessee.skillsAssessorTypeUID,
      'assessorUUID': assessee.assessorUUID,
      'sModule': 'expertiseReview',
      'sFunction': 'getExpertiseReviewQuestionnaireForAssessor'
    });

    this._sAssesseeFullName = assessee.sAssesseeFullName;
    this._sAssesseeInitials = assessee.initials;

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._expertise_review_questionnaire = JSON.parse(JSON.stringify(result));
        this._questionnaireChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getExpertiseReviewQuestionnaireForAssessor', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getExpertiseReviewQuestionnaireForAssessor'))
    );
  }



  submitExpertiseReviewData(surveyData, skillsAssessmentUID, skillsAssessmentAssessorsUID) {

    this._expertise_review_assessees_pending = [];
    this._expertise_review_assessees_completed = [];
    this._assesseesChanged.emit();

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'surveyData': surveyData,
      'skillsAssessmentUID': skillsAssessmentUID,
      'skillsAssessmentAssessorsUID': skillsAssessmentAssessorsUID,
      'assesseeUUID': this._selectedAssessee.assesseeUUID,
      'sModule': 'expertiseReview',
      'sFunction': 'submitExpertiseReviewData'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        // execute service calls to ensure the views have latest data result
        this._assessmentSubmittedChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'submitExpertiseReviewData', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'submitExpertiseReviewData'))
    );
  }

  getP5Corp_userUID() {
    return this._P5Corp_userUID;
  }

  // getP5Corp_compAssessmentUID() {
  //   return this._compAssessmentUID;
  // }

  getExpertiseReviewReport(assessee: ExpertiseReviewAssessee) {
    this._isLoading = true;
    this._loaderChanged.emit();

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'skillsAssessmentUID': assessee.SkillsAssessmentUID,
      'assesseeUUID': assessee.assesseeUUID,
      'skillsAssessorTypeUID': assessee.skillsAssessorTypeUID,
      'assessorUUID': assessee.assessorUUID,
      'sModule': 'expertiseReview',
      'sFunction': 'getExpertiseReviewReport'
    });

    this._sAssesseeFullName = assessee.sAssesseeFullName;
    this._sAssesseeInitials = assessee.initials;

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._reportData = JSON.parse(JSON.stringify(result));
        this._reportChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getExpertiseReviewReport', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getExpertiseReviewReport'))
    );
  }

  printExpertiseReviewReport(assessee) {
    this._isLoading = true;
    this._loaderChanged.emit();

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'skillsAssessmentUID': assessee.SkillsAssessmentUID,
      'assesseeUUID': assessee.assesseeUUID,
      'assessorUUID': assessee.assessorUUID,
      'skillsAssessorTypeUID': assessee.skillsAssessorTypeUID,
      'sModule': 'expertiseReview',
      'sFunction': 'printExpertiseReviewReport'
    });

    this._sAssesseeFullName = assessee.sAssesseeFullName;
    this._sAssesseeInitials = assessee.initials;

    const downloadWindow = window.open('about:blank');
    var doc = downloadWindow.document;
    doc.open("text/html");
    doc.write("<br><br><br><br><center><h2 style='color: #8d9098;'>Please wait while your PDF is downloading...</h2></center>");

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        const sURL = JSON.parse(JSON.stringify(result));
        downloadWindow.location.href = sURL;
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'printExpertiseReviewReport', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'printExpertiseReviewReport'))
    );
  }

  updateExpertiseNotifications(sAssessorInternal_fkUserUUID, skillsAssessmentUID) {

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'skillsAssessmentUID': skillsAssessmentUID,
      'assesseeUUID': sAssessorInternal_fkUserUUID,
      'sModule': 'expertiseReview',
      'sFunction': 'updateExpertiseNotifications'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'updateExpertiseNotifications', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'updateExpertiseNotifications'))
    );
  }
}

