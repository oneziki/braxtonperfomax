import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  CompanyTemplate,
  ExitInterviewAssessment,
  ExitInterviewAssessmentAssessee,
  RecruitmentAssessee,
  RecruitmentAssessment, SessionUser,
  Task, ThreeSixtyAssessment
} from '../../_models/index';
import {
  AuthService,
  ChooseQuestionnaireService,
  EmployeeDirectoryService,
  EsurveyService,
  ExitInterviewService,
  ExpertiseReviewService,
  KraPdpService,
  KraService,
  LoaderService,
  PrintToolService,
  RecruitmentService,
  ThreeSixtyService,
  NotificationService
} from '../../_services';
@Component({
  selector: 'app-activity-summary',
  templateUrl: './activity-summary.page.html',
  styleUrls: ['./activity-summary.page.scss'],
})
export class ActivitySummaryPage implements OnInit, OnDestroy {
  private readonly onDestroy = new Subject<void>();

  _individualTasks: Task;
  _teamTasks: Task;
  _sessionUser: SessionUser;
  _companyTemplate: CompanyTemplate;
  _tasksList = {};
  _filterStatusList = [];
  _performUser = {};
  _selectedAppTab = '';
  _eSurveyReportData: Object = {};
  _isloadingIndividualTasks = true;
  _isloadingTeamTasks = true;
  _isLoading = true;


  private performUserSub: Subscription;

  constructor (
    private _router: Router,
    public _authService: AuthService,
    private _kraService: KraService,
    public _threeSixtyService: ThreeSixtyService,
    public _expertiseReviewService: ExpertiseReviewService,
    private _employeeDirectoryService: EmployeeDirectoryService,
    private _loaderService: LoaderService,
    public _exitInterviewService: ExitInterviewService,
    private _printtoolService: PrintToolService,
    private _recruitmentService: RecruitmentService,
    public _chooseQuestionnaireService: ChooseQuestionnaireService,
    public _kraPDPService: KraPdpService,
    public _notificationService: NotificationService,
    private _esurveyService: EsurveyService
  ) {
    this.performUserSub =
      this._employeeDirectoryService._employeePerformUserChanged.subscribe((value) => this.setPerformUser());
  }


  ngOnInit() {
    this._loaderService.initLoader(true);
    this._authService.hideAppPanel(false);
    this._sessionUser = this._authService['_sessionUser'];
    this._companyTemplate = this._sessionUser.companytemplate;
    this._selectedAppTab = this._authService._selectedAppTab;
    this._isLoading = true;
    this._isloadingIndividualTasks = true;
    this._isloadingTeamTasks = true

    if ('P6_userUID' in this._employeeDirectoryService._performUser) {
      this._performUser = this._employeeDirectoryService._performUser;
    } else {
      this._performUser = this._sessionUser;
    }

    if (this._performUser['P6_userUID'] !== this._sessionUser['P6_userUID']) {
      this._isloadingTeamTasks = true;
      this._isloadingIndividualTasks = false;
      this.getTeamTasks();
    } else {
      this._isloadingIndividualTasks = true;
      this._isloadingTeamTasks = true;
      this.getIndividualTasks();
    }
  }

  checkLoaderAllClear() {
    let toReturn = true;
    if (this._isloadingIndividualTasks) {
      toReturn = false;
    }
    if (this._isloadingTeamTasks) {
      toReturn = false;
    }

    if (toReturn === true) {
      this._isLoading = false;
      this._loaderService.exitLoader();
    }
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.performUserSub.unsubscribe();
  }

  setPerformUser() {
    this._loaderService.initLoader(true);
    this._performUser = this._employeeDirectoryService._performUser;
    this._selectedAppTab = this._authService._selectedAppTab;

    if ('userUUID' in this._performUser) {
      this._performUser['P6_userUID'] = this._performUser['userUUID'];
    }

    if (this._performUser['P6_userUID'] !== this._sessionUser['P6_userUID']) {
      this._isloadingTeamTasks = true;
      this._isloadingIndividualTasks = false;
      this.getTeamTasks();
    } else {
      this._isloadingIndividualTasks = true;
      this._isloadingTeamTasks = true;
      this.getIndividualTasks();
    }
  }

