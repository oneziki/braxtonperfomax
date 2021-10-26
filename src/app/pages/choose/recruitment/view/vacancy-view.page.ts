import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, LoaderService, PrintToolService, RecruitmentService } from '../../../../_services/index';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { JobTitleRoleProfile, RecruitmentAssessee, RecruitmentAssessment } from 'src/app/_models';

@Component({
  selector: 'app-vacancy-view',
  templateUrl: './vacancy-view.page.html',
  styleUrls: ['./vacancy-view.page.scss'],
})
export class VacancyViewPage implements OnInit, OnDestroy {
  private readonly onDestroy = new Subject<void>();

  _bApplied = false;
  _vacancyData: JobTitleRoleProfile;
  _essentialQualifications = [];
  _optionalQualifications = [];

  constructor(public _authService: AuthService,
    private _recruitmentService: RecruitmentService,
    private _loaderService: LoaderService,
    private _printtoolService: PrintToolService,
    private _router: Router) { }

  ngOnInit() {
    this._loaderService.initLoader(true);

    //Check if the user has applied
    this._recruitmentService.getRecruitmentApplicationData()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.updateApplication();
      });

    this._recruitmentService.getVacancyData()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.updateVacancy();
      });
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  updateApplication() {
    if (this._recruitmentService._applicantVacancyData.length > 0) {
      this._bApplied = this._recruitmentService._applicantVacancyData[0].bIsComplete;
    }
  }

  updateVacancy() {
    let bShowOutcomeHeading = false;
    this._vacancyData = this._recruitmentService._vacancy;

    // qualifications
    this._essentialQualifications = this._vacancyData['qualifications'].filter(item => Boolean(item.bEssential) === true);
    this._optionalQualifications = this._vacancyData['qualifications'].filter(item => Boolean(item.bEssential) === false);

    this._vacancyData['competencyProfile'].forEach(compType => {
      bShowOutcomeHeading = false;
      compType['competencies'].forEach(dimensions => {
        dimensions['outcomes'].forEach(outcome => {
          if (!outcome['bHideOutcome']) {
            bShowOutcomeHeading = true;
          }
        });
        compType['showOutcomeHeading'] = bShowOutcomeHeading;

      });
    });
    this._loaderService.exitLoader();

  }

  applyForVacancy() {

    if (!this._recruitmentService._selectedAssessment) {
      const selectedAssessment: RecruitmentAssessment = new RecruitmentAssessment();
      selectedAssessment.JobTitleRoleUID = this._vacancyData.JobTitleRoleUID;
      selectedAssessment.sAssessorInternal_fkUserUUID = this._authService._linkUserUID === '' ? this._authService._sessionUser.P5Corp_userUID : this._authService._linkUserUID;
      this._recruitmentService._selectedAssessment = selectedAssessment;
      // reset assessees
      this._recruitmentService._recruitment_assessees_pending = [];
      this._recruitmentService._recruitment_assessees_completed = [];
    }
    this._router.navigate(['choose/recruitment/assessee'], { replaceUrl: true });
  }

  printPDFReport() {

    const assessee: RecruitmentAssessee = new RecruitmentAssessee();
    assessee.JobTitleRoleUID = this._vacancyData.JobTitleRoleUID;
    assessee.assessorUUID = this._recruitmentService._applicantVacancyData[0].sAssessorInternal_fkUserUUID;
    assessee.assesseeUUID = this._authService._sessionUser.P5Corp_userUID;
    assessee.compAssessorTypeUID = this._recruitmentService._applicantVacancyData[0].compAssessorTypeUID;
    this.getRecruitmentReport(assessee);
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


  goChoosePage() {
    this._router.navigate(['choose/recruitment/list'], { replaceUrl: true });

  }

}
