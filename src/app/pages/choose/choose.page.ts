import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CompanyTemplate, MyMaxTemplateMenu, SessionUser, Task } from '../../_models';
import { AuthService, ChooseQuestionnaireService, ConversationService, EmployeeDirectoryService, KraService, LoaderService, MyMax7Service, PrintToolService, RecruitmentService } from '../../_services/index';

@Component({
  selector: 'app-choose',
  templateUrl: './choose.page.html',
  styleUrls: ['./choose.page.scss'],
})
export class ChoosePage implements OnInit, OnDestroy {

  _individualTasks: Task;
  _teamTasks: Task;
  _sessionUser: SessionUser;
  _selectedUser = {};
  _companyTemplate: CompanyTemplate;
  _kraCompanySettings = {};
  _myMaxReportingTemplateViews: MyMaxTemplateMenu[] = [];
  _portalTiles = [];
  _linkedCategories = [];
  _linkedTile = {};
  bLoadTiles = false;
  _chooseTemplate = {};

  _isLoadingKRACompanySettings = true;
  _isLoadingTiles = true;
  _isLoadingMyMaxTemplate = true;
  _isLoading = true;
  _currentTask: any = {};
  _conversationFeedCat = [];

  _vacancyNumber = 0;
  _chooseNumber = 0;

  private selectedUserSub: Subscription;
  private readonly onDestroy = new Subject<void>();

  constructor (private _router: Router,
    public _authService: AuthService,
    public _myMax7Service: MyMax7Service,
    private activatedRoute: ActivatedRoute,
    private _employeeDirectoryService: EmployeeDirectoryService,
    public _loaderService: LoaderService,
    private _printtoolService: PrintToolService,
    private _kraService: KraService,
    public _conversationService: ConversationService,
    private _chooseQuestionnaireService: ChooseQuestionnaireService,
    public _recruitmentService: RecruitmentService) {
    this.selectedUserSub = this._employeeDirectoryService._employeePerformUserChanged.subscribe(
      (value) => this.setSelectedUser()
    );
  }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._authService.hideAppPanel(false);
    this._sessionUser = this._authService._sessionUser;
    this._companyTemplate = this._sessionUser['companytemplate'];
    this._individualTasks = this._authService._individualTasks;
    this._kraCompanySettings = this._kraService._kraCompanySettings;
    this._conversationFeedCat = [];

    this._vacancyNumber = 0;
    this._chooseNumber = 0;

    if ('P6_userUID' in this._employeeDirectoryService._performUser) {
      this._selectedUser = this._employeeDirectoryService._performUser;
    } else {
      this._selectedUser = this._sessionUser;
    }

    if (this._companyTemplate.linkedTiles.length > 0) {
      const pageIndex = this._companyTemplate.linkedTiles.findIndex(x => x['sName'] == 'Choose');
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

    this._myMax7Service.getMyMaxReportingTemplateViews(this._linkedTile['portalTemplateTileUID'], 'Personal', this._selectedUser['P6_userUID'])
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
    this.selectedUserSub.unsubscribe();
    this.closePDFView();
  }

  closePDFView() {
    this._printtoolService._triggerClosingView.emit();
  }

