import { Injectable, OnDestroy, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  ThreeSixtyAssessee,
  ThreeSixtyAssessors,
  AppSettings,
  ThreeSixtyQuestionnaire,
  ThreeSixtyAssessment,
  SessionUser
} from '../_models/index';
import { AuthService } from '../_services/auth.service';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';

import { catchError, map, retry, tap } from 'rxjs/operators';
import { MessengerService } from './messengerservice.service';

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
export class ThreeSixtyService implements OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();
  private AUTHSubscription: Subscription;

  _sessionUser: SessionUser;
  _P5Corp_userUID = '';
  _sCatUIDs = '';
  _compAssessmentUID = '';
  _threeSixty_assessments: ThreeSixtyAssessment[] = [];
  _threeSixty_assessees_pending: ThreeSixtyAssessee[] = [];
  _threeSixty_assessees_completed: ThreeSixtyAssessee[] = [];
  _threeSixty_questionnaire: ThreeSixtyQuestionnaire;
  _reportData: Object = {};
  _threeSixty_users_to_Invite = [];
  _threeSixty_invited_assessors: ThreeSixtyAssessors[] = [];
  _threeSixty_assessor_typeOther = [];

  public _bExternalLink = false;
  public _linkUserUID = '';
  public _sAssesseeFullName = '';
  public _sAssesseeInitials = '';
  public _isLoading = false;

  public _selectedAssessment: ThreeSixtyAssessment;
  public _selectedAssessee: ThreeSixtyAssessee;

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

  getThreeSixtyAssessmentsForUser(P5Corp_userUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'P5Corp_userUID': P5Corp_userUID,
      'sCategoryUIDs': this._sCatUIDs,
      'sModule': 'threesixty',
      'sFunction': 'getThreeSixtyAssessmentsForUser'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._threeSixty_assessments = JSON.parse(JSON.stringify(result));
        this._assessmentsChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getThreeSixtyAssessmentsForUser', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getThreeSixtyAssessmentsForUser'))
    );
  }

  getThreeSixtyAssessmentsAssesorTypes(CompAssessmentUID, sAsseesseUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'CompAssessmentUID': CompAssessmentUID,
      'sAsseesseUID': sAsseesseUID,
      'sModule': 'threesixty',
      'sFunction': 'getThreeSixtyAssessmentsAssesorTypes'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._threeSixty_assessor_typeOther = JSON.parse(JSON.stringify(result));
        this._assessorTypeChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getThreeSixtyAssessmentsAssesorTypes', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getThreeSixtyAssessmentsAssesorTypes'))
    );
  }

  // eslint-disable-next-line max-len
  getThreeSixtyAssesseesForAssessor(compAssessmentUID: string, sAssessorInternal_fkUserUUID: string, bRedirect: boolean, _bExternalLink: boolean = false) {

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'compAssessmentUID': compAssessmentUID,
      'sAssessorInternal_fkUserUUID': sAssessorInternal_fkUserUUID,
      'sModule': 'threesixty',
      'sPortalTab': 'personal',
      'sFunction': 'getThreeSixtyAssesseesForAssessor',
      'bExternalLink': false
    });

    this._compAssessmentUID = compAssessmentUID;
    this._bExternalLink = _bExternalLink;

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        const threeSixty_assessees = JSON.parse(JSON.stringify(result));

        this._threeSixty_assessees_pending = threeSixty_assessees['pendingAssessees'];
        this._threeSixty_assessees_completed = threeSixty_assessees['completedAssessees'];
        this._assesseesChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getThreeSixtyAssesseesForAssessor', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getThreeSixtyAssesseesForAssessor'))
    );
  }

  getThreeSixtyQuestionnaireForAssessor(assessee: ThreeSixtyAssessee) {

    this._isLoading = true;
    this._loaderChanged.emit();

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'compAssessmentUID': assessee.compAssessmentUID,
      'assesseeUUID': assessee.assesseeUUID,
      'compAssessorTypeUID': assessee.compAssessorTypeUID,
      'assessorUUID': assessee.assessorUUID,
      'sModule': 'threesixty',
      'sFunction': 'getThreeSixtyQuestionnaireForAssessor'
    });

    this._sAssesseeFullName = assessee.sAssesseeFullName;
    this._sAssesseeInitials = assessee.initials;

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._threeSixty_questionnaire = JSON.parse(JSON.stringify(result));
        return this._threeSixty_questionnaire;
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getThreeSixtyQuestionnaireForAssessor', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getThreeSixtyQuestionnaireForAssessor'))
    );
  }

  getThreeSixtysUsersToInvite() {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'P5Corp_userUID': this._sessionUser.P5Corp_userUID,
      'P5ClientUID': this._sessionUser.P5ClientUID,
      'sModule': 'threesixty',
      'sFunction': 'getThreeSixtysUsersToInvite'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._threeSixty_users_to_Invite = JSON.parse(JSON.stringify(result));
        this._inviteListChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getThreeSixtyQuestionnaireForAssessor', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getThreeSixtyQuestionnaireForAssessor'))
    );
  }

  getThreeSixtyInvitedAssessors(assessmentData: ThreeSixtyAssessment) {

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'assessmentData': assessmentData,
      'sModule': 'threesixty',
      'sFunction': 'getThreeSixtyInvitedAssessors'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._threeSixty_invited_assessors = JSON.parse(JSON.stringify(result));
        this._assessorsChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getThreeSixtyInvitedAssessors', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getThreeSixtyInvitedAssessors'))
    );
  }

  getThreeSixtyAssessorsForApproval(assessmentData: ThreeSixtyAssessment, assessee: ThreeSixtyAssessee) {

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'assessmentData': assessmentData,
      'assessee': assessee,
      'sModule': 'threesixty',
      'sFunction': 'getThreeSixtyAssessorsForApproval'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._threeSixty_invited_assessors = JSON.parse(JSON.stringify(result));
        this._assessorsChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getThreeSixtyAssessorsForApproval', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getThreeSixtyAssessorsForApproval'))
    );
  }

  submitThreesixtyInvitedAssessors(assessmentData: ThreeSixtyAssessment, assessors, removedThreesixyAssessors) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'assessors': assessors,
      'assessmentData': assessmentData,
      'P5ClientUID': this._sessionUser.P5ClientUID,
      'removedThreesixyAssessors': removedThreesixyAssessors,
      'sModule': 'threesixty',
      'sFunction': 'submitThreesixtyInvitedAssessors'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._threeSixty_invited_assessors = JSON.parse(JSON.stringify(result));
        this._assessorsSubmittedChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'submitThreesixtyInvitedAssessors', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'submitThreesixtyInvitedAssessors'))
    );
  }

  approveDeclineThreeSixtyAssessors(pageObject) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'pageObject': pageObject,
      'P5ClientUID': this._sessionUser.P5ClientUID,
      'sModule': 'threesixty',
      'sFunction': 'approveDeclineThreeSixtyAssessors'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._threeSixty_invited_assessors = JSON.parse(JSON.stringify(result));
        this._assessorsSubmittedChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'approveDeclineThreeSixtyAssessors', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'approveDeclineThreeSixtyAssessors'))
    );
  }

  submitThreeSixtyQuestionnaire(surveyData, compAssessmentUID, compAssessmentAssessorsUID, bDraft) {
    this._threeSixty_assessees_pending = [];
    this._threeSixty_assessees_completed = [];
    this._assesseesChanged.emit();

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'surveyData': surveyData,
      'bShowPerformanceDiscussion': this._threeSixty_questionnaire['bShowPerformanceDiscussion'],
      'compAssessmentUID': compAssessmentUID,
      'compAssessmentAssessorsUID': compAssessmentAssessorsUID,
      'assesseeUUID': this._selectedAssessee.assesseeUUID,
      'bDraft': bDraft,
      'sModule': 'threesixty',
      'sFunction': 'submitThreeSixtyQuestionnaire'
    });

    this._linkUserUID = this._authService._linkUserUID;

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        // execute service calls to ensure the views have latest data result
        this._assessmentSubmittedChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'submitThreeSixtyQuestionnaire', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'submitThreeSixtyQuestionnaire'))
    );
  }

  getP5Corp_userUID() {
    return this._P5Corp_userUID;
  }

  getP5Corp_compAssessmentUID() {
    return this._compAssessmentUID;
  }

  getThreeSixtyReport(assessee: ThreeSixtyAssessee) {
    this._isLoading = true;
    this._loaderChanged.emit();
    let bPDF = false;

    /* bPDF is manipulated here as this value depicts what data should show.
     for the Assessee his data should always return all assessor data but the opposite is true for the assessor
     as it only shows the data the assessor scored. The functon getThreeSixtyReport is called in many places
     but the bPDF value is set to true only on the indivprint view */
    if (assessee['bPDF']) {
      bPDF = assessee['bPDF'];
    }

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'compAssessmentUID': assessee.compAssessmentUID,
      'assesseeUUID': assessee.assesseeUUID,
      'compAssessorTypeUID': assessee.compAssessorTypeUID,
      'assessorUUID': assessee.assessorUUID,
      'bPDF': bPDF,
      'sModule': 'threesixty',
      'sFunction': 'getThreeSixtyReport'
    });

    this._sAssesseeFullName = assessee.sAssesseeFullName;
    this._sAssesseeInitials = assessee.initials;

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._reportData = JSON.parse(JSON.stringify(result));
        this._reportChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getThreeSixtyReport', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getThreeSixtyReport'))
    );
  }

  printThreeSixtyReport(assessee: object) {

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'compAssessmentUID': assessee['compAssessmentUID'],
      'assesseeUUID': assessee['assesseeUUID'],
      'compAssessorTypeUID': assessee['compAssessorTypeUID'],
      'assessorUUID': assessee['assessorUUID'],
      'sModule': 'threesixty',
      'sFunction': 'printThreeSixtyReport'
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
      tap(_ => this._mService.handleTap(this.constructor.name, 'printThreeSixtyReport', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'printThreeSixtyReport'))
    );
  }


  downloadThreesixtyPDFForm(assessee: ThreeSixtyAssessee) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'compAssessmentUID': assessee.compAssessmentUID,
      'assesseeUUID': assessee.assesseeUUID,
      'compAssessorTypeUID': assessee.compAssessorTypeUID,
      'assessorUUID': assessee.assessorUUID,
      'P6CompanyUID': this._authService._sessionUser.P6CompanyUID,
      'sModule': 'threesixty',
      'sFunction': 'downloadThreeSixtyPDFForm'
    });

    const downloadWindow = window.open('about:blank');
    var doc = downloadWindow.document;
    doc.open("text/html");
    doc.write("<center style='position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);'><h2 style='color: #8d9098;'>Please wait while your PDF Form is downloading...</h2></center>");
    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        const sURL = JSON.parse(JSON.stringify(result));
        downloadWindow.location.href = sURL;

        setTimeout(() => {
          downloadWindow.close();
        }, 4000);

      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'downloadThreesixtyPDFForm', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'downloadThreesixtyPDFForm'))
    );
  }


  updateThreeSixtyNotifications(assesseeUUID, compAssessmentUID) {

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'compAssessmentUID': compAssessmentUID,
      'assesseeUUID': assesseeUUID,
      'sModule': 'threesixty',
      'sFunction': 'updateThreeSixtyNotifications'
    });
    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'updateThreeSixtyNotifications', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'updateThreeSixtyNotifications'))
    );
  }

}

