import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ExitInterviewAssessmentAssessee, ExitInterviewAssessment } from '../../../../_models';
import { AuthService, LoaderService, PrintToolService, ExitInterviewService } from '../../../../_services/index';

@Component({
  selector: 'app-assessee',
  templateUrl: './assessee.page.html',
  styleUrls: ['./assessee.page.scss'],
})
export class AssesseePage implements OnInit, OnDestroy {

  _isLoading = true;
  _bDisplayMessage = false;
  _usePendingDefaultImage = [];
  _useCompletedDefaultImage = [];
  _selectedAssessment: ExitInterviewAssessment;
  _pending: ExitInterviewAssessmentAssessee[] = [];
  _completed: ExitInterviewAssessmentAssessee[] = [];
  _selectedAppTab = '';

  private readonly onDestroy = new Subject<void>();

  constructor(
    public _exitInterviewAssessmentService: ExitInterviewService,
    public _authService: AuthService,
    private _router: Router,
    private _printtoolService: PrintToolService,
    private _loaderService: LoaderService) { }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._authService.hideAppPanel(true);
    this._pending = [];
    this._completed = [];
    this._selectedAssessment = this._exitInterviewAssessmentService._selectedAssessment;
    this._selectedAppTab = this._authService._selectedAppTab;

    if (!this._selectedAssessment) {
      this._exitInterviewAssessmentService.getExitInterviewAssessmentForUser(this._authService._sessionUser.P5Corp_userUID)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.updateAssessmentsChanged();
        });
    } else {
      this.updateAssessmentsChanged();
    }
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  updateAssessmentsChanged() {
    if (!this._selectedAssessment) {
      this._exitInterviewAssessmentService._selectedAssessment = this._exitInterviewAssessmentService._exit_interview_assessment[0];
    }
    this._selectedAssessment = this._exitInterviewAssessmentService._selectedAssessment;
    if (this._selectedAssessment && this._selectedAssessment.exitInterviewAssessmentUID) {
      this._exitInterviewAssessmentService.getExitInterviewAssessmentAssesseesForAssessor(this._selectedAssessment.exitInterviewAssessmentUID,
        this._selectedAssessment.sAssessorInternal_fkUserUUID)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.setAssessees();
        });
    } else {
      this._bDisplayMessage = true;
      this._loaderService.exitLoader();
    }
  }

  setAssessees() {
    this._selectedAssessment = this._exitInterviewAssessmentService._selectedAssessment;
    this._pending = this._exitInterviewAssessmentService._exit_interview_assessment_assessees_pending;
    this._completed = this._exitInterviewAssessmentService._exit_interview_assessment_assessees_completed;

    // Check for Pending Images
    for (let i = 0; i < this._pending.length; i++) {
      if (this._pending[i]['profilePhoto'] && this._pending[i]['profilePhoto'].length) {
        this._usePendingDefaultImage[i] = false;
        this._pending[i]['profilePhoto'] = this._pending[i]['profilePhoto'] + '?' + Math.floor((Math.random() * 1000) + 1);
      } else {
        this._usePendingDefaultImage[i] = true;
      }
    }

    // Check for Completed Images
    for (let i = 0; i < this._completed.length; i++) {
      if (this._completed[i]['profilePhoto'] && this._completed[i]['profilePhoto'].length) {
        this._useCompletedDefaultImage[i] = false;
        this._completed[i]['profilePhoto'] = this._completed[i]['profilePhoto'] + '?' + Math.floor((Math.random() * 1000) + 1);
      } else {
        this._useCompletedDefaultImage[i] = true;
      }
    }

    if (this._pending.length === 1 && this._completed.length === 0) {
      this.getExitInterviewAssessmentQuestionnaireForAssessor(this._pending[0]);
    } else {
      this._isLoading = false;
      this._loaderService.exitLoader();
    }
  }

  getExitInterviewAssessmentQuestionnaireForAssessor(assessee: ExitInterviewAssessmentAssessee) {
    this._loaderService.initLoader(true);
    // reset questionnaire
    this._exitInterviewAssessmentService._exit_interview_assessment_questionnaire = {
      'exitInterviewAssessmentUID': '',
      'exitInterviewAssessmentAssessorsUID': '',
      'title': '',
      'pages': []
    };
    // set assessee
    this._exitInterviewAssessmentService._selectedAssessee = assessee;
    // navigate to questionnaire page
    this._router.navigate([this._selectedAppTab + '/exit-interview-assessment/questionnaire'], { replaceUrl: true });
  }

  pendingDefaultImg(i) {
    this._usePendingDefaultImage[i] = true;
  }

  completedDefaultImg(i) {
    this._useCompletedDefaultImage[i] = true;
  }

  getExitInterviewAssessmentReport(assessee: ExitInterviewAssessmentAssessee) {
    // this._loaderService.initLoader(true);
    // this._expertiseReviewService._selectedAssessee = assessee;
    // this._expertiseReviewService.getExpertiseReviewReport(assessee)
    //   .pipe(takeUntil(this.onDestroy))
    //   .subscribe(v => {
    //     this.printExpertiseReviewReport();
    //   });
  }

  printExpertiseReviewReport() {
    // this._printtoolService.initPrintExpertiseReviewReportView(this._expertiseReviewService._reportData, true);
    // this._loaderService.exitLoader();
  }

  goBack() {
    this._router.navigate(['live'], { replaceUrl: true });
  }


}
