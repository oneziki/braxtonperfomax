import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  SessionUser, SurveyCategory, AppSettings,
  SurveyEmployeeInviteData, AllUserSurveyAssessments, SurveyAssessmentDetails, CompletedSurveyAssessments
} from '../_models/index';
import { AuthService } from '../_services/auth.service';
import { Subscription } from 'rxjs';

import { catchError, map, tap } from 'rxjs/operators';
import { MessengerService } from '../_services/messengerservice.service';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class SurveyAssessmentService implements OnDestroy {

  private AUTHSubscription: Subscription;

  _sessionUser: SessionUser;
  _survey_categories: SurveyCategory[] = [];
  _survey_categorieUIDs = [];
  _surveyEmployeeInviteData = new SurveyEmployeeInviteData();
  _surveyAssessmentData = new SurveyAssessmentDetails();
  _selfAssessmentQuestionnaire = [];
  _completedSurveyAssessments = new CompletedSurveyAssessments();
  _allUserSurveyAssessments: AllUserSurveyAssessments[] = [];

  _selfAssessmentSubmittedChanged = new EventEmitter();

  _survey_categories_Changed = new EventEmitter();
  _reportData: Object = {};

  constructor(private _mService: MessengerService,
    private _http: HttpClient,
    private _router: Router,
    public _authService: AuthService) {
    this.AUTHSubscription = this._authService._userSessionChanged.subscribe(value => this.updateSessionUser());
    this._sessionUser = this._authService._sessionUser;
  }

  ngOnDestroy() {
    this.AUTHSubscription.unsubscribe();
  }

  updateSessionUser() {
    this._sessionUser = this._authService._sessionUser;
  }


  getSurveyAssessmentsForCategories(sCatUIDs: string, bRedirect: boolean) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'P5Corp_userUID': this._sessionUser.P5Corp_userUID,
      'Esurvey_userUID': this._sessionUser.Esurvey_userUID,
      'sCategoryUIDs': sCatUIDs,
      'surveyCategoryUIDs': this._survey_categorieUIDs,
      'bIsManager': false,
      'sModule': 'surveys',
      'sFunction': 'getSurveyAssessmentsForCategories'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._survey_categories = JSON.parse(JSON.stringify(result));

        if (bRedirect) {
          this._router.navigate(['survey-assessment']);
        } else {
          this._survey_categories_Changed.emit();
        }
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getSurveyAssessmentsForCategories', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getSurveyAssessmentsForCategories'))
    );
  }

  getSurveyEmployeeInviteData(SurveyHrPLIBRoleUID, surveyHrURPRoleUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'P5Corp_userUID': this._sessionUser.P5Corp_userUID,
      'P5ClientUID': this._sessionUser.P5ClientUID,
      'sModule': 'surveyAssessment',
      'sFunction': 'getSurveyEmployeeInviteData',
      'SurveyHrPLIBRoleUID': SurveyHrPLIBRoleUID,
      'surveyHrURPRoleUID': surveyHrURPRoleUID
    });
    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._surveyEmployeeInviteData = JSON.parse(JSON.stringify(result));
        this._surveyAssessmentData['surveyHrURPRoleUID'] = surveyHrURPRoleUID;
        this._surveyAssessmentData['SurveyHrPLIBRoleUID'] = SurveyHrPLIBRoleUID;
        this._surveyAssessmentData['surveyAssessmentAssessorsUID'] = this._surveyEmployeeInviteData['surveyDetails']['surveyAssessmentAssessorsUID'];

        // this._surveyEmployeeInviteDataChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getSurveyEmployeeInviteData', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getSurveyEmployeeInviteData'))
    );
  }

  allocateSurveyProfile(SurveyHrPLIBRoleUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'P5Corp_userUID': this._sessionUser.P5Corp_userUID,
      'P5ClientUID': this._sessionUser.P5ClientUID,
      'sModule': 'surveyAssessment',
      'sFunction': 'allocateSurveyProfile',
      'SurveyHrPLIBRoleUID': SurveyHrPLIBRoleUID,
    });
    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._surveyAssessmentData = JSON.parse(JSON.stringify(result));
        // this._surveyAllocatecdatachanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'allocateSurveyProfile', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'allocateSurveyProfile'))
    );
  }

  submitInvitedAssessors(invitedAssessors, removedAssessors, surveyHrURPRoleUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'P5Corp_userUID': this._sessionUser.P5Corp_userUID,
      'sModule': 'surveyAssessment',
      'sFunction': 'submitInvitedAssessors',
      'surveyHrURPRoleUID': surveyHrURPRoleUID,
      'invitedAssessors': invitedAssessors,
      'removedAssessors': removedAssessors,
      'P5ClientUID': this._sessionUser.P5ClientUID,
    });
    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        const returnValue = JSON.parse(JSON.stringify(result));
        // this._submitInvitedAssessordatachanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'submitInvitedAssessors', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'submitInvitedAssessors'))
    );
  }

  getSurveyAssessmentQuestionnaire(surveyHrURPRoleUID, surveyAssessmentAssessorsUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'surveyAssessment',
      'sFunction': 'getSurveyAssessmentQuestionnaire',
      'surveyHrURPRoleUID': surveyHrURPRoleUID,
      'surveyAssessmentAssessorsUID': surveyAssessmentAssessorsUID,
    });
    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._selfAssessmentQuestionnaire = JSON.parse(JSON.stringify(result));
        // this._getSurveyAssessmentQuestionnaireChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getSurveyAssessmentQuestionnaire', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getSurveyAssessmentQuestionnaire'))
    );
  }

  submitSurveyAssessmentQuestionnaire(surveyData, assessmentAssessorData, bDraft) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'surveyData': surveyData,
      'assessmentAssessorData': assessmentAssessorData,
      'bDraft': bDraft,
      'sModule': 'surveyAssessment',
      'sFunction': 'submitSurveyAssessmentQuestionnaire'
    });
    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._selfAssessmentSubmittedChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'submitSurveyAssessmentQuestionnaire', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'submitSurveyAssessmentQuestionnaire'))
    );
  }

  getSurveyAssessmentReport(reportData) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'reportData': reportData,
      'sModule': 'surveyAssessment',
      'sFunction': 'getSurveyAssessmentReport'
    });
    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._reportData = JSON.parse(JSON.stringify(result));
        // this._reportData_Changed.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getSurveyAssessmentReport', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getSurveyAssessmentReport'))
    );
  }

  printSurveyAssessmentReport(reportData) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'reportData': reportData,
      'sModule': 'surveyAssessment',
      'sFunction': 'printSurveyAssessmentReport'
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
      tap(_ => this._mService.handleTap(this.constructor.name, 'printSurveyAssessmentReport', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'printSurveyAssessmentReport'))
    );
  }

  declineAssessmentInvite(surveyHrURPRoleUID, surveyAssessmentAssessorsUID, sDeclineReason) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'surveyHrURPRoleUID': surveyHrURPRoleUID,
      'surveyAssessmentAssessorsUID': surveyAssessmentAssessorsUID,
      'sDeclineReason': sDeclineReason,
      'sModule': 'surveyAssessment',
      'sFunction': 'declineAssessmentInvite'
    });
    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        // this._declineAssessmentChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'declineAssessmentInvite', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'declineAssessmentInvite'))
    );
  }

  getAllSurveyAssessmentsForUser() {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'P5Corp_userUID': this._sessionUser.P5Corp_userUID,
      'sModule': 'surveyAssessment',
      'sFunction': 'getAllSurveyAssessmentsForUser'
    });
    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._allUserSurveyAssessments = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getAllSurveyAssessmentsForUser', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getAllSurveyAssessmentsForUser'))
    );
  }

}
