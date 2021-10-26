// import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as Survey from 'survey-angular';
import Swal from 'sweetalert2';
import { SurveyAssessmentAssessorDetails } from '../../../_models/index';
import { AuthService, LoaderService, SurveyAssessmentService } from '../../../_services/index';
@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.page.html',
  styleUrls: ['./questionnaire.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class QuestionnairePage implements OnInit, OnDestroy {

  private _surveyQuestionnairSubscription2: Subscription;

  _logo: string;
  _background: string;
  _selfAssessmentQuestionnaire = [];
  _isLoading: false;
  // _bShowStatus: false;
  // _showImage = false;
  _showDeclineAlert = false;
  _sDeclineReason = '';
  // _completedSurveyAssessments = new CompletedSurveyAssessments();

  _linkUserUID = '';
  _linkSurveyUID = '';
  _bComplete = false;
  _surveyCompletionHeaderMessage = 'Feedback Provided';
  _surveyCompletionMessage = 'Thank you for taking the time to complete this survey. You will be logged out shortly';

  declinechatSlideInOut = 'out';
  survey = new Survey.Model();
  public _sAssesseeFullName = '';
  public _questionnaireTitle = '';

  private ngUnsubscribe: Subject<any> = new Subject<any>();
  private readonly onDestroy = new Subject<void>();
  constructor (private _router: Router,
    private _surveyAssessmentService: SurveyAssessmentService,
    // private _loaderService: LoaderService,
    public _authService: AuthService) {
    this._surveyQuestionnairSubscription2 = this._surveyAssessmentService._selfAssessmentSubmittedChanged.subscribe(value => this.routeToComplete());
  }

  ngOnInit() {

    this._linkUserUID = this._authService._linkUserUID;
    this._linkSurveyUID = this._authService._linkSurveyUID;

    this._surveyAssessmentService.getSurveyAssessmentQuestionnaire(this._linkSurveyUID, this._linkUserUID)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.setQuestionnaireData();
      });
  }

  ngOnDestroy() {
    this._surveyQuestionnairSubscription2.unsubscribe();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.onDestroy.next();
  }

  setQuestionnaireData() {
    this._selfAssessmentQuestionnaire = this._surveyAssessmentService._selfAssessmentQuestionnaire;
    this.setQuestionnaire();
  }

  goBackToAssessees() {
    this._router.navigate(['/survey-assessment/assessee-list'], { replaceUrl: true });
  }

  setQuestionnaire() {
    this._sAssesseeFullName = this._selfAssessmentQuestionnaire['sAssesseeName'];
    this._questionnaireTitle = this._selfAssessmentQuestionnaire['title'];
    this._selfAssessmentQuestionnaire['title'] = '';

    Survey.StylesManager.applyTheme('bootstrap');
    const myCss = {
      matrix: { root: 'table table-coltwo' },
      navigationButton: 'btn btn-primary m-l-5'
    };

    const surveyStrings = { requiredInAllRowsError: 'Please ensure you have answered all the questions below' };
    this.survey = new Survey.Model(this._selfAssessmentQuestionnaire);

    this.survey.showProgressBar = 'top';
    this.survey.showCompletedPage = false;
    this.survey.showQuestionNumbers = 'off';
    this.survey.locale = 'custom';

    Survey.surveyLocalization.locales['custom'] = surveyStrings;

    // set local variables for service http call
    this.survey.setVariable('_authService', this._authService);
    // this.survey.setVariable('_loaderService', this._loaderService);
    this.survey.setVariable('_surveyAssessmentService', this._surveyAssessmentService);
    this.survey.setVariable('_router', this._router);
    if (this._selfAssessmentQuestionnaire !== undefined) {
      this.survey.setVariable('_surveyAssessmentService', this._surveyAssessmentService);
      this.survey.setVariable('_router', this._router);
      this.survey.setVariable('surveyAssessorTypeUID', this._selfAssessmentQuestionnaire['surveyAssessorTypeUID']);
      this.survey.setVariable('surveyHrURPRoleUID', this._selfAssessmentQuestionnaire['surveyHrURPRoleUID']);
      this.survey.setVariable('assesseeUID', this._selfAssessmentQuestionnaire['assesseeUID']);
      this.survey.setVariable('surveyAssessmentAssessorsUID', this._selfAssessmentQuestionnaire['surveyAssessmentAssessorsUID']);
      this.survey.setVariable('sAssessorInternal_fkUserUUID', this._selfAssessmentQuestionnaire['sAssessorInternal_fkUserUUID']);
      this.survey.setVariable('bIsComplete', this._selfAssessmentQuestionnaire['bIsComplete']);
      this.survey.setVariable('sAssessorTypeDescription', this._selfAssessmentQuestionnaire['sAssessorTypeDescription']);
    }

    if (this._selfAssessmentQuestionnaire['bIsComplete'] === 1) {
      this._surveyCompletionHeaderMessage = 'Feedback on Assessment already provided';
      this._surveyCompletionMessage = 'Please note this assessment has  already been completed , therefore you will automatically be logged in few seconds';
      this.routeToComplete();
      this._bComplete = true;
    }

    this.survey.onComplete.add(this.surveyOnComplete);
    Survey.SurveyNG.render('surveyElement', { model: this.survey, css: myCss });
    // this._loaderService.exitLoader();
  }

  declineInvitation() {
    // this._loaderService.initLoader(true);
    this._surveyCompletionHeaderMessage = 'Invitation Declined';
    this._surveyCompletionMessage = 'Please Note you have declined this invitation and will automatically be logged out in few seconds';

    this._surveyAssessmentService.declineAssessmentInvite(this._linkSurveyUID, this._linkUserUID, this._sDeclineReason)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.routeToComplete();
      });
  }

  alertDecline() {
    this._showDeclineAlert = true;
  }

  async toggleDeclineInvite() {
    const { value: text } = await Swal.fire({
      input: 'textarea',
      title: 'Decline Invitation',
      inputLabel: 'Please provide a reson for declining this invitation.',
      inputPlaceholder: 'Type your message here...',
      inputAttributes: {
        'aria-label': 'Type your message here'
      },
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'Please provide a reason for declining'
        }
      }
    })

    if (text) {
      this._sDeclineReason = text;
      this.declineInvitation();
    }
  }

  surveyOnComplete(survey) {
    // const _loaderService = survey.getVariable('_loaderService');
    // _loaderService.initLoader();
    this._questionnaireTitle = '';
    const _authService = survey.getVariable('_authService');
    const _surveyAssessmentService = survey.getVariable('_surveyAssessmentService');
    const _router = survey.getVariable('_router');


    const _surveyData = JSON.stringify(survey.data);
    const _userData = new SurveyAssessmentAssessorDetails();

    _userData['surveyAssessorTypeUID'] = survey.getVariable('surveyAssessorTypeUID');
    _userData['surveyHrURPRoleUID'] = survey.getVariable('surveyHrURPRoleUID');
    _userData['assesseeUID'] = survey.getVariable('assesseeUID');
    _userData['surveyAssessmentAssessorsUID'] = survey.getVariable('surveyAssessmentAssessorsUID');
    _userData['sAssessorInternal_fkUserUUID'] = survey.getVariable('sAssessorInternal_fkUserUUID');
    _userData['sAssessorTypeDescription'] = survey.getVariable('sAssessorTypeDescription');

    _surveyAssessmentService.submitSurveyAssessmentQuestionnaire(_surveyData, _userData, false).subscribe();
  }

  routeToComplete() {
    if (this._selfAssessmentQuestionnaire['sAssessorTypeDescription'] === 'Self') {
      this.goBackToAssessees();
    } else {
      this.declinechatSlideInOut = 'out';

      $('#disableDiv').addClass('displayNone');
      // this._loaderService.exitLoader();
      Swal.fire({
        title: this._surveyCompletionHeaderMessage,
        text: this._surveyCompletionMessage,
        timer: 5000,
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK',
        buttonsStyling: false
      }).then((result) => {
        // this._loaderService.initLoader(true);
        this._authService.logout();
      });
      this._bComplete = true;
    }
  }


}
