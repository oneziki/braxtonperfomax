import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as Survey from 'survey-angular';
import { ThreeSixtyAssessee, ThreeSixtyQuestionnaire } from '../../../../_models/index';
import { AuthService, LoaderService, ThreeSixtyService } from '../../../../_services/index';
@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.page.html',
  styleUrls: ['./questionnaire.page.scss'],
})
export class QuestionnairePage implements OnInit, OnDestroy {


  private readonly onDestroy = new Subject<void>();
  private ngUnsubscribe: Subject<any> = new Subject<any>();
  // private TSSubscription: Subscription;
  private TSSubscriptionB: Subscription;

  public _questionnaireTitle: string;
  public _sAssesseeFullName: string;
  public _sAssesseeInitials: string;

  _tabs: {};
  _logo: string;
  _background: string;
  _threeSixty_questionnaire: ThreeSixtyQuestionnaire;
  _selectedAssessee: ThreeSixtyAssessee;
  _isLoading: false;
  _bShowStatus: false;

  _showImage = true;
  survey = new Survey.Model();

  constructor(public _authService: AuthService,
    private _loaderService: LoaderService,
    public _threeSixtyService: ThreeSixtyService,
    private _router: Router) {
    this.TSSubscriptionB = this._threeSixtyService._assessmentSubmittedChanged.subscribe(value => this.goBackToAssessees());
  }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._threeSixty_questionnaire = this._threeSixtyService._threeSixty_questionnaire;
    this._selectedAssessee = this._threeSixtyService._selectedAssessee;
    this._authService.hideAppPanel(true);
    if (this._threeSixty_questionnaire.compAssessmentUID === '') {

      this._threeSixtyService.getThreeSixtyQuestionnaireForAssessor(this._selectedAssessee)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.setQuestionnaire()
        });
    } else {
      this.setQuestionnaire();
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.TSSubscriptionB.unsubscribe();
  }

  setQuestionnaire() {
    this._loaderService.initLoader(true);
    this._threeSixty_questionnaire = this._threeSixtyService._threeSixty_questionnaire;
    this._selectedAssessee = this._threeSixtyService._selectedAssessee;
    this._tabs = {
      current: 0,
      data: ['Select Individual', 'Complete Assessment'],
    };
    this._logo = this._authService._logo;
    this._background = this._authService._background;
    this._threeSixty_questionnaire = this._threeSixtyService._threeSixty_questionnaire;
    this._questionnaireTitle = this._threeSixty_questionnaire.title;
    this._threeSixty_questionnaire.title = '';

    this._sAssesseeFullName = this._threeSixtyService._sAssesseeFullName;
    this._sAssesseeInitials = this._threeSixtyService._sAssesseeInitials;

    Survey.StylesManager.applyTheme('bootstrap');
    const myCss = {
      matrix: { root: 'table table-coltwo' },
      navigationButton: 'btn btn-primary m-l-5',
    };

    const surveyStrings = {
      requiredInAllRowsError:
        'Please ensure you have answered all the questions below',
    };
    this.survey = new Survey.Model(this._threeSixty_questionnaire);
    this.survey.data = this._threeSixty_questionnaire['data']; // set draft data
    this.survey.showProgressBar = 'top';
    this.survey.showCompletedPage = false;
    this.survey.showQuestionNumbers = 'off';
    this.survey.locale = 'custom';

    Survey.surveyLocalization.locales['custom'] = surveyStrings;

    // set local variables for service http call
    this.survey.setVariable('_authService', this._authService);
    this.survey.setVariable('_threeSixtyService', this._threeSixtyService);
    this.survey.setVariable('_router', this._router);
    if (this._threeSixty_questionnaire !== undefined) {
      this.survey.setVariable(
        'compAssessmentUID',
        this._threeSixty_questionnaire.compAssessmentUID
      );
      this.survey.setVariable(
        'compAssessmentAssessorsUID',
        this._threeSixty_questionnaire.compAssessmentAssessorsUID
      );
    }

    this.survey.onComplete.add(this.surveyOnComplete);
    Survey.SurveyNG.render('surveyElement', { model: this.survey, css: myCss });
    this._loaderService.exitLoader();
  }


  saveSurveyDraft() {
    this._loaderService.initLoader(true);
    const _surveyData = JSON.stringify(this.survey['data']);
    const _compAssessmentUID = this._threeSixty_questionnaire.compAssessmentUID;
    const _compAssessmentAssessorsUID = this._threeSixty_questionnaire.compAssessmentAssessorsUID;

    this._threeSixtyService.submitThreeSixtyQuestionnaire(_surveyData, _compAssessmentUID, _compAssessmentAssessorsUID, true).subscribe();

  }

  surveyOnComplete(survey,) {
    this._questionnaireTitle = '';
    const _authService = survey.getVariable('_authService');
    const _threeSixtyService = survey.getVariable('_threeSixtyService');
    const _router = survey.getVariable('_router');

    if (survey.data['evidence'] && survey.data['evidence'].length) {
      // the below code is used for removing the base64 string so that the file can be saved on the backend
      survey.data['evidence'][0]['type'] = survey.data['evidence'][0]['name'].split('.')
      [survey.data['evidence'][0]['name'].split('.').length - 1];

      survey.data['evidence'][0]['content'] = survey.data['evidence'][0]['content'].split(',')
      [survey.data['evidence'][0]['content'].split(',').length - 1];
    }

    const _surveyData = JSON.stringify(survey.data);
    const _compAssessmentUID = survey.getVariable('compAssessmentUID');
    const _compAssessmentAssessorsUID = survey.getVariable('compAssessmentAssessorsUID');

    _threeSixtyService.submitThreeSixtyQuestionnaire(_surveyData, _compAssessmentUID, _compAssessmentAssessorsUID, false).subscribe();
  }

  assesseeDefaultImg() {
    this._showImage = false;
  }
  goBackToAssessees() {
    if (this._threeSixtyService._threeSixty_assessees_pending.length === 1) {
      this._router.navigate(['grow'], { replaceUrl: true });
    } else {
      this._router.navigate(['grow/three-sixty/list'], { replaceUrl: true });
    }

  }
}
