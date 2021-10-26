import { Injectable, OnDestroy, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings, SessionUser, JobTitleRoleProfile, RecruitmentQuestionnaire, RecruitmentAssessment, RecruitmentAssessee } from '../_models/index';
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
export class RecruitmentService implements OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();
  private AUTHSubscription: Subscription;

  _sessionUser: SessionUser;
  _selectedJobTitle = '';
  _selectedCompHrPlibRole = '';
  _assessorUID = '';
  _assesseeUID = '';
  _vacancies: JobTitleRoleProfile[] = [];
  _vacancy: JobTitleRoleProfile;
  _recruitment_assessees_pending: RecruitmentAssessee[] = [];
  _recruitment_assessees_completed: RecruitmentAssessee[] = [];
  _recruitment_questionnaire: RecruitmentQuestionnaire;
  _OrgDepartments = [];
  _applicantVacancyData: RecruitmentAssessment[] = [];

  public _bExternalLink = false;
  public _linkUserUID = '';
  public _sAssesseeFullName = '';
  public _sAssesseeInitials = '';
  _reportData: Object = {};

  public _selectedAssessment: RecruitmentAssessment;
  public _selectedAssessee: RecruitmentAssessee;

  // _threeSixty_assessments: ThreeSixtyAssessment[] = [];
  _reportChanged = new EventEmitter();
  _assesseesChanged = new EventEmitter();
  _recruitmentDataChanged = new EventEmitter();
  _OrgDepartmentsChanged = new EventEmitter();
  _vacancyDataChanged = new EventEmitter();
  _questionnaireDataChanged = new EventEmitter()
  _assessmentSubmittedChanged = new EventEmitter();
  _applicantVacancyDataChanged = new EventEmitter();

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
    this._vacancies = [];
    this._OrgDepartments = [];
  }

  getRecruitmentAssesseesForAssessor(JobTitleRoleUID: string, sAssessorInternal_fkUserUUID: string, bRedirect: boolean, _bExternalLink: boolean = false) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'JobTitleRoleUID': JobTitleRoleUID,
      'sAssessorInternal_fkUserUUID': sAssessorInternal_fkUserUUID,
      'sModule': 'recruitment',
      'sPortalTab': this._authService._KRAView,
      'sFunction': 'getRecruitmentAssesseesForAssessor',
      'bExternalLink': false
    });

    this._selectedJobTitle = JobTitleRoleUID;
    this._bExternalLink = _bExternalLink;

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        const recruitment_assessees = JSON.parse(JSON.stringify(result));

        this._recruitment_assessees_pending = recruitment_assessees['pendingAssessees'];
        this._recruitment_assessees_completed = recruitment_assessees['completedAssessees'];
        this._assesseesChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getRecruitmentAssesseesForAssessor', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getRecruitmentAssesseesForAssessor'))
    );
  }

  getAllVacancies() {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'recruitment',
      'P5Corp_userUID': this._authService._sessionUser.P5Corp_userUID,
      'sFunction': 'getAllVacancies',
      'bExternalLink': false,
      'ClientUID': this._authService._sessionUser.P5ClientUID
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._vacancies = JSON.parse(JSON.stringify(result));
        this._recruitmentDataChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getAllVacancies', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getAllVacancies'))
    );
  }

  getVacancyDepartments() {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'recruitment',
      'P5Corp_userUID': this._authService._sessionUser.P5Corp_userUID,
      'sFunction': 'getVacancyDepartments',
      'bExternalLink': false,
      'ClientUID': this._authService._sessionUser.P5ClientUID

    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._OrgDepartments = JSON.parse(JSON.stringify(result));
        this._OrgDepartmentsChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getVacancyDepartments', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getVacancyDepartments'))
    );
  }

  getVacancyData() {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'recruitment',
      'JobTitleRoleUID': this._selectedJobTitle,
      'sFunction': 'getVacancyData'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._vacancy = JSON.parse(JSON.stringify(result));
        this._vacancyDataChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getVacancyData', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getVacancyData'))
    );
  }

  getRecruitmentApplicationData() {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'recruitment',
      'JobTitleRoleUID': this._selectedJobTitle,
      'sPortalTab': 'Personal',
      'sAssessorUID': this._authService._sessionUser.P5Corp_userUID,
      'sFunction': 'getRecruitmentApplicationData'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._applicantVacancyData = JSON.parse(JSON.stringify(result));
        this._applicantVacancyDataChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getRecruitmentApplicationData', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getRecruitmentApplicationData'))
    );
  }


  getRecruitmentQuestionnaireForAssessor(assessee: RecruitmentAssessee) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'recruitment',
      'compAssessorTypeUID': assessee.compAssessorTypeUID,
      'JobTitleRoleUID': assessee.JobTitleRoleUID,
      'assesseeUUID': assessee.assesseeUUID,
      'assessorUUID': assessee.assessorUUID,
      'sFunction': 'getRecruitmentQuestionnaireForAssessor',
      'P5Corp_userUID': this._authService._sessionUser.P5Corp_userUID,
      'bExternalLink': false
    });
    this._sAssesseeFullName = assessee.sAssesseeFullName;
    this._sAssesseeInitials = assessee.initials;
    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._recruitment_questionnaire = JSON.parse(JSON.stringify(result));
        this._questionnaireDataChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getRecruitmentQuestionnaireForAssessor', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getRecruitmentQuestionnaireForAssessor'))
    );
  }

  submitRecruitmentQuestionnaire(surveyData, compAssessmentUID, skillsAssessmentUID, compAssessorTypeUID, sRoleName, assessorUUID, assesseeUUID, jobTitleRoleUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'surveyData': surveyData,
      'compAssessmentUID': compAssessmentUID,
      'skillsAssessmentUID': skillsAssessmentUID,
      'compAssessorTypeUID': compAssessorTypeUID,
      'sRoleName': sRoleName,
      'jobTitleRoleUID': jobTitleRoleUID,
      'assessorUUID': assessorUUID,
      'assesseeUUID': assesseeUUID,
      'ClientUID': this._authService._sessionUser.P5ClientUID,
      'sModule': 'recruitment',
      'sFunction': 'submitRecruitmentQuestionnaire'
    });


    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._assessmentSubmittedChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'submitRecruitmentQuestionnaire', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'submitRecruitmentQuestionnaire'))
    );
  }

  printApplicantVacancyReport(JobTitleRoleUID, assesseeUUID, assessorUUID, compAssessorTypeUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'recruitment',
      'JobTitleRoleUID': JobTitleRoleUID,
      'assesseeUUID': assesseeUUID,
      'assessorUUID': assessorUUID,
      'compAssessorTypeUID': compAssessorTypeUID,
      'bPDF': true,
      'P5Corp_userUID': this._authService._sessionUser.P5Corp_userUID,
      'sFunction': 'printApplicantVacancyReport'
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
      tap(_ => this._mService.handleTap(this.constructor.name, 'printApplicantVacancyReport', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'printApplicantVacancyReport'))
    );
  }

  printRoleProfileReport(JobTitleUUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'setup',
      'subModule': 'corporateTools',
      'secondSubModule': 'corporateTools_JobTitleRole',
      'JobTitleUUID': JobTitleUUID,
      'P5Corp_userUID': this._authService._sessionUser ? this._authService._sessionUser.P5Corp_userUID : '',
      'ClientUID': this._authService._sessionUser.P5ClientUID,
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

  getRecruitmentReport(assessee: RecruitmentAssessee) {
    let bPDF = false;

    /* bPDF is manipulated here as this value depicts what data should show.
     for the Assessee his data should always return all assessor data but the opposite is true for the assessor
     as it only shows the data the assessor scored. The functon getThreeSixtyReport is called in many places
     but the bPDF value is set to true only on the indivprint view */


    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'JobTitleRoleUID': assessee.JobTitleRoleUID,
      'assesseeUUID': assessee.assesseeUUID,
      'assessorUUID': assessee.assessorUUID,
      'compAssessorTypeUID': assessee.compAssessorTypeUID,
      'P5Corp_userUID': this._authService._sessionUser.P5Corp_userUID,
      'bPDF': bPDF,
      'sModule': 'recruitment',
      'sFunction': 'getRecruitmentReport'
    });

    this._sAssesseeFullName = assessee.sAssesseeFullName;
    this._sAssesseeInitials = assessee.initials;

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._reportData = JSON.parse(JSON.stringify(result));
        this._reportChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getRecruitmentReport', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getRecruitmentReport'))
    );
  }

  printRecruitmentReport(assessee: object) {

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'JobTitleRoleUID': assessee['JobTitleRoleUID'],
      'assesseeUUID': assessee['assesseeUUID'],
      'assessorUUID': assessee['assessorUUID'],
      'P5Corp_userUID': this._authService._sessionUser.P5Corp_userUID,
      'compAssessorTypeUID': assessee['compAssessorTypeUID'],
      'ClientUID': this._authService._sessionUser.P5ClientUID,
      'sModule': 'recruitment',
      'sFunction': 'printRecruitmentReport'
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
      tap(_ => this._mService.handleTap(this.constructor.name, 'printRecruitmentReport', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'printRecruitmentReport'))
    );
  }

}
