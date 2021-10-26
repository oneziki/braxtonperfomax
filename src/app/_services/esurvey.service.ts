import { Injectable, EventEmitter } from '@angular/core';
import { AppSettings } from '../_models/index';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { EsurveyAssessment, EsurveyQuestionnaire } from '../_models/index';

import { catchError, map, tap } from 'rxjs/operators';
import { MessengerService } from '../_services/messengerservice.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class EsurveyService {

  _Esurvey_userUID = '';
  _pkiSurveyID = '';
  _sModuleType = ''; // ex. stakeholder, etc
  _sCategoryName = '';
  public _isLoading = false;

  _assessments: EsurveyAssessment[];
  _questionnaire: EsurveyQuestionnaire;
  _sConclusion = '';
  _reportData: Object = {};
  _bAssessmentCompleted = false;
  _bAssessmentClosed = false;
  _bIncludeReport = true;
  _ratedLenseData = [];
  _pkiLenseOptionId = '';
  _fkiSurveyTypeId = '';

  _selectedAssessment: EsurveyAssessment;

  _submitEsurveyQuestionnaireChange = new EventEmitter();
  _loaderChanged = new EventEmitter();
  _assessmentsChanged = new EventEmitter();
  _questionnaireChanged = new EventEmitter();
  _reportChanged = new EventEmitter();

  constructor(private _mService: MessengerService,
    private _http: HttpClient,
    private _router: Router) { }


  // SERVICE CALLS
  getEsurveyAssessmentsForUser(Esurvey_userUID: string, bRedirect: boolean, sCategoryUIDs: string = '') {

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'Esurvey_userUID': Esurvey_userUID,
      // 'sModuleType': sModuleType,
      'sCategoryUIDs': sCategoryUIDs,
      'sModule': 'esurvey',
      'sFunction': 'getEsurveyAssessmentsForUser'
    });

    this._Esurvey_userUID = Esurvey_userUID;
    // this._sModuleType = sModuleType;

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._assessments = JSON.parse(JSON.stringify(result));
        this._assessmentsChanged.emit();
        // if (bRedirect) {
        //   this._router.navigate(['esurvey']);
        // }
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getEsurveyAssessmentsForUser', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getEsurveyAssessmentsForUser'))
    );
  }

  getEsurveyAssessment(pkiSurveyID: string, fkiUserID: string, bExcludeCoverLetter: boolean) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'pkiSurveyID': pkiSurveyID,
      'Esurvey_userUID': fkiUserID,
      'bExcludeCoverLetter': bExcludeCoverLetter,
      'sModule': 'esurvey',
      'sFunction': 'getEsurveyAssessment'
    });

    this._pkiSurveyID = pkiSurveyID;
    this._Esurvey_userUID = fkiUserID;

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._questionnaire = JSON.parse(JSON.stringify(result));
        this._sConclusion = this._questionnaire.sConclusion;
        this._bAssessmentCompleted = this._questionnaire.bAssessmentCompleted;
        this._bAssessmentClosed = this._questionnaire.bAssessmentClosed;
        this._bIncludeReport = this._questionnaire.bIncludeReport;
        this._questionnaireChanged.emit();
        // this._router.navigate(['esurvey/esurvey-questionnaire']);
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getEsurveyAssessment', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getEsurveyAssessment'))
    );
  }

  submitEsurveyQuestionnaire(surveyData: string, pkiSurveyID: string,
    Esurvey_userUID: string, fkiSurveyTypeId: string,
    _portalView: string, sCategoryName: string) {

    // this._isLoading = true;
    // this._loaderChanged.emit();

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'surveyData': surveyData,
      'pkiSurveyID': pkiSurveyID,
      'Esurvey_userUID': Esurvey_userUID,
      'fkiSurveyTypeId': fkiSurveyTypeId,
      'sCategoryName': sCategoryName,
      'sModule': 'esurvey',
      'sFunction': 'submitEsurveyQuestionnaire'
    });

    this._pkiSurveyID = pkiSurveyID;
    this._Esurvey_userUID = Esurvey_userUID;
    this._fkiSurveyTypeId = fkiSurveyTypeId;
    this._sCategoryName = sCategoryName;

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._ratedLenseData = JSON.parse(JSON.stringify(result));
        this._router.navigate(['live/esurvey/esurvey-report'], { replaceUrl: true });
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'submitEsurveyQuestionnaire', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'submitEsurveyQuestionnaire'))
    );
  }

  getCompletedRatedLenseData(_portalView: string, pkiSurveyID: string, fkiUserID: string) {

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'pkiSurveyID': pkiSurveyID,
      'Esurvey_userUID': fkiUserID,
      'sModule': 'esurvey',
      'sFunction': 'getCompletedRatedLenseData'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._ratedLenseData = JSON.parse(JSON.stringify(result));
        // this was commented out, not sure why ?
        // - Andro
        // this._router.navigate([_portalView + '/esurvey/complete']);
        // this._router.navigate(['survey/esurvey/esurvey-questionnaire-complete']);
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getCompletedRatedLenseData', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getCompletedRatedLenseData'))
    );
  }

  getEsurveyAssessmentReport(pkiSurveyID: string, fkiUserID: string, pkiLenseOptionId: string) {

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'pkiSurveyID': pkiSurveyID,
      'Esurvey_userUID': fkiUserID,
      'pkiLenseOptionId': pkiLenseOptionId,
      'sModule': 'esurvey',
      'sFunction': 'getEsurveyAssessmentReport'
    });

    this._pkiSurveyID = pkiSurveyID;
    this._Esurvey_userUID = fkiUserID;
    this._pkiLenseOptionId = pkiLenseOptionId;

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._reportData = JSON.parse(JSON.stringify(result));
        this._reportChanged.emit();
        // this._router.navigate(['esurvey/esurvey-report']);
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getEsurveyAssessmentReport', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getEsurveyAssessmentReport'))
    );
  }

  printEsurveyReport(pkiSurveyID: string, fkiUserID: string, pkiLenseOptionId: string) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'pkiSurveyID': pkiSurveyID,
      'Esurvey_userUID': fkiUserID,
      'pkiLenseOptionId': pkiLenseOptionId,
      'sModule': 'esurvey',
      'sFunction': 'printEsurveyReport'
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
      tap(_ => this._mService.handleTap(this.constructor.name, 'printEsurveyReport', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'printEsurveyReport'))
    );
  }

  getModuleType() {
    return this._sModuleType;
  }

}
