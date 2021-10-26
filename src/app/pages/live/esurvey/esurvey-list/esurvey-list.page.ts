import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings, SessionUser, EsurveyAssessment } from '../../../../_models/index';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService, EsurveyService, LoaderService } from '../../../../_services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-esurvey-list',
  templateUrl: './esurvey-list.page.html',
  styleUrls: ['./esurvey-list.page.scss'],
})
export class EsurveyListPage implements OnInit, OnDestroy {

  _selectedAppTab = '';
  _sessionUser: SessionUser;
  _assessments: EsurveyAssessment[] = [];

  private readonly onDestroy = new Subject<void>();

  constructor(
    private _router: Router,
    public _authService: AuthService,
    private _esurveyService: EsurveyService,
    private _loaderService: LoaderService) { }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._authService.hideAppPanel(true);
    this._selectedAppTab = this._authService._selectedAppTab;
    this._sessionUser = this._authService._sessionUser;
    this._assessments = this._esurveyService._assessments;

    if (!this._assessments.length) {
      this._esurveyService.getEsurveyAssessmentsForUser(this._sessionUser.Esurvey_userUID, true)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this._assessments = this._esurveyService._assessments;
        });

    } else {
      this.getEsurveyAssessment(this._assessments[0]);
    }



    this._loaderService.exitLoader();
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  getEsurveyAssessment(assessment: EsurveyAssessment) {
    // clear questionnaire
    this._esurveyService._questionnaire = {
      'pkiSurveyID': '', 'title': '', 'pages': [], 'data': {}, 'Esurvey_userUID': '',
      'fkiSurveyTypeId': '', 'sConclusion': '', 'bAssessmentCompleted': false,
      'bIncludeReport': false, 'surveyCategoryUID': '', 'sCategoryName': '', 'bAssessmentClosed': false
    };
    // set assessment
    this._esurveyService._selectedAssessment = assessment;
    // navigate to questionnaire page
    this._router.navigate([this._selectedAppTab + '/esurvey/esurvey-questionnaire'], { replaceUrl: true });
  }

  goBack() {
    this._router.navigate(['live'], { replaceUrl: true });
  }

}
