import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RecruitmentAssessee, RecruitmentQuestionnaire } from 'src/app/_models';
import * as Survey from 'survey-angular';
import { AuthService, LoaderService, RecruitmentService } from '../../../../_services/index';
import { showdown } from '@jhuix/showdowns';
@Component({
  selector: 'app-vacancy-questionnaire',
  templateUrl: './vacancy-questionnaire.page.html',
  styleUrls: ['./vacancy-questionnaire.page.scss'],
})
export class VacancyQuestionnairePage implements OnInit, OnDestroy {
  private readonly onDestroy = new Subject<void>();
  private RSubscription: Subscription;


  public _questionnaireTitle: string;
  public _sAssesseeFullName: string;
  public _sAssesseeInitials: string;
  _selectedAssessee: RecruitmentAssessee;
  _recruitment_questionnaire: RecruitmentQuestionnaire;
  survey = new Survey.Model();
  _tabs: {};
  _showImage = true;

  constructor(public _authService: AuthService,
    private _loaderService: LoaderService,
    public _recruitmentService: RecruitmentService,
    private _router: Router) {
    this.RSubscription = this._recruitmentService._assessmentSubmittedChanged.subscribe(value => this.showAssessees());

  }

  ngOnInit() {
    this._loaderService.initLoader(true);

    this._selectedAssessee = this._recruitmentService._selectedAssessee;
    this._recruitmentService.getRecruitmentQuestionnaireForAssessor(this._selectedAssessee)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.setQuestionnaire()
      });
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  setQuestionnaire() {
    this._loaderService.initLoader(true);
    this._recruitment_questionnaire = this._recruitmentService._recruitment_questionnaire;
    this._tabs = {
      current: 0,
      data: ['Select Individual', 'Complete Assessment'],
    };

    this._recruitment_questionnaire = this._recruitmentService._recruitment_questionnaire;
    this._questionnaireTitle = this._recruitment_questionnaire.title;
    this._recruitment_questionnaire.title = '';

    this._sAssesseeFullName = this._recruitmentService._sAssesseeFullName;
    this._sAssesseeInitials = this._recruitmentService._sAssesseeInitials;

    Survey.StylesManager.applyTheme('bootstrap');
    const myCss = {
      matrix: { root: 'table table-coltwo' },
      navigationButton: 'btn btn-primary m-l-5',
    };

    const surveyStrings = {
      requiredInAllRowsError:
        'Please ensure you have answered all the questions below',
    };
    this.survey = new Survey.Model(this._recruitment_questionnaire);
    // this.survey.data = this._threeSixty_questionnaire['data']; // set draft data
    this.survey.showProgressBar = 'top';
    this.survey.showCompletedPage = false;
    this.survey.showQuestionNumbers = 'off';
    this.survey.locale = 'custom';

    Survey.surveyLocalization.locales['custom'] = surveyStrings;

    // set local variables for service http call
    this.survey.setVariable('_authService', this._authService);
    this.survey.setVariable('_recruitmentService', this._recruitmentService);
    this.survey.setVariable('_router', this._router);
    if (this._recruitment_questionnaire !== undefined) {
      this.survey.setVariable(
        'compAssessmentUID',
        this._recruitment_questionnaire.compAssessmentUID
      );
      this.survey.setVariable(
        'skillsAssessmentUID',
        this._recruitment_questionnaire.skillsAssessmentUID
      );
      this.survey.setVariable(
        'compAssessorTypeUID',
        this._recruitment_questionnaire.compAssessorTypeUID
      );
      this.survey.setVariable(
        'sRoleName',
        this._recruitment_questionnaire['sRoleName']
      );
      this.survey.setVariable(
        'JobTitleRoleUID',
        this._recruitment_questionnaire['JobTitleRoleUID']
      );
      this.survey.setVariable(
        'assessorUUID',
        this._recruitment_questionnaire['assessorUUID']
      );
      this.survey.setVariable(
        'assesseeUUID',
        this._recruitment_questionnaire['assesseeUUID']
      );

    }

    // Create showdown mardown converter
    var converter = new showdown.Converter();
    this.survey.onTextMarkdown.add(function (survey, options) {
      var str = converter.makeHtml(options.text);
      options.html = str;
    });

    this.survey.onComplete.add(this.surveyOnComplete);
    Survey.SurveyNG.render('surveyElement', { model: this.survey, css: myCss });
    this._loaderService.exitLoader();
  }

  surveyOnComplete(survey,) {
    this._questionnaireTitle = '';
    const _authService = survey.getVariable('_authService');
    const _recruitmentService = survey.getVariable('_recruitmentService');
    const _router = survey.getVariable('_router');
    if (survey.data['resume'] && survey.data['resume'].length) {
      // the below code is used for removing the base64 string so that the file can be saved on the backend
      survey.data['resume'][0]['type'] = survey.data['resume'][0]['name'].split('.')
      [survey.data['resume'][0]['name'].split('.').length - 1];

      survey.data['resume'][0]['content'] = survey.data['resume'][0]['content'].split(',')
      [survey.data['resume'][0]['content'].split(',').length - 1];
    }

    if (survey.data['coverLetter'] && survey.data['coverLetter'].length) {
      // the below code is used for removing the base64 string so that the file can be saved on the backend
      survey.data['coverLetter'][0]['type'] = survey.data['coverLetter'][0]['name'].split('.')
      [survey.data['coverLetter'][0]['name'].split('.').length - 1];

      survey.data['coverLetter'][0]['content'] = survey.data['coverLetter'][0]['content'].split(',')
      [survey.data['coverLetter'][0]['content'].split(',').length - 1];
    }

    if (survey.data['additionalDocs'] && survey.data['additionalDocs'].length) {
      // the below code is used for removing the base64 string so that the file can be saved on the backend

      for (var i = 0; i < survey.data['additionalDocs'].length; i++) {
        survey.data['additionalDocs'][i]['type'] = survey.data['additionalDocs'][i]['name'].split('.')[survey.data['additionalDocs'][i]['name'].split('.').length - 1];
        survey.data['additionalDocs'][i]['content'] = survey.data['additionalDocs'][i]['content'].split(',')[survey.data['additionalDocs'][i]['content'].split(',').length - 1];
      }

    }

    const _surveyData = JSON.stringify(survey.data);
    const _compAssessmentUID = survey.getVariable('compAssessmentUID');
    const _skillsAssessmentUID = survey.getVariable('skillsAssessmentUID');
    const _compAssessorTypeUID = survey.getVariable('compAssessorTypeUID');
    const _assessorUUID = survey.getVariable('assessorUUID');
    const _sRoleName = survey.getVariable('sRoleName');
    const _JobTitleRoleUID = survey.getVariable('JobTitleRoleUID');
    const _assesseeUUID = survey.getVariable('assesseeUUID');
    _recruitmentService.submitRecruitmentQuestionnaire(_surveyData, _compAssessmentUID, _skillsAssessmentUID,
      _compAssessorTypeUID, _sRoleName, _assessorUUID, _assesseeUUID, _JobTitleRoleUID).subscribe();
  }

  showAssessees() {
    this._router.navigate(['choose/recruitment/assessee'], { replaceUrl: true });
  }

  goBackToLibrary() {
    this._router.navigate(['choose/recruitment/list'], { replaceUrl: true });

  }

  assesseeDefaultImg() {
    this._showImage = false;
  }


}
