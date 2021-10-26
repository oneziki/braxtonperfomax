import { Component, OnInit } from '@angular/core';
import { AuthService, ThreeSixtyService, LoaderService } from '../../../../_services/index';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ThreeSixtyAssessee } from '../../../../_models/index';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {
  _selectedAssessee: ThreeSixtyAssessee;
  _reportData: Object = {};
  _details: Object = {};
  _pDiscussionData: Object = {};
  _legend = [];
  _lenseData = [];
  _questionData = [];
  _commentsData = [];
  // _background: string;
  // _logo: string;
  _isLoading = false;

  private readonly onDestroy = new Subject<void>();

  constructor (public _authService: AuthService,
    private _threeSixtyService: ThreeSixtyService,
    public _loaderService: LoaderService,
    private _router: Router) { }

  ngOnInit() {
    this._reportData = this._threeSixtyService._reportData;
    this._selectedAssessee = this._threeSixtyService._selectedAssessee;
    this._authService.hideAppPanel(true);

    this._threeSixtyService.getThreeSixtyReport(this._selectedAssessee)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.setReport();
      });
  }

  setReport() {
    this._selectedAssessee = this._threeSixtyService._selectedAssessee;
    this._reportData = this._threeSixtyService._reportData;
    this._details = this._reportData['details'][0];

    if (this._reportData['pDiscussionData'] && this._reportData['pDiscussionData'].length) {
      this._pDiscussionData = this._reportData['pDiscussionData'][0];
    }

    if (!this._details['sDetailsHeading'].length) {
      this._details['sDetailsHeading'] = 'Details';
    }
    if (!this._details['sLegendHeading'].length) {
      this._details['sLegendHeading'] = 'Legend';
    }
    if (!this._details['sQuestionnaireHeading'].length) {
      this._details['sQuestionnaireHeading'] = 'Questionnaire';
    }
    if (!this._details['sCommentsHeading'].length) {
      this._details['sCommentsHeading'] = 'Comments';
    }

    this._lenseData = this._reportData['lenseData'];
    this._legend = this._reportData['legend'];
    this._questionData = this._reportData['questionData'];
    this._commentsData = this._reportData['commentsData'];
    this._loaderService.exitLoader();
  }

  printThreeSixtyReport() {
    this._loaderService.initLoader(true);
    const _threesixtyPrintData = this._threeSixtyService._reportData;
    const assessee = {
      compAssessmentUID: _threesixtyPrintData['details'][0]['compAssessmentUID'],
      assesseeUUID: _threesixtyPrintData['details'][0]['assesseeUUID'],
      compAssessorTypeUID: _threesixtyPrintData['details'][0]['compAssessorTypeUID'],
      assessorUUID: _threesixtyPrintData['details'][0]['assessorUUID']
    };
    this._threeSixtyService.printThreeSixtyReport(assessee)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._loaderService.exitLoader();
      });
  }

  goBackToAssessees() {
    this._router.navigate(['grow/three-sixty/list'], { replaceUrl: true });
  }

}
