import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { showdown } from '@jhuix/showdowns';
import {
  AuthService,
  LoaderService,
  ExpertiseReviewService,
} from '../../../../_services/index';
import * as Survey from 'survey-angular';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { ExpertiseReviewQuestionnaire, ExpertiseReviewAssessee } from '../../../../_models/expertise-review';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.page.html',
  styleUrls: ['./questionnaire.page.scss'],
})
export class QuestionnairePage implements OnInit {

  private readonly onDestroy = new Subject<void>();
  private ngUnsubscribe: Subject<any> = new Subject<any>();
  private TSSubscription: Subscription;
  private TSSubscriptionB: Subscription;

  public _questionnaireTitle: string;
  public _sAssesseeFullName: string;
  public _sAssesseeInitials: string;

  // _portalView: string;
  _tabs: {};
  _logo: string;
  _background: string;
  _expertise_review_questionnaire: ExpertiseReviewQuestionnaire;
  _selectedAssessee: ExpertiseReviewAssessee;
  _isLoading: false;
  _bShowStatus: false;

  _showImage = true;

  survey = new Survey.Model();

  constructor(
    public _authService: AuthService,
    private _loaderService: LoaderService,
    public _expertiseReviewService: ExpertiseReviewService,
    private _router: Router
  ) {
    this.TSSubscriptionB = this._expertiseReviewService._assessmentSubmittedChanged.subscribe(
      (value) => this.goBackToAssessees()
    );
  }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._authService.hideAppPanel(true);

    this._expertise_review_questionnaire = this._expertiseReviewService._expertise_review_questionnaire;
    this._selectedAssessee = this._expertiseReviewService._selectedAssessee;

    if (this._expertise_review_questionnaire.skillsAssessmentUID === '') {

      this._expertiseReviewService.getExpertiseReviewQuestionnaireForAssessor(this._selectedAssessee)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.setQuestionnaire();
        });
    } else {
      this.setQuestionnaire();
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.TSSubscriptionB.unsubscribe();
    // this._authService.setShowMainBackground(false);
  }

  setQuestionnaire() {
    this._loaderService.initLoader(true);
    // this._portalView = this._authService._portalView;
    this._expertise_review_questionnaire = this._expertiseReviewService._expertise_review_questionnaire;
    this._selectedAssessee = this._expertiseReviewService._selectedAssessee;
    this._tabs = {
      current: 0,
      data: ['Select Individual', 'Complete Assessment']
    };
    this._logo = this._authService._logo;
    this._background = this._authService._background;
    this._expertise_review_questionnaire = this._expertiseReviewService._expertise_review_questionnaire;
    this._questionnaireTitle = this._expertise_review_questionnaire.title;
    this._expertise_review_questionnaire.title = '';

    this._sAssesseeFullName = this._expertiseReviewService._sAssesseeFullName;
    this._sAssesseeInitials = this._expertiseReviewService._sAssesseeInitials;
    Survey.JsonObject.metaData.addProperty('questionbase', 'tooltip');

    Survey.StylesManager.applyTheme('bootstrap');
    const myCss = {
      matrix: { root: 'table table-coltwo' },
      navigationButton: 'btn btn-primary m-l-5'
    };

    const surveyStrings = { requiredInAllRowsError: 'Please ensure you have answered all the questions below' };
    this.survey = new Survey.Model(this._expertise_review_questionnaire);
    this.survey.data = this._expertise_review_questionnaire['data']; // set draft data
    this.survey.showProgressBar = 'top';
    this.survey.showCompletedPage = false;
    this.survey.showQuestionNumbers = 'off';

    this.survey.locale = 'custom';
    Survey.surveyLocalization.locales['custom'] = surveyStrings;

    // set local variables for service http call
    this.survey.setVariable('_authService', this._authService);
    this.survey.setVariable(
      '_expertiseReviewService',
      this._expertiseReviewService
    );
    this.survey.setVariable('_router', this._router);
    if (this._expertise_review_questionnaire !== undefined) {
      this.survey.setVariable(
        'skillsAssessmentUID',
        this._expertise_review_questionnaire.skillsAssessmentUID
      );
      this.survey.setVariable(
        'skillsAssessmentAssessorsUID',
        this._expertise_review_questionnaire.skillsAssessmentAssessorsUID
      );
    }

    // Create showdown mardown converter

    var converter = new showdown.Converter();
    this.survey.onTextMarkdown.add(function (survey, options) {
      //convert the mardown text to html
      var str = converter.makeHtml(options.text);
      // remove root paragraphs <p></p>
      // str = str.substring(3);
      // str = str.substring(0, str.length - 4);
      //set html
      options.html = str;
    });

    this.survey.onAfterRenderQuestion.add(function (survey, options) {
      // console.log("options", options);
      // Return if there is no description to show in popup
      if (!options.question.tooltip) return;

      var header = options.htmlElement.querySelector('h5');
      header.title = options.question.tooltip;

      var span = document.createElement('span');
      span.innerText = '?';
      span.className = 'survey-tooltip';
      header.appendChild(span);
    });

    this.survey.onAfterRenderPanel.add(function (survey, options) {
      // Return if there is no description to show in popup
      if (!options.panel.tooltip) return;

      var header = options.htmlElement.querySelector('h4'); // for panel we have h4
      if (!!header) {
        // title is element attribute and you have to use setAttribute function
        header.setAttribute('title', options.panel.tooltip);
      }
    });
    this.survey.onComplete.add(this.surveyOnComplete);
    Survey.SurveyNG.render('surveyElement', { model: this.survey, css: myCss });
    this._loaderService.exitLoader();
  }

  goBackToAssessees() {
    if (this._expertiseReviewService._expertise_review_assessees_pending.length === 1) {
      this._router.navigate(['grow'], { replaceUrl: true });
    } else {
      this._router.navigate(['grow/expertise-review/assessee'], { replaceUrl: true });
    }

  }

  // Create showdown mardown converter

  surveyOnComplete(survey) {
    this._questionnaireTitle = '';
    const _expertiseReviewService = survey.getVariable('_expertiseReviewService');
    const _surveyData = JSON.stringify(survey.data);
    const _skillsAssessmentUID = survey.getVariable('skillsAssessmentUID');
    const _skillsAssessmentAssessorsUID = survey.getVariable('skillsAssessmentAssessorsUID');
    _expertiseReviewService.submitExpertiseReviewData(_surveyData, _skillsAssessmentUID, _skillsAssessmentAssessorsUID).subscribe();
  }

  assesseeDefaultImg() {
    this._showImage = false;
  }


}
