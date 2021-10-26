import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as Survey from 'survey-angular';
import Swal from 'sweetalert2';
import { showdown } from '@jhuix/showdowns';
import {
  ExitInterviewAssessmentQuestionnaire,
  ExitInterviewAssessmentAssessee, ExitInterviewAssessment
} from '../../../../_models/index';
import {
  AuthService,
  LoaderService,
  ExitInterviewService,
} from '../../../../_services/index';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.page.html',
  styleUrls: ['./questionnaire.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class QuestionnairePage implements OnInit, OnDestroy {
  public _questionnaireTitle: string;
  public _sAssesseeFullName: string;
  public _sAssesseeInitials: string;

  _selectedAppTab: string;
  _tabs: {};
  _logo: string;
  _background: string;
  _exit_interview_assessment_questionnaire: ExitInterviewAssessmentQuestionnaire;
  _selectedAssessee: ExitInterviewAssessmentAssessee;
  _exit_interview_assessment: ExitInterviewAssessment;
  _selectedAssessment: ExitInterviewAssessment;
  _isLoading: false;
  _bShowStatus: false;
  _showImage = true;
  survey = new Survey.Model();

  private readonly onDestroy = new Subject<void>();

  constructor (
    public _authService: AuthService,
    private _loaderService: LoaderService,
    public _exitInterviewService: ExitInterviewService,
    private _router: Router
  ) { }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._authService.hideAppPanel(true);
    this._selectedAppTab = this._authService._selectedAppTab;
    this._selectedAssessment = this._exitInterviewService._selectedAssessment;

    this._exitInterviewService.getExitInterviewAssessmentQuestionnaireForAssessor(this._selectedAssessment)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.setQuestionnaire();
      });
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  setQuestionnaire() {
    this._selectedAppTab = this._authService._selectedAppTab;
    this._exit_interview_assessment_questionnaire = this._exitInterviewService._exit_interview_assessment_questionnaire;
    this._selectedAssessee = this._exitInterviewService._selectedAssessee;
    this._tabs = {
      current: 0,
      data: ['Select Individual', 'Complete Exit Interview']
    };
    this._logo = this._authService._logo;
    this._background = this._authService._background;
    this._exit_interview_assessment_questionnaire = this._exitInterviewService._exit_interview_assessment_questionnaire;
    this._questionnaireTitle = this._exit_interview_assessment_questionnaire.title;
    this._exit_interview_assessment_questionnaire.title = '';

    this._sAssesseeFullName = this._exitInterviewService._sAssesseeFullName;
    this._sAssesseeInitials = this._exitInterviewService._sAssesseeInitials;
    Survey.JsonObject.metaData.addProperty('questionbase', 'tooltip');

    Survey.StylesManager.applyTheme('bootstrap');
    const myCss = {
      matrix: { root: 'table table-coltwo' },
      navigationButton: 'btn btn-primary m-l-5'
    };

    const surveyStrings = { requiredInAllRowsError: 'Please ensure you have answered all the questions below' };
    this.survey = new Survey.Model(this._exit_interview_assessment_questionnaire);
    this.survey.data = this._exit_interview_assessment_questionnaire['data']; // set draft data
    //this.survey.showProgressBar = 'top';
    this.survey.showCompletedPage = false;
    this.survey.showQuestionNumbers = 'off';

    this.survey.locale = 'custom';
    Survey.surveyLocalization.locales['custom'] = surveyStrings;

    // set local variables for service http call
    this.survey.setVariable('_authService', this._authService);
    this.survey.setVariable(
      '_exitInterviewService',
      this._exitInterviewService
    );
    this.survey.setVariable('_router', this._router);
    if (this._exit_interview_assessment_questionnaire !== undefined) {
      this.survey.setVariable(
        'exitInterviewAssessmentUID',
        this._exit_interview_assessment_questionnaire.exitInterviewAssessmentUID
      );
      this.survey.setVariable(
        'exitInterviewAssessmentAssessorsUID',
        this._exit_interview_assessment_questionnaire.exitInterviewAssessmentAssessorsUID
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

  surveyOnComplete(survey) {
    this._questionnaireTitle = '';
    const _exitInterviewService = survey.getVariable('_exitInterviewService');
    const _surveyData = JSON.stringify(survey.data);
    const _exitInterviewAssessmentUID = survey.getVariable('exitInterviewAssessmentUID');
    const _exitInterviewAssessmentAssessorsUID = survey.getVariable('exitInterviewAssessmentAssessorsUID');
    _exitInterviewService.submitExitInterviewAssessmentData(_surveyData, _exitInterviewAssessmentUID, _exitInterviewAssessmentAssessorsUID).subscribe();
  }

  goActivitySummary() {
    this._router.navigate(['activity-summary'], { replaceUrl: true });
  }
}
