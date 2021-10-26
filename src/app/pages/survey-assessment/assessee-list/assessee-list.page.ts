import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AllUserSurveyAssessments, CompletedSurveyAssessments } from '../../../_models/index';
import { AuthService, LoaderService, SurveyAssessmentService } from '../../../_services/index';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-assessee-list',
  templateUrl: './assessee-list.page.html',
  styleUrls: ['./assessee-list.page.scss'],
})
export class AssesseeListPage implements OnInit, OnDestroy {

  private readonly onDestroy = new Subject<void>();

  _P5Corp_selected_compulsory: boolean;
  _logo = '';
  _background = '';
  _isLoading = false;

  _completedSurveyAssessments = new CompletedSurveyAssessments();

  _allUserSurveyAssessments: AllUserSurveyAssessments[] = [];

  constructor (public _authService: AuthService,
    private _router: Router,
    private _loaderService: LoaderService,
    private _surveyAssessmentService: SurveyAssessmentService) { }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._isLoading = true;
    this._logo = this._authService._logo;
    this._background = this._authService._background;

    this._surveyAssessmentService.getAllSurveyAssessmentsForUser()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.updateAssessments();
      });

  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  updateAssessments() {
    this._allUserSurveyAssessments = this._surveyAssessmentService._allUserSurveyAssessments;
    this._isLoading = false;
    this._loaderService.exitLoader();
  }

  getAssessmentReport(surveyDetails) {
    this._completedSurveyAssessments.assesseeUID = surveyDetails.sAssessee_fkUserUUID;
    this._completedSurveyAssessments.assessorUID = surveyDetails.sAssessee_fkUserUUID;
    this._completedSurveyAssessments.surveyAssessorTypeUID = surveyDetails.surveyAssessorType_fkSurveyAssessorTypeUID;
    this._completedSurveyAssessments.surveyHrURPRoleUID = surveyDetails.SurveyHrURPRoleUID;

    this._surveyAssessmentService._completedSurveyAssessments = this._completedSurveyAssessments;
    this._router.navigate(['/survey-assessment/report']);
  }

  getSurveyQuestionnaire(surveyDetails) {
    this._loaderService.initLoader(true);
    this._surveyAssessmentService._surveyAssessmentData['surveyHrPLIBRoleUID'] = surveyDetails['SurveyHrPLIBRole_fkSurveyHrPLIBRoleUID'];
    this._surveyAssessmentService._surveyAssessmentData['surveyHrURPRoleUID'] = surveyDetails['SurveyHrURPRoleUID'];
    this._router.navigate(['survey-assessment/invite-individuals'], { replaceUrl: true });
  }

  RouteBack() {
    this._router.navigate(['/survey-assessment/sa-category-list'], { replaceUrl: true });
  }

}
