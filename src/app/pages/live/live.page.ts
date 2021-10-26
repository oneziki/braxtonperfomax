import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { CompanyTemplate, MyMaxTemplateMenu, SessionUser, Task } from '../../_models';
import { AuthService, ConversationService, EmployeeDirectoryService, EsurveyService, ExitInterviewService, KraService, LoaderService, MyMax7Service, PrintToolService } from '../../_services/index';

@Component({
  selector: 'app-live',
  templateUrl: './live.page.html',
  styleUrls: ['./live.page.scss'],
})
export class LivePage implements OnInit, OnDestroy {

  _individualTasks: Task;
  _teamTasks: Task;
  _sessionUser: SessionUser;
  _performUser = {};
  _companyTemplate: CompanyTemplate;
  _kraCompanySettings = {};
  _myMaxReportingTemplateViews: MyMaxTemplateMenu[] = [];
  _portalTiles = [];
  _linkedCategories = [];
  _linkedTile = {};
  bLoadTiles = false;
  _liveTemplate = {};
  _currentTask: any = {};
  _eSurveyReportData: Object = {};

  _isLoadingKRACompanySettings = true;
  _isLoadingTiles = true;
  _isLoadingMyMaxTemplate = true;
  _isLoading = true;
  _conversationFeedCat = [];

  _engagementNumber = 0;
  _exitInterviewNumber = 0;
  _motivationalReviewNumber = 0;
  _currentExitInterview: any = {};

  _engagementCatUID = '';
  _motivationalCatUID = '';

  private performUserSub: Subscription;
  private readonly onDestroy = new Subject<void>();

  constructor (private _router: Router,
    public _authService: AuthService,
    public _myMax7Service: MyMax7Service,
    private activatedRoute: ActivatedRoute,
    private _employeeDirectoryService: EmployeeDirectoryService,
    private _printtoolService: PrintToolService,
    public _loaderService: LoaderService,
    public _conversationService: ConversationService,
    private _kraService: KraService,
    public _exitInterviewService: ExitInterviewService,
    private _esurveyService: EsurveyService) {
    this.performUserSub = this._employeeDirectoryService._employeePerformUserChanged.subscribe(
      (value) => this.setPerformUser()
    );
  }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._authService.hideAppPanel(false);
    this._sessionUser = this._authService._sessionUser;
    this._companyTemplate = this._sessionUser['companytemplate'];
    this._individualTasks = this._authService._individualTasks;
    this._teamTasks = this._authService._teamTasks;
    this._kraCompanySettings = this._kraService._kraCompanySettings;
    this._conversationFeedCat = [];
    this._engagementNumber = 0;
    this._exitInterviewNumber = 0;
    this._motivationalReviewNumber = 0;

    if ('P6_userUID' in this._employeeDirectoryService._performUser) {
      this._performUser = this._employeeDirectoryService._performUser;
    } else {
      this._performUser = this._sessionUser;
    }


    if (this._companyTemplate.linkedTiles.length > 0) {
      const pageIndex = this._companyTemplate.linkedTiles.findIndex(x => x['sName'] == 'Live');
      if (pageIndex !== -1) {
        this._linkedTile = this._companyTemplate.linkedTiles[pageIndex];
      }
    }