  async getTeamTasks() {
    const teamData = await this._authService.getTeamTasks(this._sessionUser['P6_userUID'],
      this._companyTemplate['portalSetupTemplateUID']
    )

    this._teamTasks = JSON.parse(JSON.stringify(teamData));
    this._notificationService.calculateTeamTasks(this._teamTasks);
    this.setTeamTasks();
  }

  setTeamTasks() {
    this._filterStatusList = [];
    this._tasksList = {};

    for (const status of Object.keys(this._teamTasks)) {
      if (status !== 'totalTasks') {
        if (this._selectedAppTab === 'grow') {
          this._teamTasks[status] = this._teamTasks[status].filter(
            (item) =>
              (item.sSubModule === 'competency' &&
                item.assesseeUUID === this._performUser['P6_userUID']) || (item.sSubModuleItem === 'Integrated PDP' &&
                  item.EmployeeUID === this._performUser['P6_userUID'])
          );
        } else if (this._selectedAppTab === 'perform') {
          this._teamTasks[status] = this._teamTasks[status].filter(
            (item) =>
              item.sSubModule === 'kra' &&
              item.sSubModuleItem !== 'Integrated PDP' &&
              item.EmployeeUID === this._performUser['P6_userUID']
          );
          // Making Sure Variables Are The Same For Agreements/Reviews
          for (let i = 0; i < this._teamTasks[status].length; i++) {
            if (this._teamTasks[status][i]['sSubModuleItem'] === 'Performance Review') {
              this._teamTasks[status][i]['sDateEmployeeSigned'] = this._teamTasks[status][i]['sEmployeeSigned'];
              this._teamTasks[status][i]['sDateAdminSigned'] = this._teamTasks[status][i]['sManagerSigned'];
              this._teamTasks[status][i]['sDateAdmin2Signed'] = this._teamTasks[status][i]['sSecondManagerSigned'];
            }
          }
        } else if (this._selectedAppTab === 'live') {
          this._teamTasks[status] = this._teamTasks[status].filter(
            (item) =>
              item.sSubModule === 'Live' &&
              item.assesseeUUID === this._performUser['P6_userUID']
          );
        } else if (this._selectedAppTab === 'choose') {

          this._teamTasks[status] = this._teamTasks[status].filter(
            (item) =>
              item.sSubModuleItem === 'Choose' || item.sSubModuleItem === 'Recruitment'
            // && item['assesseeUUID'] === this._performUser['P6_userUID'] || item['EmployeeUID'] === this._performUser['P6_userUID']
          );

        }
      }

      const statusGroup = status;
      if (this._teamTasks[status].length) {
        const statusTitle = this._teamTasks[status][0]['status'].toLowerCase();
        this._filterStatusList.push({
          statusGroup: statusGroup,
          statusTitle: statusTitle,
        });
      }
    }

    this._filterStatusList.sort();
    this._filterStatusList.sort((a, b) => a.statusGroup.localeCompare(b.statusGroup));

    this._tasksList = this._teamTasks;
    this._isloadingTeamTasks = false
    this.checkLoaderAllClear();
  }

  async getIndividualTasks() {
    const indivData = await this._authService.getIndividualTasks(this._performUser['P6_userUID'],
      this._companyTemplate['portalSetupTemplateUID'],
      false
    )
    this._individualTasks = JSON.parse(JSON.stringify(indivData));
    this._notificationService.calulcateIndividualTasks(this._individualTasks);
    this.setIndividualTasks();


  }

