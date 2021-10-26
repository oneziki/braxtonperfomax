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
  ExitInterviewAssessment,
  ExitInterviewAssessmentAssessee,
  ExitInterviewAssessmentQuestionnaire,
  ExitInterviewAssessmentAssessors
} from '../_models/exit-interview-assessment';
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
export class ExitInterviewService implements OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();
  private AUTHSubscription: Subscription;

  _sessionUser: SessionUser;
  _P5Corp_userUID = '';
  _sCatUIDs = '';
  _exitInterviewAssessmentUID = '';
  _exit_interview_assessment: ExitInterviewAssessment[] = [];
  _exit_interview_assessment_assessees_pending: ExitInterviewAssessmentAssessee[] = [];
  _exit_interview_assessment_assessees_completed: ExitInterviewAssessmentAssessee[] = [];
  _exit_interview_assessment_questionnaire: ExitInterviewAssessmentQuestionnaire;
  _reportData: Object = {};

  public _linkUserUID = '';
  public _sAssesseeFullName = '';
  public _sAssesseeInitials = '';
  public _isLoading = false;

  public _selectedAssessment: ExitInterviewAssessment;
  public _selectedAssessee: ExitInterviewAssessmentAssessee;

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

  getExitInterviewAssessmentForUser(P5Corp_userUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'P5Corp_userUID': P5Corp_userUID,
      'sModule': 'ExitInterviewAssessment',
      'sPortalTab': this._authService._KRAView,
      'sFunction': 'getExitInterviewAssessmentForUser'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._exit_interview_assessment = JSON.parse(JSON.stringify(result));
        this._assessmentsChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getExitInterviewAssessmentForUser', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getExitInterviewAssessmentForUser'))
    );
  }



  // eslint-disable-next-line max-len
  getExitInterviewAssessmentAssesseesForAssessor(exitInterviewAssessmentUID: string, sAssessorInternal_fkUserUUID: string) {

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'exitInterviewAssessmentUID': exitInterviewAssessmentUID,
      'sAssessorInternal_fkUserUUID': sAssessorInternal_fkUserUUID,
      'sModule': 'ExitInterviewAssessment',
      'sPortalTab': this._authService._KRAView,
      'sFunction': 'getExitInterviewAssessmentAssesseesForAssessor'
    });

    this._exitInterviewAssessmentUID = exitInterviewAssessmentUID;

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        const exit_interview_assessees = JSON.parse(JSON.stringify(result));

        this._exit_interview_assessment_assessees_pending = exit_interview_assessees['pendingAssessees'];
        this._exit_interview_assessment_assessees_completed = exit_interview_assessees['completedAssessees'];
        this._assesseesChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getExitInterviewAssessmentAssesseesForAssessor', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getExitInterviewAssessmentAssesseesForAssessor'))
    );
  }

  getExitInterviewAssessmentQuestionnaireForAssessor(assessee) {

    this._isLoading = true;
    this._loaderChanged.emit();

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'exitInterviewAssessmentUID': assessee.exitInterviewAssessmentUID,
      'assesseeUUID': assessee.assesseeUUID,
      'compAssessorTypeUID': assessee.compAssessorTypeUID,
      'assessorUUID': assessee.assessorUUID,
      'sModule': 'ExitInterviewAssessment',
      'sFunction': 'getExitInterviewAssessmentQuestionnaireForAssessor'
    });

    this._sAssesseeFullName = assessee.sAssesseeFullName;
    this._sAssesseeInitials = assessee.initials;

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._exit_interview_assessment_questionnaire = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getExitInterviewAssessmentQuestionnaireForAssessor', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getExitInterviewAssessmentQuestionnaireForAssessor'))
    );
  }



  submitExitInterviewAssessmentData(surveyData, exitInterviewAssessmentUID, exitInterviewAssessmentAssessorsUID) {

    this._exit_interview_assessment_assessees_pending = [];
    this._exit_interview_assessment_assessees_completed = [];
    this._assesseesChanged.emit();

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'surveyData': surveyData,
      'exitInterviewAssessmentUID': exitInterviewAssessmentUID,
      'exitInterviewAssessmentAssessorsUID': exitInterviewAssessmentAssessorsUID,
      'assesseeUUID': this._selectedAssessee.assesseeUUID,
      'sModule': 'ExitInterviewAssessment',
      'sFunction': 'submitExitInterviewAssessmentData'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        // execute service calls to ensure the views have latest data result
        this._assessmentSubmittedChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'submitExitInterviewAssessmentData', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'submitExitInterviewAssessmentData'))
    );
  }

  getP5Corp_userUID() {
    return this._P5Corp_userUID;
  }

  // getP5Corp_compAssessmentUID() {
  //   return this._compAssessmentUID;
  // }

  getExitInterviewAssessmentReport(assessee: ExitInterviewAssessmentAssessee, bPDF: boolean = false) {
    this._isLoading = true;
    this._loaderChanged.emit();

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'exitInterviewAssessmentUID': assessee.exitInterviewAssessmentUID,
      'assesseeUUID': assessee.assesseeUUID,
      'compAssessorTypeUID': assessee.compAssessorTypeUID,
      'assessorUUID': assessee.assessorUUID,
      'sModule': 'ExitInterviewAssessment',
      'bPDF': bPDF,
      'sFunction': 'getExitInterviewAssessmentReport'
    });

    this._sAssesseeFullName = assessee.sAssesseeFullName;
    this._sAssesseeInitials = assessee.initials;

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._reportData = JSON.parse(JSON.stringify(result));
        this._reportChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getExitInterviewAssessmentReport', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getExitInterviewAssessmentReport'))
    );
  }

  printExitInterviewAssessmentReport(assessee) {
    this._isLoading = true;
    this._loaderChanged.emit();

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'exitInterviewAssessmentUID': assessee.exitInterviewAssessmentUID,
      'assesseeUUID': assessee.assesseeUUID,
      'assessorUUID': assessee.assessorUUID,
      'compAssessorTypeUID': assessee.compAssessorTypeUID,
      'sModule': 'ExitInterviewAssessment',
      'sFunction': 'printExitInterviewAssessmentReport'
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
      tap(_ => this._mService.handleTap(this.constructor.name, 'printExitInterviewAssessmentReport', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'printExitInterviewAssessmentReport'))
    );
  }

  updateExitInterviewNotifications(assesseeUUID, exitInterviewAssessmentUID) {

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'exitInterviewAssessmentUID': exitInterviewAssessmentUID,
      'assesseeUUID': assesseeUUID,
      'sModule': 'ExitInterviewAssessment',
      'sFunction': 'updateExitInterviewNotifications'
    });
    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'updateExitInterviewNotifications', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'updateExitInterviewNotifications'))
    );
  }


}