    if (!this._kraCompanySettings) {

      this._kraService.getKraCompanySettings()
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.setCompanySettings();
        });
    } else {
      this.setCompanySettings();
    }

    this.getTasks();
    if (!this._teamTasks) {
      this.getTeamTasks();
    }
    this._myMax7Service.getMyMaxReportingTemplateViews(this._linkedTile['portalTemplateTileUID'], 'Personal', this._performUser['P6_userUID'])
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.setMyMaxReportingTemplateViews();
      });

    this._conversationService.getLatestConversationForCat(this._sessionUser['P6_userUID'], 'develop')
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.emitSetConversation();
      });

    this._loaderService.exitLoader();
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.performUserSub.unsubscribe();
    this.closePDFView();
  }

  closePDFView() {
    this._printtoolService._triggerClosingView.emit();
  }

  checkLoaderAllClear() {
    let toReturn = true;

    if (this._isLoadingKRACompanySettings) {
      toReturn = false;
    }
    if (this._isLoadingTiles) {
      toReturn = false;
    }
    if (this._isLoadingMyMaxTemplate) {
      toReturn = false;
    }

    if (toReturn === true) {
      this._isLoading = false;
      this._loaderService.exitLoader();
    }
  }

  setCompanySettings() {
    this._kraCompanySettings = this._kraService._kraCompanySettings;
    this._isLoadingKRACompanySettings = false;
    this.checkLoaderAllClear();
  }

  setMyMaxReportingTemplateViews() {
    if (this._myMax7Service._myMaxReportingTemplateViews.length > 0) {
      this._myMaxReportingTemplateViews = this._myMax7Service._myMaxReportingTemplateViews;
    }
    this._isLoadingMyMaxTemplate = false;
    this.checkLoaderAllClear();
  }

  setPerformUser() {
    this._loaderService.initLoader(true);
    this._engagementNumber = 0;
    this._exitInterviewNumber = 0;
    this._motivationalReviewNumber = 0;
    this._performUser = this._employeeDirectoryService._performUser;
    this.closePDFView();

    if ('userUUID' in this._performUser) {
      this._performUser['P6_userUID'] = this._performUser['userUUID'];
    }
    if ('sJobTitleName' in this._performUser) {
      this._performUser['sJobTitle'] = this._performUser['sJobTitleName'];
    }

    this.getTasks();
  }

  async getIndividualTasks(_userUUID, bPDFLoad) {
    this._loaderService.initLoader(true);
    this._individualTasks = await this._authService.getIndividualTasks(
      _userUUID, this._companyTemplate['portalSetupTemplateUID'], true);
    this.setTasks();
  }

  async getTasks() {
    this._individualTasks = await this._authService.getIndividualTasks(
      this._performUser['P6_userUID'], this._companyTemplate['portalSetupTemplateUID'], true);
    this.setTasks();
  }

  async setTasks() {
    for (const status of Object.keys(this._individualTasks)) {
      if (status !== 'totalTasks') {
        this._individualTasks[status] = this._individualTasks[status].filter(item =>
          item.sModule === 'Live' || item.sSubModule === 'Live' || item.sSubModule === 'esurvey');
      }
    }
    this.setTiles();
  }

  setTiles() {
    if (this._individualTasks) {
      let companyTemplateCopy = JSON.parse(JSON.stringify(this._companyTemplate['linkedTiles']));

      companyTemplateCopy = companyTemplateCopy.filter(item => item.sName === 'Live');
      this._liveTemplate = companyTemplateCopy[0];

      this._linkedCategories = companyTemplateCopy[0]['linkedCategories'];
      this._linkedCategories.forEach(category => {
        category['task'] = [];
        for (const status of Object.keys(this._individualTasks)) {
          if (this._individualTasks[status].length) {
            this._individualTasks[status].forEach(task => {
              if (category['sCategoryName'].toString().toLowerCase().indexOf('engagement') >= 0) {
                this._engagementCatUID = category['SurveyCategory_fkSurveyCategoryUID'];
              }
              if (category['sCategoryName'].toString().toLowerCase().indexOf('motivational') >= 0) {
                this._motivationalCatUID = category['SurveyCategory_fkSurveyCategoryUID'];
              }

              if (task['status'] === this._companyTemplate.sCompletedName) {
                if (category['sCategoryName'].toString().toLowerCase().indexOf('exit interview') >= 0
                  && task['sSubModuleItem'].indexOf('Exit Interview') >= 0) {
                  task['sSurveyName'] = task['sSurveyDateName'];
                  category['task'].push(task);
                  category['bLoadMore'] = false;
                  category['iTotal'] = 2;
                }
                if (category['sCategoryName'].toString().toLowerCase().indexOf('engagement') >= 0
                  && task['sSubModuleItem'].indexOf('esurvey') >= 0 && task['surveyCategoryUID'] === this._engagementCatUID) {
                  task['sSurveyName'] = task['sSurveyName'];
                  category['task'].push(task);
                  category['bLoadMore'] = false;
                  category['iTotal'] = 2;
                }
                if (category['sCategoryName'].toString().toLowerCase().indexOf('motivational') >= 0
                  && task['sSubModuleItem'].indexOf('esurvey') >= 0 && task['surveyCategoryUID'] === this._motivationalCatUID) {
                  task['sSurveyName'] = task['sSurveyName'];
                  category['task'].push(task);
                  category['bLoadMore'] = false;
                  category['iTotal'] = 2;
                }
              }
            });
          }
        }
      });
      this.bLoadTiles = true;
      this._isLoadingTiles = false;
      this.checkLoaderAllClear();
      this.setTileNotifications();
    }
    this._loaderService.exitLoader();
  }

  goActivitySummary() {
    this._router.navigate(['activity-summary'], { replaceUrl: true });
  }

  goEsurvey(sModuleName) {
    let currentCat = '';

    if (sModuleName === 'Engagement Survey') {
      if (this._engagementNumber == 1) {
        currentCat = this._engagementCatUID;
      }
    }

    if (sModuleName === 'Motivational Survey') {
      if (this._motivationalReviewNumber == 1) {
        currentCat = this._motivationalCatUID;
      }
    }

    if (sModuleName === 'Engagement Survey' || sModuleName === 'Motivational Survey') {
      if (currentCat != '') {
        this._esurveyService.getEsurveyAssessmentsForUser(this._sessionUser.Esurvey_userUID, true, currentCat)
          .pipe(takeUntil(this.onDestroy))
          .subscribe(v => {
            this._router.navigate(['live/esurvey/esurvey-list'], { replaceUrl: true });
          });
      } else {
        this._router.navigate(['activity-summary'], { replaceUrl: true });
      }
    }

    if (sModuleName === 'Exit Interview') {
      // reset assessees
      this._exitInterviewService._exit_interview_assessment_assessees_pending = [];
      this._exitInterviewService._exit_interview_assessment_assessees_completed = [];
      // set assessment
      this._exitInterviewService._selectedAssessment = this._currentExitInterview;
      // set assessment
      this._router.navigate(['live/exit-interview-assessment/assessee'], { replaceUrl: true });
    }




  }

  printPDF(task, viewMode: boolean) {
    this._loaderService.initLoader(true);
    this._currentTask = task;

    if (task['sSubModuleItem'].toString().toLowerCase().indexOf('exit interview') >= 0) {
      // Exit Interview
      this.printExitInterview(task, viewMode);
    } else {
      // Esurvey
      this.handlePrintEsurvey(task, viewMode);
    }
  }

  printExitInterview(task, viewMode) {
    this._exitInterviewService.updateExitInterviewNotifications(task.assesseeUUID, task.exitInterviewAssessmentUID)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.getIndividualTasks(task.sAssessorInternal_fkUserUUID, true);
      });
    if (viewMode) {
      this._exitInterviewService.getExitInterviewAssessmentReport(task)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this._printtoolService.initPrintExitInterviewReportView(this._exitInterviewService._reportData, false);
          this._loaderService.exitLoader();
        });
    } else {
      this._exitInterviewService.printExitInterviewAssessmentReport(task)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this._loaderService.exitLoader();
        });
    }
  }

  handlePrintEsurvey(task, viewMode) {
    this._esurveyService.getEsurveyAssessmentReport(task.pkiSurveyID, task.fkiUserID, '')
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._eSurveyReportData = this._esurveyService._reportData;
        this.printEsurveyReport(task, viewMode)
      });
  }

  printEsurveyReport(task, viewMode) {
    if (viewMode) {
      this._authService._isActivitySummaryPage = false;
      this._router.navigate(['live/esurvey/esurvey-report'], { replaceUrl: true });
    } else {
      this._esurveyService.printEsurveyReport(task.pkiSurveyID, task.fkiUserID, '')
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this._loaderService.exitLoader();
        });
    }
  }

  goPopup() {
    Swal.fire({
      title: '',
      text: 'No Data',
      icon: 'warning',
      confirmButtonColor: 'var(--primary)',
      heightAuto: false
    });
  }

  updateFilter(sHeading, myMaxChildren) {
    this._loaderService.initLoader(true);
    this._authService._previousAppTab = this._authService._selectedAppTab;
    const MymaxFilter = this._myMax7Service.updateFilter(sHeading, myMaxChildren);
    this.getFilterDataForMenuItem(MymaxFilter);
  }

  getFilterDataForMenuItem(MymaxFilter) {
    this._myMax7Service.getFilterDataForMenuItem(MymaxFilter, this._authService._sessionUser.P6_userUID)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.myMaxFilterChanged();
      });
  }

  myMaxFilterChanged() {
    this._myMax7Service.setJsonFileName();
    this._router.navigate(['mymax'], { replaceUrl: true });
  }

  emitSetConversation() {
    this._conversationFeedCat = this._conversationService._conversationFeedCat;
  }

  async getTeamTasks() {
    this._teamTasks = await this._authService.getTeamTasks(
      this._sessionUser['P6_userUID'], this._companyTemplate['portalSetupTemplateUID'])
  }

  setTileNotifications() {
    let tasks = {};
    // userUUID exists in direct reports on not on the session user.
    // this checks is to identify which array to calculate from
    if ('userUUID' in this._performUser) {
      tasks = JSON.parse(JSON.stringify(this._teamTasks));
    } else {
      tasks = JSON.parse(JSON.stringify(this._individualTasks));
    }

    tasks['1_arrears'] = tasks['1_arrears'].filter((item) => item.sSubModuleItem === 'Exit Interview' || item.sSubModuleItem === 'esurvey');

    tasks['1_arrears'] = tasks['1_arrears'].filter((item) => item.assessorUUID === this._performUser['P6_userUID']);
    for (let i = 0; i < tasks['1_arrears'].length; i++) {
      if (tasks['1_arrears'][i]['sSubModuleItem'] === 'esurvey' && tasks['1_arrears'][i]['sCategoryName'] === 'Engagement Reviews') {
        this._engagementNumber = this._engagementNumber + 1;
      }
      if (tasks['1_arrears'][i]['sSubModuleItem'] === 'Exit Interview') {
        this._exitInterviewNumber = this._exitInterviewNumber + 1;
        this._currentExitInterview = tasks['1_arrears'][i];
      }
      if (tasks['1_arrears'][i]['sSubModuleItem'] === 'esurvey' && tasks['1_arrears'][i]['sCategoryName'] === 'Motivational Reviews') {
        this._motivationalReviewNumber = this._motivationalReviewNumber + 1;
      }
    }

    tasks['2_draft'] = tasks['2_draft'].filter((item) => item.sSubModuleItem === 'Exit Interview'
      || item.sSubModuleItem === 'esurvey');
    tasks['2_draft'] = tasks['2_draft'].filter((item) => item.assessorUUID === this._performUser['P6_userUID']);
    for (let i = 0; i < tasks['2_draft'].length; i++) {
      if (tasks['2_draft'][i]['sSubModuleItem'] === 'esurvey' && tasks['2_draft'][i]['sCategoryName'] === 'Engagement Reviews') {
        this._engagementNumber = this._engagementNumber + 1;
      }
      if (tasks['2_draft'][i]['sSubModuleItem'] === 'Exit Interview') {
        this._exitInterviewNumber = this._exitInterviewNumber + 1;
        this._currentExitInterview = tasks['2_draft'][i];
      }
      if (tasks['2_draft'][i]['sSubModuleItem'] === 'esurvey' && tasks['2_draft'][i]['sCategoryName'] === 'Motivational Reviews') {
        this._motivationalReviewNumber = this._motivationalReviewNumber + 1;
      }
    }
    tasks['3_current'] = tasks['3_current'].filter((item) => item.sSubModuleItem === 'Exit Interview' || item.sSubModuleItem === 'esurvey');
    tasks['3_current'] = tasks['3_current'].filter((item) => item.assessorUUID === this._performUser['P6_userUID'] || item.Users_fkiUserUUId === this._performUser['P6_userUID']);
    for (let i = 0; i < tasks['3_current'].length; i++) {
      if (tasks['3_current'][i]['sSubModuleItem'] === 'esurvey' && tasks['3_current'][i]['sCategoryName'] === 'Engagement Reviews') {
        this._engagementNumber = this._engagementNumber + 1;
      }
      if (tasks['3_current'][i]['sSubModuleItem'] === 'Exit Interview') {
        this._exitInterviewNumber = this._exitInterviewNumber + 1;
        this._currentExitInterview = tasks['3_current'][i];
      }
      if (tasks['3_current'][i]['sSubModuleItem'] === 'esurvey' && tasks['3_current'][i]['sCategoryName'] === 'Motivational Reviews') {
        this._motivationalReviewNumber = this._motivationalReviewNumber + 1;
      }

    }

    tasks['6_upcoming'] = tasks['6_upcoming'].filter((item) => item.sSubModuleItem === 'Exit Interview'
      || item.sSubModuleItem === 'esurvey');
    tasks['6_upcoming'] = tasks['6_upcoming'].filter((item) => item.assessorUUID === this._performUser['P6_userUID']);
    for (let i = 0; i < tasks['6_upcoming'].length; i++) {
      if (tasks['6_upcoming'][i]['sSubModuleItem'] === 'esurvey' && tasks['6_upcoming'][i]['sCategoryName'] === 'Engagement Reviews') {
        this._engagementNumber = this._engagementNumber + 1;
      }
      if (tasks['6_upcoming'][i]['sSubModuleItem'] === 'Exit Interview') {
        this._exitInterviewNumber = this._exitInterviewNumber + 1;
      }
      if (tasks['6_upcoming'][i]['sSubModuleItem'] === 'esurvey' && tasks['6_upcoming'][i]['sCategoryName'] === 'Motivational Reviews') {
        this._motivationalReviewNumber = this._motivationalReviewNumber + 1;
      }
    }
  }

}

