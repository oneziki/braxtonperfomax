import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, EsurveyService, LoaderService, PrintToolService } from '../../../../_services/index';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-esurvey-report',
  templateUrl: './esurvey-report.page.html',
  styleUrls: ['./esurvey-report.page.scss'],
})
export class EsurveyReportPage implements OnInit, OnDestroy {

  _reportData: Object = {};
  _details: Object = {};
  _legend = [];
  _lenseData = [];
  _questionData = [];
  _commentsData = [];
  _recommendationData = [];
  _bIncludePageBreaks: boolean;
  _bGroupReportComments: boolean;
  _pkiSurveyID = '';
  _Esurvey_userUID = '';
  _pkiLenseOptionId = '';
  _fkiSurveyTypeId = '';
  _selectedAppTab = '';

  private readonly onDestroy = new Subject<void>();

  constructor(public _authService: AuthService,
    private _loaderService: LoaderService,
    private _esurveyService: EsurveyService,
    private _printtoolService: PrintToolService,
    private _router: Router) { }

  ngOnInit() {
    this._loaderService.initLoader();
    this._reportData = this._esurveyService._reportData;
    this._pkiSurveyID = this._esurveyService._pkiSurveyID;
    this._Esurvey_userUID = this._esurveyService._Esurvey_userUID;
    this._pkiLenseOptionId = this._esurveyService._pkiLenseOptionId;
    this._fkiSurveyTypeId = this._esurveyService._fkiSurveyTypeId.toString();
    this._selectedAppTab = this._authService._selectedAppTab;

    if (this.isEmpty(this._reportData)) {
      this._esurveyService.getEsurveyAssessmentReport(this._pkiSurveyID, this._Esurvey_userUID, this._pkiLenseOptionId)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._reportData = this._esurveyService._reportData;
        this.setReportData();
      });
    } else {
      this.setReportData();
    }
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  setReportData() {
    this._details = this._reportData['details'][0];
    this._lenseData = this._reportData['lenseData'];
    this._legend = this._reportData['legend'];
    this._questionData = this._reportData['questionData'];
    this._commentsData = this._reportData['commentsData'];
    this._recommendationData = this._reportData['recommendationData'];
    this._bIncludePageBreaks = this._details['bIncludePageBreaks'];
    this._bGroupReportComments = this._details['bGroupReportComments'];
    
    this._loaderService.exitLoader();
  }

  printEsurveyReport() {
    if (this._Esurvey_userUID) {
      this._esurveyService.printEsurveyReport(this._pkiSurveyID,
        this._Esurvey_userUID, this._pkiLenseOptionId)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          // this.ngOnInit();
        });;
    }
  }

  isEmpty(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  goBack() {
    if (this._authService._isActivitySummaryPage) {
      this._router.navigate(['activity-summary'], { replaceUrl: true });
    } else {
      this._router.navigate(['live'], { replaceUrl: true });
    }
  }

}