  setSelectedUser() {
    this._loaderService.initLoader(true);
    this._vacancyNumber = 0;
    this._chooseNumber = 0;
    this._selectedUser = this._employeeDirectoryService._performUser;
    this.closePDFView();

    if ('userUUID' in this._selectedUser) {
      this._selectedUser['P6_userUID'] = this._selectedUser['userUUID'];
    }
    if ('sJobTitleName' in this._selectedUser) {
      this._selectedUser['sJobTitle'] = this._selectedUser['sJobTitleName'];
    }

    this.getTasks();
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

  async getTasks() {
    this._individualTasks = await this._authService.getIndividualTasks(
      this._selectedUser['P6_userUID'], this._companyTemplate['portalSetupTemplateUID'], true);
    this.setTasks();
  }

  async setTasks() {
    for (const status of Object.keys(this._individualTasks)) {
      if (status !== 'totalTasks') {
        this._individualTasks[status] = this._individualTasks[status].filter(item =>
          item.sSubModuleItem === 'Choose' || item.sSubModuleItem === 'Recruitment');
      }
    }
    this.setTiles();
  }

  setTiles() {
    if (this._individualTasks) {
      let companyTemplateCopy = JSON.parse(JSON.stringify(this._companyTemplate['linkedTiles']));

      companyTemplateCopy = companyTemplateCopy.filter(item => item.sName === 'Choose');
      this._chooseTemplate = companyTemplateCopy[0];

      this._linkedCategories = companyTemplateCopy[0]['linkedCategories'];

      this._linkedCategories.forEach(category => {
        category['task'] = [];
        for (const status of Object.keys(this._individualTasks)) {
          if (this._individualTasks[status].length) {
            this._individualTasks[status].forEach(task => {
              if (task['status'] === this._companyTemplate.sCompletedName) {
                if (category['sCategoryName'].toString().toLowerCase().indexOf('career aspirations') >= 0
                  && task['sSubModuleItem'].indexOf('Choose') >= 0) {
                  task['sSurveyName'] = task['sSurveyName'];
                  category['task'].push(task);
                  category['bLoadMore'] = false;
                  category['iTotal'] = 2;
                }
              }
              if (task['status'] === this._companyTemplate.sCompletedName) {
                if (category['sCategoryName'].toString().toLowerCase().indexOf('recruitment') >= 0
                  && task['sSubModuleItem'].indexOf('Recruitment') >= 0) {
                  task['sSurveyName'] = task['sSurveyDateName'];
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
      this.setTileNotifications();
      this.checkLoaderAllClear();
    }
  }

  loadMore(category) {
    category['bLoadMore'] = !category['bLoadMore'];
    category['iTotal'] = category['bLoadMore'] === true ? category['task'].length : 2;
  }

  printPDF(task, viewMode: boolean) {
    this._loaderService.initLoader(true);
    this._currentTask = task;
    if (task['sSubModuleItem'].indexOf('Choose') >= 0) {
      this.printChooseQuestionnaire(task, viewMode);
    }
    if (task['sSubModuleItem'].toString().toLowerCase().indexOf('recruitment') >= 0) {
      this.printRecruitment(task, viewMode);
    }
  }

  printChooseQuestionnaire(task, viewMode) {
    if (viewMode) {
      this._chooseQuestionnaireService.getChooseQuestionnaireReportData(task['UserChooseQuestionnaireUID'], false)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this._printtoolService.initPrintChooseQuestionnaireReportView(this._chooseQuestionnaireService['_reportData']);
          this._loaderService.exitLoader();
        });
    } else {
      this._chooseQuestionnaireService.printChooseQuestionnaireReport(task['UserChooseQuestionnaireUID'])
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this._loaderService.exitLoader();
        });
    }
  }

  printRecruitment(task, viewMode) {
    if (viewMode) {
      this._recruitmentService.getRecruitmentReport(task)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this._printtoolService.initPrintRecruitmentReportView(this._recruitmentService._reportData, true);
          this._loaderService.exitLoader();
        });
    } else {
      this._recruitmentService.printRecruitmentReport(task)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this._loaderService.exitLoader();
        });
    }
  }

  goChooseQuestionnaire() {
    for (let i = 0; i < this._individualTasks['3_current'].length; i++) {
      if (this._individualTasks['3_current'][i]['sSubModule'] === 'questionnaire') {
        this._router.navigate(['choose/choose-questionnaire/section1'], { replaceUrl: true });
      } else {
        this._router.navigate(['activity-summary'], { replaceUrl: true });
      }
      break;
    }
  }

  goRecruitmentLibrary() {
    this._router.navigate(['choose/recruitment/list'], { replaceUrl: true });
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
    if ('userUUID' in this._selectedUser) {
      tasks = JSON.parse(JSON.stringify(this._teamTasks));
    } else {
      tasks = JSON.parse(JSON.stringify(this._individualTasks));
    }

    tasks['1_arrears'] = tasks['1_arrears'].filter((item) => item.sSubModuleItem === 'Recruitment'
      || item.sSubModuleItem === 'Choose');
    tasks['1_arrears'] = tasks['1_arrears'].filter((item) => item.EmployeeUID === this._selectedUser['P6_userUID'] ||
      item.assessorUUID === this._selectedUser['P6_userUID']);
    for (let i = 0; i < tasks['1_arrears'].length; i++) {
      if (tasks['1_arrears'][i]['sSubModuleItem'] === 'Recruitment') {
        this._vacancyNumber = this._vacancyNumber + 1;
      }
      if (tasks['1_arrears'][i]['sSubModuleItem'] === 'Choose') {
        this._chooseNumber = this._chooseNumber + 1;
      }
    }

    tasks['2_draft'] = tasks['2_draft'].filter((item) => item.sSubModuleItem === 'Recruitment'
      || item.sSubModuleItem === 'Choose');
    tasks['2_draft'] = tasks['2_draft'].filter((item) => item.EmployeeUID === this._selectedUser['P6_userUID'] ||
      item.assessorUUID === this._selectedUser['P6_userUID']);
    for (let i = 0; i < tasks['2_draft'].length; i++) {
      if (tasks['2_draft'][i]['sSubModuleItem'] === 'Recruitment') {
        this._vacancyNumber = this._vacancyNumber + 1;
      }
      if (tasks['2_draft'][i]['sSubModuleItem'] === 'Choose') {
        this._chooseNumber = this._chooseNumber + 1;
      }
    }

    tasks['3_current'] = tasks['3_current'].filter((item) => item.sSubModuleItem === 'Recruitment'
      || item.sSubModuleItem === 'Choose');
    tasks['3_current'] = tasks['3_current'].filter((item) => item.EmployeeUID === this._selectedUser['P6_userUID'] ||
      item.assessorUUID === this._selectedUser['P6_userUID']);
    for (let i = 0; i < tasks['3_current'].length; i++) {
      if (tasks['3_current'][i]['sSubModuleItem'] === 'Recruitment') {
        this._vacancyNumber = this._vacancyNumber + 1;
      }
      if (tasks['3_current'][i]['sSubModuleItem'] === 'Choose') {
        this._chooseNumber = this._chooseNumber + 1;
      }
    }

    tasks['6_upcoming'] = tasks['6_upcoming'].filter((item) => item.sSubModuleItem === 'Recruitment'
      || item.sSubModuleItem === 'Choose');
    tasks['6_upcoming'] = tasks['6_upcoming'].filter((item) => item.EmployeeUID === this._selectedUser['P6_userUID'] ||
      item.assessorUUID === this._selectedUser['P6_userUID']);
    for (let i = 0; i < tasks['6_upcoming'].length; i++) {
      if (tasks['6_upcoming'][i]['sSubModuleItem'] === 'Recruitment') {
        this._vacancyNumber = this._vacancyNumber + 1;
      }
      if (tasks['6_upcoming'][i]['sSubModuleItem'] === 'Choose') {
        this._chooseNumber = this._chooseNumber + 1;
      }
    }
  }
}
