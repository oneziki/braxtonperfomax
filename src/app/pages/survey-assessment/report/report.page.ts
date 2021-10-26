import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, SurveyAssessmentService, LoaderService } from '../../../_services/index';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { CompletedSurveyAssessments } from '../../../_models/index';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit, OnDestroy {

  private readonly onDestroy = new Subject<void>();

  _reportData: Object = {};
  _details: Object = {};
  _legend = [];
  _lenseData = [];
  _questionData = [];
  _commentsData = [];
  _background = '';
  _logo = '';
  _isLoading = false;
  _completedSurveyAssessments = new CompletedSurveyAssessments();

  constructor (public _authService: AuthService,
    private _surveyAssessmentService: SurveyAssessmentService,
    private _router: Router,
    private _loaderService: LoaderService) { }

  ngOnInit() {
    // this._loaderService.initLoader(true);
    // this._authService.toggleLeftMenu(false);
    // this._authService.setShowMainBackground(true);
    // this._portalView = this._authService._portalView;

    this._logo = this._authService._logo;
    this._background = this._authService._background;
    this._completedSurveyAssessments = this._surveyAssessmentService._completedSurveyAssessments;

    this._surveyAssessmentService.getSurveyAssessmentReport(this._completedSurveyAssessments)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.setReportData();
      });
  }


  ngOnDestroy() {
    this.onDestroy.next();
  }

  printSurveyAssessmentReport() {
    this._surveyAssessmentService.printSurveyAssessmentReport(this._completedSurveyAssessments)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => { });
  }

  goBackToAssessees() {
    this._router.navigate(['/survey-assessment/assessee-list'], { replaceUrl: true });
  }

  setReportData() {
    this._reportData = this._surveyAssessmentService._reportData;

    this._details = this._reportData['details'][0];
    this._lenseData = this._reportData['lenseData'];
    this._legend = this._reportData['legend'];
    this._questionData = this._reportData['questionData'];

    this._loaderService.exitLoader();
  }

  emitPrinting() {
    this.printSurveyAssessmentReport();
  }

}
