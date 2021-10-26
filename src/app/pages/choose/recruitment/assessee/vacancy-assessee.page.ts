import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService, LoaderService, PrintToolService, RecruitmentService } from '../../../../_services/index';
import { RecruitmentAssessee, RecruitmentAssessment } from 'src/app/_models';

@Component({
  selector: 'app-vacancy-assessee',
  templateUrl: './vacancy-assessee.page.html',
  styleUrls: ['./vacancy-assessee.page.scss'],
})
export class VacancyAssesseePage implements OnInit {

  private readonly onDestroy = new Subject<void>();

  _maxCardHeight = 0;
  _isLoading = true;
  _bDisplayMessage = false;
  _usePendingDefaultImage = [];
  _useCompletedDefaultImage = [];
  _selectedAssessment: RecruitmentAssessment;
  _pending: RecruitmentAssessee[] = [];
  _completed: RecruitmentAssessee[] = [];

  constructor(public _recruitmentService: RecruitmentService,
    public _authService: AuthService,
    private _router: Router,
    private _printtoolService: PrintToolService,
    private _loaderService: LoaderService) {
  }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._pending = [];
    this._completed = [];
    this._selectedAssessment = this._recruitmentService._selectedAssessment;

    this._pending = [];
    this._completed = [];
    if (this._pending.length === 0 && this._completed.length === 0) {
      this._recruitmentService.getRecruitmentAssesseesForAssessor(this._selectedAssessment.JobTitleRoleUID,
        this._selectedAssessment.sAssessorInternal_fkUserUUID, true)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.setAssessees();
        });
    } else {
      this.setAssessees();
    }
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  setAssessees() {
    this._selectedAssessment = this._recruitmentService._selectedAssessment;
    this._pending = this._recruitmentService._recruitment_assessees_pending;
    this._completed = this._recruitmentService._recruitment_assessees_completed;
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
      this.getRecruitmentQuestionnaireForAssessor(this._pending[0]);
    } else {
      this._loaderService.exitLoader();
    }
  }

  getRecruitmentQuestionnaireForAssessor(assessee: RecruitmentAssessee) {
    this._loaderService.initLoader(true);
    // reset questionnaire
    this._recruitmentService._recruitment_questionnaire = {
      'compAssessmentUID': '',
      'skillsAssessmentUID': '',
      'compAssessorTypeUID': '',
      'JobTitleRoleUID': '',
      'title': '',
      'assessorUUID': '',
      'pages': []
    };
    // set assessee
    this._recruitmentService._selectedAssessee = assessee;
    // navigate to questionnaire page
    this._router.navigate(['choose/recruitment/questionnaire'], { replaceUrl: true });

  }

  pendingDefaultImg(i) {
    this._usePendingDefaultImage[i] = true;
  }

  completedDefaultImg(i) {
    this._useCompletedDefaultImage[i] = true;
  }

  getRecruitmentReport(assessee: RecruitmentAssessee) {
    this._loaderService.initLoader(true);
    // set assessee
    this._recruitmentService._selectedAssessee = assessee;
    // navigate to report page

    this._recruitmentService.getRecruitmentReport(assessee)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.printRecruitmentReport();
      });

  }

  printRecruitmentReport() {
    this._loaderService.initLoader(true);
    this._printtoolService.initPrintRecruitmentReportView(this._recruitmentService._reportData, true);
    this._loaderService.exitLoader();
  }

}
