import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { AuthService, LoaderService, EsurveyService, KraService } from '../../../../_services/index';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import * as Survey from 'survey-angular';
import { EsurveyQuestionnaire, EsurveyAssessment } from '../../../../_models/index';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-esurvey-questionnaire',
  templateUrl: './esurvey-questionnaire.page.html',
  styleUrls: ['./esurvey-questionnaire.page.scss'],
})
export class EsurveyQuestionnairePage implements OnInit, OnDestroy {

  _selectedAppTab = '';
  _questionnaire: EsurveyQuestionnaire;
  _selectedAssessment: EsurveyAssessment;
  _employeeDetails: object;
  _showImage = true;

  private readonly onDestroy = new Subject<void>();

  constructor (
    private _router: Router,
    public _authService: AuthService,
    private _esurveyService: EsurveyService,
    private _loaderService: LoaderService,
    public _kraService: KraService) { }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._authService.hideAppPanel(true);
    this._selectedAppTab = this._authService._selectedAppTab;
    this._questionnaire = this._esurveyService._questionnaire;
    this._selectedAssessment = this._esurveyService._selectedAssessment;

    if (this._questionnaire && this._questionnaire.pkiSurveyID === '') {
      this._esurveyService.getEsurveyAssessment(this._selectedAssessment.pkiSurveyID, this._selectedAssessment.fkiUserID, false)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.setQuestionnaire();
        });
    } else {
      this.setQuestionnaire();
    }

  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  setQuestionnaire() {
    this._questionnaire = this._esurveyService._questionnaire;
    this._selectedAssessment = this._esurveyService._selectedAssessment;

    Survey.StylesManager.applyTheme('bootstrap');
    const myCss = {
      matrix: { root: 'table table-coltwo' },
      navigationButton: 'btn btn-primary m-l-5'
    };

    if (this._questionnaire.bAssessmentCompleted || this._questionnaire.bAssessmentClosed) {
      this._esurveyService._fkiSurveyTypeId = this._questionnaire.fkiSurveyTypeId;
      this._esurveyService.getCompletedRatedLenseData(
        this._selectedAppTab,
        this._questionnaire.pkiSurveyID,
        this._questionnaire.Esurvey_userUID
      ).subscribe();
    } else {

      // eslint-disable-next-line prefer-const
      let surveyStrings = { requiredInAllRowsError: 'Please ensure you have answered all the questions below' };
      const surveyjs_questionnaire = {};
      surveyjs_questionnaire['pages'] = this._questionnaire.pages;
      surveyjs_questionnaire['title'] = this._questionnaire.title;


      const survey = new Survey.Model(surveyjs_questionnaire);

      survey.onTextMarkdown.add(function (survey, options) {

        let str = options.text;
        if (str.indexOf("<TEXTFORMAT") > -1) {
          let res = str;
          options.html = res;
        }
      });

      survey.questionTitleTemplate = '{title}',
        survey.requiredText = ' ';
      survey.showProgressBar = 'top';
      survey.showCompletedPage = false;
      survey.focusFirstQuestionAutomatic = true;
      survey.showPageTitles = false;
      survey.showQuestionNumbers = '';
      survey.questionTitleLocation = 'top';
      survey.locale = 'custom';
      survey.clearInvisibleValues = 'none';

      Survey.surveyLocalization.locales['custom'] = surveyStrings;

      survey.setVariable('_esurveyService', this._esurveyService);
      survey.setVariable('_router', this._router);
      survey.setVariable('pkiSurveyID', this._questionnaire.pkiSurveyID);
      survey.setVariable('Esurvey_userUID', this._questionnaire.Esurvey_userUID);
      survey.setVariable('fkiSurveyTypeId', this._questionnaire.fkiSurveyTypeId);
      survey.setVariable('_portalView', this._selectedAppTab);
      survey.setVariable('sCategoryName', this._questionnaire.sCategoryName);
      survey.setVariable('surveyCategoryUID', this._questionnaire.surveyCategoryUID);

      survey.onComplete.add(this.surveyOnComplete);
      Survey.SurveyNG.render('surveyElement', { model: survey, css: myCss });
      this._loaderService.exitLoader();
    }
  }

  public surveyOnComplete(sender, options) {
    const _esurveyService = sender.getVariable('_esurveyService');
    const _router = sender.getVariable('_router');
    const _surveyData = JSON.stringify(sender.data);
    const _pkiSurveyID = sender.getVariable('pkiSurveyID');
    const _Esurvey_userUID = sender.getVariable('Esurvey_userUID');
    const _fkiSurveyTypeId = sender.getVariable('fkiSurveyTypeId');
    const _portalView = sender.getVariable('_portalView');
    const _sCategoryName = sender.getVariable('sCategoryName');

    _esurveyService.submitEsurveyQuestionnaire(_surveyData, _pkiSurveyID, _Esurvey_userUID,
      _fkiSurveyTypeId, _portalView, _sCategoryName).subscribe();
  }

  goBack() {
    this._router.navigate(['live'], { replaceUrl: true });
  }

  assesseeDefaultImg() {
    this._showImage = false;
  }

}
