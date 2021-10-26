import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService, EmployeeDirectoryService, ConversationService, KraService, ContributionScorecardService, MyMax7Service, LoaderService, KraReviewService, PrintToolService } from '../../_services/index';
import { Subscription } from 'rxjs';
import { AppSettings, SessionUser, Task, CompanyTemplate, KraCompanySettings, MyMaxTemplateMenu, MyMaxFilter } from '../../_models';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-perform',
  templateUrl: './perform.page.html',
  styleUrls: ['./perform.page.scss'],
})
export class PerformPage implements OnInit, OnDestroy {

  _individualTasks: Task;
  _teamTasks: Task;
  _sessionUser: SessionUser;
  _performUser = {};
  _companyTemplate: CompanyTemplate;
  _kraCompanySettings = {};
  _contributionScorecards = [];
  _myMaxReportingTemplateViews: MyMaxTemplateMenu[] = [];
  _portalTiles = [];
  _linkedCategories = [];
  _conversationFeedCat = [];
  _linkedTile = {};
  bLoadTiles = false;
  projectPlanDocObj = {};
  _performTemplate = {};

  _isLoadingKRACompanySettings = true;
  _isLoadingTiles = true;
  _isLoadingMyMaxTemplate = true;
  _isLoading = true;

  _agreementNumber = 0;
  _reviewNumber = 0;

  public _uuid: string = AppSettings.NEW_GUID;
  _currentTask: any = {};
  _currentReviewTask: any = {};
  _currentAgreementTask: any = {};
  _ptViewMode = false;

  private performUserSub: Subscription;
  private readonly onDestroy = new Subject<void>();

  constructor(private _router: Router,
    public _authService: AuthService,
    public _myMax7Service: MyMax7Service,
    private activatedRoute: ActivatedRoute,
    public _kraReviewService: KraReviewService,
    private _employeeDirectoryService: EmployeeDirectoryService,
    private _contributionScorecardService: ContributionScorecardService,
    private _kraService: KraService,
    private _printtoolService: PrintToolService,
    public _conversationService: ConversationService,
    public _loaderService: LoaderService) {
    this.performUserSub = this._employeeDirectoryService._employeePerformUserChanged.subscribe(
      (value) => this.setPerformUser()
    );
  }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._authService.hideAppPanel(false);
    this._agreementNumber = 0;
    this._reviewNumber = 0;
    this._sessionUser = this._authService._sessionUser;
    this._kraService.updateSessionUser();
    // this._kraReviewService.updateSessionUser();
    this._companyTemplate = this._sessionUser['companytemplate'];
    this._individualTasks = this._authService._individualTasks;
    this._teamTasks = this._authService._teamTasks;
    this._kraCompanySettings = this._kraService._kraCompanySettings;
    this._contributionScorecards = this._contributionScorecardService._contributionScorecards;
    this._conversationFeedCat = [];

    if ('P6_userUID' in this._employeeDirectoryService._performUser) {
      this._performUser = this._employeeDirectoryService._performUser;
    } else {
      this._performUser = this._sessionUser;
    }