  setIndividualTasks() {
    this._filterStatusList = [];
    for (const status of Object.keys(this._individualTasks)) {
      if (status !== 'totalTasks') {
        if (this._selectedAppTab === 'grow') {
          this._individualTasks[status] = this._individualTasks[status].filter(
            (item) =>
              item.sSubModule === 'competency' || item.sSubModuleItem === 'Integrated PDP'
          );
        } else if (this._selectedAppTab === 'perform') {
          this._individualTasks[status] = this._individualTasks[status].filter(
            (item) =>
              item.sSubModule === 'kra' &&
              item.sSubModuleItem !== 'Integrated PDP'
          );
          // Making Sure Variables Are The Same For Agreements/Reviews
          for (let i = 0; i < this._individualTasks[status].length; i++) {
            if (
              this._individualTasks[status][i]['sSubModuleItem'] ===
              'Performance Review'
            ) {
              this._individualTasks[status][i]['sDateEmployeeSigned'] =
                this._individualTasks[status][i]['sEmployeeSigned'];
              this._individualTasks[status][i]['sDateAdminSigned'] =
                this._individualTasks[status][i]['sManagerSigned'];
              this._individualTasks[status][i]['sDateAdmin2Signed'] =
                this._individualTasks[status][i]['sSecondManagerSigned'];
            }
          }
        } else if (this._selectedAppTab === 'live') {
          this._individualTasks[status] = this._individualTasks[status].filter(
            (item) =>
              item.sSubModule === 'Live' || item.sSubModule === 'esurvey'
          );
        } else if (this._selectedAppTab === 'choose') {
          this._individualTasks[status] = this._individualTasks[status].filter(
            (item) =>
              item.sSubModuleItem === 'Choose' || item.sSubModuleItem === 'Recruitment'
          );
        }
        const statusGroup = status;
        if (this._individualTasks[status].length) {
          const statusTitle =
            this._individualTasks[status][0]['status'].toLowerCase();
          this._filterStatusList.push({
            statusGroup: statusGroup,
            statusTitle: statusTitle,
          });
        }
      }
    }

    this.setTasksForUsersNotReportingTo();
  }

  async setTasksForUsersNotReportingTo() {
    if (typeof this._teamTasks === 'undefined') {
      this._teamTasks = await this._authService.getTeamTasks(
        this._sessionUser['P6_userUID'],
        this._companyTemplate['portalSetupTemplateUID']
      );
      this._isloadingTeamTasks = false;
      this.checkLoaderAllClear();
    } else {
      this._isloadingTeamTasks = false;
    }
    for (const status of Object.keys(this._teamTasks)) {
      if (status !== 'totalTasks') {
        if (this._selectedAppTab === 'grow') {
          this._teamTasks[status] = this._teamTasks[status].filter((item) => item.sSubModule === 'competency');
          this._teamTasks[status] = this._teamTasks[status].filter(item => item.sSubModule === 'competency' &&
            item.sAssessorInternal_fkUserUUID === this._sessionUser['P6_userUID']);
        }
        else if (this._selectedAppTab === 'perform') {
          this._teamTasks[status] = this._teamTasks[status].filter(
            (item) =>
              item.sSubModule === 'kra' &&
              item.sSubModuleItem !== 'Integrated PDP' &&
              item.EmployeeUID === this._performUser['P6_userUID']
          );
          // Making Sure Variables Are The Same For Agreements/Reviews
          for (let i = 0; i < this._teamTasks[status].length; i++) {
            if (
              this._teamTasks[status][i]['sSubModuleItem'] ===
              'Performance Review'
            ) {
              this._teamTasks[status][i]['sDateEmployeeSigned'] =
                this._teamTasks[status][i]['sEmployeeSigned'];
              this._teamTasks[status][i]['sDateAdminSigned'] =
                this._teamTasks[status][i]['sManagerSigned'];
              this._teamTasks[status][i]['sDateAdmin2Signed'] =
                this._teamTasks[status][i]['sSecondManagerSigned'];
            }
          }
        }
        else if (this._selectedAppTab === 'live') {
          this._teamTasks[status] = this._teamTasks[status].filter(item => item.sSubModule === 'Live' || item.sSubModule === 'esurvey' &&
            item.sAssessorInternal_fkUserUUID === this._sessionUser['P6_userUID']);
        } else if (this._selectedAppTab === 'choose') {
          this._teamTasks[status] = this._teamTasks[status].filter(
            (item) =>
              item.sSubModuleItem === 'Choose' || item.sSubModuleItem === 'Recruitment'
          );
        }


        const statusGroup = status;
        if (this._teamTasks[status].length) {
          this._individualTasks[status] = [...this._individualTasks[status], ...this._teamTasks[status]];
          const statusTitle = this._teamTasks[status][0]['status'].toLowerCase();

          const noDuplicates = this.findObjectByKey(this._filterStatusList, 'statusTitle', statusTitle);

          if (noDuplicates === null) {
            this._filterStatusList.push({ statusGroup: statusGroup, statusTitle: statusTitle });
          }
        }
      }
    }

    this._filterStatusList.sort();
    this._filterStatusList.sort((a, b) => a.statusGroup.localeCompare(b.statusGroup));
    this._tasksList = this._individualTasks;
    this._isloadingIndividualTasks = false;
    this.checkLoaderAllClear();
  }

