import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {
  ExpertiseReviewAssessee,
  ExpertiseReview
} from '../../../../_models/expertise-review';
import { AuthService, LoaderService, PrintToolService, ExpertiseReviewService, EmployeeDirectoryService } from '../../../../_services/index';

@Component({
  selector: 'app-assessee',
  templateUrl: './assessee.page.html',
  styleUrls: ['./assessee.page.scss'],
})
export class AssesseePage implements OnInit {

  private readonly onDestroy = new Subject<void>();

  _maxCardHeight = 0;
  _isLoading = true;
  _bDisplayMessage = false;
  _usePendingDefaultImage = [];
  _useCompletedDefaultImage = [];
  _selectedAssessment: ExpertiseReview;
  _pending: ExpertiseReviewAssessee[] = [];
  _completed: ExpertiseReviewAssessee[] = [];

  constructor(public _expertiseReviewService: ExpertiseReviewService,
    public _authService: AuthService,
    private _router: Router,
    private _printtoolService: PrintToolService,
    private _employeeDirectoryService: EmployeeDirectoryService,
    private _loaderService: LoaderService) {
  }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._authService.hideAppPanel(true);
    this._pending = [];
    this._completed = [];
    this._selectedAssessment = this._expertiseReviewService._selectedAssessment;
    this._authService.hideAppPanel(true);

    if (this._authService._sessionUser['P6_userUID'] !== this._employeeDirectoryService._performUser['P6_userUID']) {
      this._authService._KRAView = 'department';
    }

    if (!this._selectedAssessment) {
      this._expertiseReviewService.getExpertiseReviewForUser(this._authService._sessionUser.P5Corp_userUID,
        this._authService._sessionUser.sJobTitleUUID)
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
      // eslint-disable-next-line max-len
      this._expertiseReviewService._selectedAssessment = this._expertiseReviewService._expertise_review[0];
    }

    this._selectedAssessment = this._expertiseReviewService._selectedAssessment;
    if (this._selectedAssessment) {

      this._expertiseReviewService.getExpertiseReviewAssesseesForAssessor(this._selectedAssessment.SkillsAssessmentUID,
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
    this._selectedAssessment = this._expertiseReviewService._selectedAssessment;
    this._pending = this._expertiseReviewService._expertise_review_assessees_pending;
    this._completed = this._expertiseReviewService._expertise_review_assessees_completed;


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
      this.getExpertiseReviewQuestionnaireForAssessor(this._pending[0]);
    } else {
      this._isLoading = false;
      this._loaderService.exitLoader();
    }
  }

  pendingDefaultImg(i) {
    this._usePendingDefaultImage[i] = true;
  }

  completedDefaultImg(i) {
    this._useCompletedDefaultImage[i] = true;
  }

  getExpertiseReviewQuestionnaireForAssessor(assessee: ExpertiseReviewAssessee) {
    this._loaderService.initLoader(true);
    // reset questionnaire
    this._expertiseReviewService._expertise_review_questionnaire = {
      'skillsAssessmentUID': '',
      'skillsAssessmentAssessorsUID': '',
      'title': '',
      'pages': []
    };
    // set assessee
    this._expertiseReviewService._selectedAssessee = assessee;
    // navigate to questionnaire page
    this._router.navigate(['grow/expertise-review/questionnaire'], { replaceUrl: true });
  }

  getExpertiseReviewReport(assessee: ExpertiseReviewAssessee) {
    this._loaderService.initLoader(true);
    // set assessee
    this._expertiseReviewService._selectedAssessee = assessee;
    // navigate to report page

    this._expertiseReviewService.getExpertiseReviewReport(assessee)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.printExpertiseReviewReport();
      });

  }

  printExpertiseReviewReport() {
    this._loaderService.initLoader(true);
    this._printtoolService.initPrintExpertiseReviewReportView(this._expertiseReviewService._reportData, true);
    this._loaderService.exitLoader();
  }

  goBack() {
    this._router.navigate(['activity-summary'], { replaceUrl: true });
  }

}