    if (this._companyTemplate.linkedTiles.length > 0) {
      const pageIndex = this._companyTemplate.linkedTiles.findIndex(x => x['sName'] == 'Perform');
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

    this._conversationService.getLatestConversationForCat(this._sessionUser['P6_userUID'], 'perform')
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.emitSetConversation();
      });

    this._loaderService.exitLoader();
  }

  ngOnDestroy() {
    this.closePDFView();
    this.onDestroy.next();
    this.onDestroy.complete();
    this.performUserSub.unsubscribe();
  }

  setPerformUser() {
    this._loaderService.initLoader(true);
    this._agreementNumber = 0;
    this._reviewNumber = 0
    this._performUser = this._employeeDirectoryService._performUser;
    this.closePDFView();
    if ('userUUID' in this._performUser) {
      this._performUser['P6_userUID'] = this._performUser['userUUID'];
    }
    if ('sJobTitleName' in this._performUser) {
      this._performUser['sJobTitle'] = this._performUser['sJobTitleName'];
    }

    this.getTasks();
    // this.setTileNotifications();
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

  closePDFView() {
    this._printtoolService._triggerClosingView.emit();
  }

  setCompanySettings() {
    this._kraCompanySettings = this._kraService._kraCompanySettings;
    this._isLoadingKRACompanySettings = false;
    this.checkLoaderAllClear();
  }

  setTiles() {
    if (this._individualTasks) {
      let companyTemplateCopy = JSON.parse(JSON.stringify(this._companyTemplate['linkedTiles']));

      companyTemplateCopy = companyTemplateCopy.filter(item => item.sName === 'Perform');
      this._performTemplate = companyTemplateCopy[0];

      this._linkedCategories = companyTemplateCopy[0]['linkedCategories'];
      this._linkedCategories.forEach(category => {
        category['task'] = [];
        for (const status of Object.keys(this._individualTasks)) {
          if (this._individualTasks[status].length) {
            this._individualTasks[status].forEach(task => {
              if (task['status'] === this._companyTemplate.sCompletedName) {
                // Link reviews tasks to kra reviews category
                if (category['sCategoryName'].toString().toLowerCase().indexOf('performance review') >= 0
                  && task['sSubModuleItem'].indexOf('Performance Review') >= 0) {
                  task['sSurveyName'] = this._kraCompanySettings['sReviewIndexPDFtext'] + ' ' + task['sMonth'] + ' ' + task['sYear'];
                  category['bLoadMore'] = false;
                  category['iTotal'] = 2;
                  category['task'].push(task);
                }
                // Link agreement tasks to kra agreement category
                if ((category['sCategoryName'].toString().toLowerCase().indexOf('agreement') >= 0
                  || category['sCategoryName'].toString().toLowerCase().indexOf('contracting') >= 0)
                  && task['sSubModuleItem'].indexOf('Agreement') >= 0) {
                  task['sSurveyName'] = task['sP7ContractStart'] + ' - ' + task['sP7ContractEnd'];
                  category['task'].push(task);
                  category['bLoadMore'] = false;
                  category['iTotal'] = 2;
                }
              }
            });
          }
          // Link contribution tasks to kra scorecard category
          if (this._kraCompanySettings['bShowContribution']) {
            if (category['sCategoryName'].toString().toLowerCase().indexOf('scorecard') >= 0
              && category['sCategoryName'].toString().toLowerCase().indexOf('department monthly scorecard') == -1
              && category['sCategoryName'].toString().toLowerCase().indexOf('company monthly scorecard') == -1) {
              category['bLoadMore'] = false;
              category['iTotal'] = 2;
              category['task'] = this._contributionScorecards;
            }
          }
        }
      });
      this.bLoadTiles = true;
      this._isLoadingTiles = false;
      this.setTileNotifications();
      this.checkLoaderAllClear();
    }
  }

  setMyMaxReportingTemplateViews() {
    if (this._myMax7Service._myMaxReportingTemplateViews.length > 0) {
      this._myMaxReportingTemplateViews = this._myMax7Service._myMaxReportingTemplateViews;
    }
    this._isLoadingMyMaxTemplate = false;
    this.checkLoaderAllClear();
  }

  async getTasks() {
    this._individualTasks = await this._authService.getIndividualTasks(
      this._performUser['P6_userUID'], this._companyTemplate['portalSetupTemplateUID'], false);
    this.setTasks();
  }

  async setTasks() {
    if (this._kraCompanySettings['bShowContribution']) {
      this._contributionScorecards = await this._contributionScorecardService.getContributionScorecards(this._performUser['P6_userUID']);
      this._contributionScorecards.forEach(scorecard => {
        scorecard['sSurveyName'] = scorecard['sP7SurveyName'];
      });
    }

    for (const status of Object.keys(this._individualTasks)) {
      if (status !== 'totalTasks') {
        this._individualTasks[status] = this._individualTasks[status].filter(item => item.sSubModule === 'kra');
      }
    }
    this.setTiles();
  }

  loadMore(category) {
    category['bLoadMore'] = !category['bLoadMore'];
    category['iTotal'] = category['bLoadMore'] === true ? category['task'].length : 2;
  }

  addFileToCurrentDocuments(fileItem) {
    const documentObj = new Object();
    documentObj['PortalProjectPlanDocumentUploadUID'] = this._uuid;
    documentObj['sFileSize'] = fileItem.file['size'];
    documentObj['sUploadFileName'] = fileItem.file['name'];
    documentObj['sFileType'] = fileItem.file['name'].split('.')[fileItem.file['name'].split('.').length - 1];
    this.projectPlanDocObj = documentObj;

  }


  async addDocuments() {

    const { value: file } = await Swal.fire({
      title: 'Download Template:',
      input: 'file',
      html: '<ion-button class="swalBtn" href="' + this._companyTemplate.sProjectPlanTemplatePath + '" download target="_blank"><ion-icon name="arrow-down-circle-sharp"></ion-icon>Blank Template</ion-button>',
      inputLabel: 'OR upload an existing document',
      heightAuto: false,
      confirmButtonColor: 'var(--primary)',
      confirmButtonText: 'Save',
      inputAttributes: {
        'accept': 'file/*',
        'aria-label': 'Upload file'
      }
    })

    if (file) {
      this.saveUserProjectPlan();
    }

  }

  saveUserProjectPlan() {
    this._kraService.saveProjectPlanDocument(this.projectPlanDocObj, this._sessionUser.P5Corp_userUID)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.emitProjectPlan();
      });
  }

  async emitProjectPlan() {
    this._individualTasks = await this._authService.getIndividualTasks(this._sessionUser.P6_userUID, this._companyTemplate.portalSetupTemplateUID, false);

    Swal.fire({
      title: 'Thank you',
      text: 'Project Plan Submitted Successfully',
      icon: 'success',
      confirmButtonColor: 'var(--primary)',
      showCloseButton: true,
      heightAuto: false,
    });
  }

  printPDF(task, viewMode: boolean) {
    this._loaderService.initLoader(true);
    this._ptViewMode = viewMode;
    this._currentTask = task;
    this._kraService._currentTask = task;
    // this._kraReviewService._currentReview = task;

    if (task['sSubModuleItem'].indexOf('Performance Review') >= 0) {
      // Performance Review'
      this.printKraScoringPDF(task,);
    } else if (task['sSubModuleItem'].indexOf('Agreement') >= 0) {
      // Agreement
      this.printKraContratingPDF(task);
    } else if (task['sSubModuleItem'].toString().toLowerCase().indexOf('scorecard') >= 0) {
      // Contribution Scorecards
      this.printContribution(task, viewMode);
    }
  }

  printKraContratingPDF(task) {
    this._kraService.updateAgreementNotifications(task['EmployeeUID'], task['kraHrURPRoleUID'])
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        // this.getIndividualTasks(task.EmployeeUID, true);
      });
    this._kraService.getKRAPerformanceAgreementPDFProfile()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        if (this._ptViewMode) {
          this._printtoolService.initPerformanceAgreementsView(this._kraService['_agreementPDFProfileData'], false);
          this._loaderService.exitLoader();
        } else {

          this._kraService.printKRAPerformanceAgreementPDFProfile(
            this._kraService['_agreementPDFProfileData']['personalDetails']['sEmployeeUUID'],
            this._kraService['_agreementPDFProfileData']['personalDetails']['kraHrURPRoleUID'])
            .pipe(takeUntil(this.onDestroy))
            .subscribe(v => {
              // do nothing  - pdf opens
              this._loaderService.exitLoader();
            });
          // this._printtoolService.initPerformanceAgreementsLayout(this._kraService['_agreementPDFProfileData']);
        }
      });
  }

  printKraScoringPDF(task) {
    // KRA REVIEW
    this._kraService.updateReviewNotifications(task['EmployeeUID'], task['kraHrURPRoleUID'], task['sYear'], task['iMonth'])
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        // this.getIndividualTasks(task.EmployeeUID, true);
      });
    this._kraService.getReviewPDFData()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        // this._loaderService.initLoader(true);
        if (this._ptViewMode) {
          this._printtoolService.initPerformanceReviewsView(this._kraService['_KRAReviewPDFData'], false);
          this._loaderService.exitLoader();
        } else {
          this._kraService.printReviewPDFData(
            this._kraService['_KRAReviewPDFData']['pdfData']['userPersonalDetails']['userUUID'],
            this._kraService['_KRAReviewPDFData']['pdfData']['kraProfile'][0]['kraHrURPRoleUID'],
            this._kraService['_KRAReviewPDFData']['pdfData']['userPersonalDetails']['dMonthScoredFor'],
            this._currentTask['bScoreInDraft']
          )
            .pipe(takeUntil(this.onDestroy))
            .subscribe(v => {
              // do nothing  - pdf opens
              this._loaderService.exitLoader();
            });
        }
      });
  }

  printContribution(task, viewMode) {
    if (task['sSubModuleItem'].toString().toLowerCase().indexOf('department monthly scorecard') >= 0) {
      if (viewMode) {
        this._contributionScorecardService.getDepartmentContributionScorecardData(task['P5Corp_userUID'], task['dbMonthDate'])
          .pipe(takeUntil(this.onDestroy))
          .subscribe(v => {
            this._printtoolService.initPrintCompanyScorecardReportView(
              this._contributionScorecardService._contributionScorecardData, false);
            this._loaderService.exitLoader();
          });

      } else {
        this._contributionScorecardService.printCompanyContributionScorecardPDFData(task['P5Corp_userUID'], task['dbMonthDate'], true)
          .pipe(takeUntil(this.onDestroy))
          .subscribe(v => {
            this._loaderService.exitLoader();
          });
      }
    } else if (task['sSubModuleItem'].toString().toLowerCase().indexOf('company monthly scorecard') >= 0) {
      if (viewMode) {
        this._contributionScorecardService.getCompanyContributionScorecardData(task['P5Corp_userUID'], task['dbMonthDate'])
          .pipe(takeUntil(this.onDestroy))
          .subscribe(v => {
            this._printtoolService.initPrintCompanyScorecardReportView(
              this._contributionScorecardService._contributionScorecardData, false);
            this._loaderService.exitLoader();
          });

      } else {
        this._contributionScorecardService.printCompanyContributionScorecardPDFData(task['P5Corp_userUID'], task['dbMonthDate'], false)
          .pipe(takeUntil(this.onDestroy))
          .subscribe(v => {
            this._loaderService.exitLoader();
          });
      }
    } else {
      if (viewMode) {
        this._contributionScorecardService.getContributionScorecardData(task['P5Corp_userUID'], task['dbMonthDate'])
          .pipe(takeUntil(this.onDestroy))
          .subscribe(v => {
            this._printtoolService.initPrintContributionScorecardReportView(
              this._contributionScorecardService._contributionScorecardData, false);
            this._loaderService.exitLoader();
          });

      } else {
        this._contributionScorecardService.printContributionScorecardPDFData(task['P5Corp_userUID'], task['dbMonthDate'])
          .pipe(takeUntil(this.onDestroy))
          .subscribe(v => {
            this._loaderService.exitLoader();
          });
      }
    }
  }

  goActivitySummary(sModuleName) {

    this._kraService.taskStatusOptions = this._authService.getNotificationStatusData();
    if (sModuleName === 'Performance Agreement') {
      if (this._agreementNumber == 1) {
        this._kraService._currentTask = this._currentAgreementTask;
        this._kraService._sRoleToEmployee = this._currentAgreementTask['sRoleToEmployee'];
        this._router.navigate(['perform/contracting/period'], { replaceUrl: true });
      } else {
        this._router.navigate(['activity-summary'], { replaceUrl: true });
      }
    } else if (sModuleName === 'Performance Review') {
      if (this._reviewNumber == 1) {
        this._kraService._currentTask = this._currentReviewTask;
        this._kraService._sRoleToEmployee = this._currentReviewTask['sRoleToEmployee'];
        this._kraService._reviewMonth = this._currentReviewTask['iMonth'];
        this._kraService._reviewYear = this._currentReviewTask['sYear'];
        this._router.navigate(['perform/scoring/assessment'], { replaceUrl: true });

      } else {
        this._router.navigate(['activity-summary'], { replaceUrl: true });
      }
    } else {
      this._router.navigate(['activity-summary'], { replaceUrl: true });

    }


  }

  goDiscussionManual() {
    this._router.navigate(['perform/scoring/discussion-manual'], { replaceUrl: true });
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

    tasks['1_arrears'] = tasks['1_arrears'].filter((item) => item.sSubModuleItem === 'Performance Agreement'
      || item.sSubModuleItem === 'Performance Review');
    tasks['1_arrears'] = tasks['1_arrears'].filter((item) => item.EmployeeUID === this._performUser['P6_userUID']);
    for (let i = 0; i < tasks['1_arrears'].length; i++) {
      if (tasks['1_arrears'][i]['sSubModuleItem'] === 'Performance Agreement') {
        this._agreementNumber = this._agreementNumber + 1;
        this._currentAgreementTask = tasks['1_arrears'][i];
      }
      if (tasks['1_arrears'][i]['sSubModuleItem'] === 'Performance Review') {
        this._reviewNumber = this._reviewNumber + 1;
        this._currentReviewTask = tasks['1_arrears'][i];
      }
    }

    tasks['2_draft'] = tasks['2_draft'].filter((item) => item.sSubModuleItem === 'Performance Agreement'
      || item.sSubModuleItem === 'Performance Review');
    tasks['2_draft'] = tasks['2_draft'].filter((item) => item.EmployeeUID === this._performUser['P6_userUID']);
    for (let i = 0; i < tasks['2_draft'].length; i++) {
      if (tasks['2_draft'][i]['sSubModuleItem'] === 'Performance Agreement') {
        this._agreementNumber = this._agreementNumber + 1;
        this._currentAgreementTask = tasks['2_draft'][i];
      }
      if (tasks['2_draft'][i]['sSubModuleItem'] === 'Performance Review') {
        this._reviewNumber = this._reviewNumber + 1;
        this._currentReviewTask = tasks['2_draft'][i];
      }
    }

    tasks['3_current'] = tasks['3_current'].filter((item) => item.sSubModuleItem === 'Performance Agreement'
      || item.sSubModuleItem === 'Performance Review');
    tasks['3_current'] = tasks['3_current'].filter((item) => item.EmployeeUID === this._performUser['P6_userUID']);
    for (let i = 0; i < tasks['3_current'].length; i++) {
      if (tasks['3_current'][i]['sSubModuleItem'] === 'Performance Agreement') {
        this._agreementNumber = this._agreementNumber + 1;
        this._currentAgreementTask = tasks['3_current'][i];
      }
      if (tasks['3_current'][i]['sSubModuleItem'] === 'Performance Review') {
        this._reviewNumber = this._reviewNumber + 1;
        this._currentReviewTask = tasks['3_current'][i];
      }

    }

    tasks['6_upcoming'] = tasks['6_upcoming'].filter((item) => item.sSubModuleItem === 'Performance Agreement'
      || item.sSubModuleItem === 'Performance Review');
    tasks['6_upcoming'] = tasks['6_upcoming'].filter((item) => item.EmployeeUID === this._performUser['P6_userUID']);
    for (let i = 0; i < tasks['6_upcoming'].length; i++) {
      if (tasks['6_upcoming'][i]['sSubModuleItem'] === 'Performance Agreement') {
        this._agreementNumber = this._agreementNumber + 1;
      }
      if (tasks['6_upcoming'][i]['sSubModuleItem'] === 'Performance Review') {
        this._reviewNumber = this._reviewNumber + 1;
      }
    }
  }


}
