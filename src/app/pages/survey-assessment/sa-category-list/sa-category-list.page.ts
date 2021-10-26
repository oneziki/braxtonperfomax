import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService, SurveyAssessmentService, LoaderService } from '../../../_services/index';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SessionUser, SurveyAssessmentDetails } from '../../../_models/index';

import { Router } from '@angular/router';

@Component({
  selector: 'app-sa-category-list',
  templateUrl: './sa-category-list.page.html',
  styleUrls: ['./sa-category-list.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaCategoryListPage implements OnInit, OnDestroy {

  private readonly onDestroy = new Subject<void>();
  private ngUnsubscribe: Subject<any> = new Subject<any>();

  _survey_categories = [];
  _sCatUIDs = '';
  _envTheme: object;
  _sessionUser: SessionUser;
  _currentCategory = 0;
  _loadAllCategories = false;
  _bDisplayReviews = false;
  _searchText = '';

  constructor (private _surveyAssessmentService: SurveyAssessmentService,
    private router: Router,
    public _authService: AuthService,
    public _loaderService: LoaderService) { }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._authService.hideAppPanel(true);

    this._survey_categories = this._surveyAssessmentService._survey_categories;
    this._surveyAssessmentService._surveyAssessmentData = new SurveyAssessmentDetails();
    this._authService._selectedAppTab = ''

    if (this._survey_categories.length === 0) {
      this._surveyAssessmentService.getSurveyAssessmentsForCategories(this._sCatUIDs, false)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.updateSurveyCategories();
        });
    } else {
      this.updateSurveyCategories();
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.onDestroy.next();
  }

  // navTo(tab) {
  //   this._authService.toggleAppMenu(tab);
  // }

  updateSurveyCategories() {
    this._survey_categories = this._surveyAssessmentService._survey_categories;
    if (this._authService['_individualTasks']) {
      this._survey_categories.forEach(element => {
        for (let i = 0; i < this._authService['_individualTasks']['3_current'].length; i++) {
          if (this._authService['_individualTasks']['3_current'][i]['sSubModule'] === 'surveyAssessment' &&
            element['surveyAssessmentCategoryUID'] === this._authService['_individualTasks']['3_current'][i]['surveyAssessmentCategory_fkSurveyAssessmentCategoryUID']) {
            element['bCompulsory'] = 1;
          }
        }
      });
    }

    this._loaderService.exitLoader();
  }

  setCategory(i) {
    this._currentCategory = i;
    if (i === -1) {
      this._bDisplayReviews = false;
    } else {
      this._bDisplayReviews = true;
    }
  }

  getSurveyAssessmentData(surveyRoles) {
    if (surveyRoles['bInviteOthers'] === 1) {
      this._surveyAssessmentService._surveyAssessmentData['surveyHrPLIBRoleUID'] = surveyRoles['SurveyHrPLIBRoleUID'];
      this.router.navigate(['survey-assessment/invite-individuals']);
    } else {
      this._surveyAssessmentService.allocateSurveyProfile(surveyRoles['SurveyHrPLIBRoleUID'])
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this._authService._linkSurveyUID = this._surveyAssessmentService._surveyAssessmentData['surveyHrURPRoleUID'];
          this._authService._linkUserUID = this._surveyAssessmentService._surveyAssessmentData['surveyAssessmentAssessorsUID'];

          this.router.navigate(['survey-assessment/questionnaire']);
        });
    }

    // ## remove when done

    // completed IDS //
    // this._authService._linkSurveyUID = '7985FB60-DB7E-9EB1-A26E4A2DDE25961D';
    // this._authService._linkUserUID = '7985FB61-A4F1-6C1B-66E85D5956CE0EBB';
    //// navigate to assessee list
    // this.router.navigate(['survey-assessment/assessee-list']);

    // to complete //
    // this._authService._linkSurveyUID = 'D598E969-D83F-1EE8-C88CFFD315D4B500';
    // this._authService._linkUserUID = 'D598E96A-ABC8-2BBE-551898D36F603C7A';
    //// navigate to questionnaire
    // this.router.navigate(['survey-assessment/questionnaire']);

    // ## 
  }


  loadAllCategories() {
    this._loadAllCategories = (this._loadAllCategories === true) ? false : true;
  }

}