  findObjectByKey(array, key, value) {
    for (let i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return true;
      }
    }
    return null;
  }

  processTask(task) {
    this._kraService.taskStatusOptions = this._authService.getNotificationStatusData();

    if (task['sSubModuleItem'] === 'Performance Agreement') {
      this._kraService._currentTask = task;
      this._kraService._sRoleToEmployee = task.sRoleToEmployee;

      if (task['status'] === this._sessionUser.companytemplate.sCompletedName) {
        this._loaderService.initLoader(true);
        this.printKraContratingPDF();
      } else {
        this._router.navigate(['perform/contracting/period'], { replaceUrl: true });
      }
    } else if (task['sSubModuleItem'] === 'Performance Review') {
      this._kraService._currentTask = task;
      this._kraService._sRoleToEmployee = task.sRoleToEmployee;
      this._kraService._reviewMonth = task['iMonth'];
      this._kraService._reviewYear = task['sYear'];

      if (task['status'] === this._sessionUser.companytemplate.sCompletedName) {
        this._loaderService.initLoader(true);
        this.printKraScoringPDF()
      } else {
        this._router.navigate(['perform/scoring/assessment'], { replaceUrl: true });
      }

    } else if (task['sSubModuleItem'] === 'Exit Interview') {
      if (task['status'] !== this._sessionUser.companytemplate.sComingUpName && task['status'] !== this._sessionUser.companytemplate.sCompletedName) {
        this.getExitInterviewAssesseesForAssessor(task);
      } else {
        this.getExitInterviewReport(task, task);
      }
    } else if (task['sSubModuleItem'] === 'esurvey') {
      this.processEsurveyTask(task);
    } else if (task['sSubModuleItem'] === 'Competency') {
      this.processCompetencyTask(task);
    } else if (task['sSubModuleItem'] === 'Expertise Review') {
      this.processExpertiseTask(task);
    } else if (task['sSubModuleItem'] === 'Choose') {
      this.processChooseTask(task);
    } else if (task['sSubModuleItem'] === 'Recruitment') {
      this.processRecruitmentTask(task);
    } else if (task['sSubModuleItem'] === 'Integrated PDP') {
      this.getIntegratedPDPprofile(task);
    } else {
      console.log('A:: No Match processTask task', task);
    }
  }

  getIntegratedPDPprofile(task) {
    this._loaderService.initLoader(true);
    if (task['status'] === this._sessionUser.companytemplate.sCompletedName) {
      this._kraPDPService.getIntegratedPdpPdfReportData(task['CompAssessmentUID'], task['EmployeeUID'])
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this._printtoolService.initPrintIntegratedPDPReportView(this._kraPDPService['_integratedPdpPDFData']);
          this._loaderService.exitLoader();
        });
    } else {
      this._kraPDPService._currentPDP = task;
      const assessment = new ThreeSixtyAssessment();
      assessment.compAssessmentUID = task['CompAssessmentUID'];
      assessment.sAssessmentName = task['sAssessmentName'];
      assessment['compAssessorTypeUID'] = task['compAssessorTypeUID'];
      assessment.sAssessorInternal_fkUserUUID = task['EmployeeUID'];
      assessment.bIsComplete = true;
      this._threeSixtyService._selectedAssessment = assessment;

      this._kraPDPService.getIntergratedPDPUserProfile(assessment.compAssessmentUID, assessment.sAssessorInternal_fkUserUUID)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this._router.navigate([this._selectedAppTab + '/pdp/integrated/list'], { replaceUrl: true });
        });
    }
  }

  processEsurveyTask(task) {
    if (task['status'] !== this._sessionUser.companytemplate.sComingUpName && task['status'] !== this._sessionUser.companytemplate.sCompletedName) {
      this._router.navigate([this._selectedAppTab + '/esurvey/esurvey-list'], { replaceUrl: true });
    } else {
      this._esurveyService.getEsurveyAssessmentReport(task.pkiSurveyID, task.fkiUserID, '')
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this._authService._isActivitySummaryPage = true;
          this._eSurveyReportData = this._esurveyService._reportData;
          this._router.navigate([this._selectedAppTab + '/esurvey/esurvey-report'], { replaceUrl: true });
        });
    }
  }

  getExitInterviewAssesseesForAssessor(assessment: ExitInterviewAssessment) {
    // reset assessees
    this._exitInterviewService._exit_interview_assessment_assessees_pending = [];
    this._exitInterviewService._exit_interview_assessment_assessees_completed = [];
    // set assessment
    this._exitInterviewService._selectedAssessment = assessment;
    this._router.navigate([this._selectedAppTab + '/exit-interview-assessment/assessee'], { replaceUrl: true });
  }

  getExitInterviewReport(assessee: ExitInterviewAssessmentAssessee, assessment: ExitInterviewAssessment) {
    this._loaderService.initLoader(true);
    // set assessment
    this._exitInterviewService._selectedAssessment = assessment;
    // set assessee
    this._exitInterviewService._selectedAssessee = assessee;

    this._exitInterviewService.getExitInterviewAssessmentReport(assessee, true)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._printtoolService.initPrintExitInterviewReportView(this._exitInterviewService._reportData, false);
      });
    this._loaderService.exitLoader();
  }

  processChooseTask(task) {
    if (task.bIsComplete) {
      this._loaderService.initLoader(true);
      this._chooseQuestionnaireService.getChooseQuestionnaireReportData(task['UserChooseQuestionnaireUID'], false)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this._printtoolService.initPrintChooseQuestionnaireReportView(this._chooseQuestionnaireService._reportData);
        });
      this._loaderService.exitLoader();
    } else {
      this._router.navigate(['choose/choose-questionnaire/section1'], { replaceUrl: true });
    }
  }

  processCompetencyTask(task) {
    // proceed to threesixty
    if (task['sSubModuleItem'] === 'Competency' && task['status'] !==
      this._sessionUser.companytemplate.sComingUpName && task['status'] === this._sessionUser.companytemplate.sCompletedName) {
      this.getThreeSixtyReport(task);
    } else if (task['sSubModuleItem'] === 'Competency' && task['status'] !==
      this._sessionUser.companytemplate.sComingUpName && task['status'] !== this._sessionUser.companytemplate.sCompletedName) {
      this.getThreeSixtyAssesseesForAssessor(task);
    }
  }

  processExpertiseTask(task) {
    // proceed to processExpertiseTask
    if (task['sSubModuleItem'] === 'Expertise Review' && task['status'] !==
      this._sessionUser.companytemplate.sComingUpName && task['status'] !== this._sessionUser.companytemplate.sCompletedName) {
      this.getSkillsAssessmentAssesseesForAssessor(task);
    } else if (task['sSubModuleItem'] === 'Expertise Review' && task['status'] !==
      this._sessionUser.companytemplate.sComingUpName && task['status'] === this._sessionUser.companytemplate.sCompletedName) {
      this.getExpertiseReviewReport(task, task);
    }
  }

  processRecruitmentTask(task) {
    // proceed to processRecruitmentTask
    if (task['status'] !== this._sessionUser.companytemplate.sComingUpName && task['status'] !== this._sessionUser.companytemplate.sCompletedName) {
      this.getRecruitmentAssesseesForAssessor(task, task, task);

    } else if (task['status'] !== this._sessionUser.companytemplate.sComingUpName && task['status'] === this._sessionUser.companytemplate.sCompletedName) {
      this.getRecruitmentReport(task, task);
    }
  }


  getSkillsAssessmentAssesseesForAssessor(assessment) {
    // reset assessees
    this._expertiseReviewService._expertise_review_assessees_pending = [];
    this._expertiseReviewService._expertise_review_assessees_completed = [];
    // set assessment
    this._expertiseReviewService._selectedAssessment = assessment;

    // navigate to assessee page
    this._router.navigate(['grow/expertise-review/assessee'], { replaceUrl: true });
  }

  getExpertiseReviewReport(assessee, assessment) {
    this._loaderService.initLoader(true);
    // set assessment
    this._expertiseReviewService._selectedAssessment = assessment;
    // set assessee
    this._expertiseReviewService._selectedAssessee = assessee;

    this._expertiseReviewService.getExpertiseReviewReport(assessee)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._printtoolService.initPrintExpertiseReviewReportView(this._expertiseReviewService._reportData, false);
      });
    this._loaderService.exitLoader();

  }

  getRecruitmentAssesseesForAssessor(assessee: RecruitmentAssessee, assessment: RecruitmentAssessment, task) {
    // reset assessees
    this._recruitmentService._selectedJobTitle = task['JobTitleRoleUID'];
    this._recruitmentService._selectedAssessment = assessment;
    this._recruitmentService._selectedAssessee = assessee;

    if (task['assessorUUID'] === task['assesseeUUID']) {
      // navigate to vacancies page 
      this._router.navigate(['choose/recruitment/list'], { replaceUrl: true });
    } else {
      // navigate to assessee page
      this._router.navigate(['choose/recruitment/assessee'], { replaceUrl: true });
    }

  }

  getRecruitmentReport(assessee: RecruitmentAssessee, assessment: RecruitmentAssessment) {
    this._loaderService.initLoader(true);
    // set assessment
    this._recruitmentService._selectedAssessment = assessment;
    // set assessee
    this._recruitmentService._selectedAssessee = assessee;
    this._recruitmentService.getRecruitmentReport(assessee)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._printtoolService.initPrintRecruitmentReportView(this._recruitmentService._reportData, false);
      });
    this._loaderService.exitLoader();
  }

  getThreeSixtyReport(assessment) {
    this._loaderService.initLoader(true);
    // set assessment
    this._threeSixtyService._selectedAssessment = assessment;
    // set assessee
    this._threeSixtyService._selectedAssessee = assessment;
    // navigate to report page
    this._router.navigate(['grow/three-sixty/report'], { replaceUrl: true });
  }

  getThreeSixtyAssesseesForAssessor(assessment) {
    // reset assessees
    this._threeSixtyService._threeSixty_assessees_pending = [];
    this._threeSixtyService._threeSixty_assessees_completed = [];
    // set assessment
    this._threeSixtyService._selectedAssessment = assessment;

    // navigate to assessee page
    this._router.navigate(['grow/three-sixty/list'], { replaceUrl: true });

  }

  downloadPDFForm(task) {
    if (task['sSubModuleItem'] === 'Performance Review') {
      this._kraService.downloadReviewPDFForm(task)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
        });
    } else if (task['sSubModuleItem'] === 'Performance Agreement') {
      this._kraService.downloadAgreementPDFForm(task)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
        });
    } else if (task['sSubModuleItem'] === 'Competency') {
      this._threeSixtyService.downloadThreesixtyPDFForm(task)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
        });
    }
  }

  printKraContratingPDF() {

    this._kraService.getKRAPerformanceAgreementPDFProfile()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._printtoolService.initPerformanceAgreementsView(this._kraService['_agreementPDFProfileData'], false);
        this._loaderService.exitLoader();
      });
  }

  printKraScoringPDF() {

    this._kraService.getReviewPDFData()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._printtoolService.initPerformanceReviewsView(this._kraService['_KRAReviewPDFData'], false);
        this._loaderService.exitLoader();
      });
  }


  goBack() {
    if (this._selectedAppTab === 'grow') {
      this._router.navigate(['grow'], { replaceUrl: true });
    } else if (this._selectedAppTab === 'perform') {
      this._router.navigate(['perform'], { replaceUrl: true });
    } else if (this._selectedAppTab === 'live') {
      this._router.navigate(['live'], { replaceUrl: true });
    } else if (this._selectedAppTab === 'choose') {
      this._router.navigate(['choose'], { replaceUrl: true });
    }
  }
}
