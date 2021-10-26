import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CompanyTemplate, MyMaxTemplateMenu, SessionUser, Task } from '../../_models';
import {
  AuthService, ConversationService, EmployeeDirectoryService,
  ExpertiseReviewService,
  KraPdpService,
  KraService,
  LoaderService,
  MyMax7Service,
  PrintToolService,
  SWOTAnalysisService,
  ThreeSixtyService
} from '../../_services/index';

@Component({
  selector: 'app-grow',
  templateUrl: './grow.page.html',
  styleUrls: ['./grow.page.scss'],
})
export class GrowPage implements OnInit, OnDestroy {

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
  _growTemplate = {};

  _isLoadingKRACompanySettings = true;
  _isLoadingTiles = true;
  _isLoadingMyMaxTemplate = true;
  _isLoading = true;
  _currentTask: any = {};
  _conversationFeedCat = [];

  _expertiseNumber = 0;
  _competencyNumber = 0;
  _pdpNumber = 0;
  _swotNumber = 0;

  _currentExpertiseTask: any = {};
  _currentCompetencyTask: any = {};

  private performUserSub: Subscription;
  private readonly onDestroy = new Subject<void>();

  constructor(private _router: Router,
    public _authService: AuthService,
    public _myMax7Service: MyMax7Service,
    private activatedRoute: ActivatedRoute,
    private _employeeDirectoryService: EmployeeDirectoryService,
    private _threeSixtyService: ThreeSixtyService,
    public _SWOTAnalysisService: SWOTAnalysisService,
    public _kraPdpService: KraPdpService,
    public _expertiseReviewService: ExpertiseReviewService,
    private _printtoolService: PrintToolService,
    public _conversationService: ConversationService,
    public _loaderService: LoaderService,
    private _kraService: KraService) {
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

    this._expertiseNumber = 0;
    this._competencyNumber = 0;
    this._pdpNumber = 0;
    this._swotNumber = 0;

    if ('P6_userUID' in this._employeeDirectoryService._performUser) {
      this._performUser = this._employeeDirectoryService._performUser;
    } else {
      this._performUser = this._sessionUser;
    }

    if (this._companyTemplate.linkedTiles.length > 0) {
      const pageIndex = this._companyTemplate.linkedTiles.findIndex(x => x['sName'] == 'Grow');
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

    this._conversationService.getLatestConversationForCat(this._sessionUser['P6_userUID'], 'grow')
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
    this._expertiseNumber = 0;
    this._competencyNumber = 0;
    this._pdpNumber = 0;
    this._swotNumber = 0;
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

  async getTasks() {
    this._individualTasks = await this._authService.getIndividualTasks(
      this._performUser['P6_userUID'], this._companyTemplate['portalSetupTemplateUID'], true);
    this.setTasks();
  }

  async setTasks() {
    for (const status of Object.keys(this._individualTasks)) {
      if (status !== 'totalTasks') {
        this._individualTasks[status] = this._individualTasks[status].filter(item =>
          item.sSubModule === 'competency' || item.sSubModuleItem === 'Contract PDP' || item.sSubModule === 'SWOTAnalysis' || item.sSubModuleItem === 'Integrated PDP');
      }
    }
    this.setTiles();
  }

  setTiles() {
    if (this._individualTasks) {
      let companyTemplateCopy = JSON.parse(JSON.stringify(this._companyTemplate['linkedTiles']));

      companyTemplateCopy = companyTemplateCopy.filter(item => item.sName === 'Grow');
      this._growTemplate = companyTemplateCopy[0];

      this._linkedCategories = companyTemplateCopy[0]['linkedCategories'];

      this._linkedCategories.forEach(category => {
        category['task'] = [];
        for (const status of Object.keys(this._individualTasks)) {
          if (this._individualTasks[status].length) {
            this._individualTasks[status].forEach(task => {
              if (task['status'] === this._companyTemplate.sCompletedName) {
                if (category['sCategoryName'].toString().toLowerCase().indexOf('expertise') >= 0
                  && task['sSubModuleItem'].indexOf('Expertise Review') >= 0) {
                  task['sSurveyName'] = task['sSurveyDateName'];
                  category['task'].push(task);
                  category['bLoadMore'] = false;
                  category['iTotal'] = 2;
                }
                if ((category['sCategoryName'].toString().toLowerCase().indexOf('competencies') >= 0)
                  && task['sSubModuleItem'].indexOf('Competency') >= 0) {
                  task['sSurveyName'] = task['sSurveyDateName'];
                  category['task'].push(task);
                  category['bLoadMore'] = false;
                  category['iTotal'] = 2;
                }
                if ((category['sCategoryName'].toString().toLowerCase().indexOf('personal development plan') >= 0)
                  && task['sSubModuleItem'].indexOf('Contract PDP') >= 0) {
                  task['sSurveyName'] = task['sSurveyName'];
                  category['task'].push(task);
                  category['bLoadMore'] = false;
                  category['iTotal'] = 2;
                }
                if ((category['sCategoryName'].toString().toLowerCase().indexOf('personal development plan') >= 0)
                  && task['sSubModuleItem'].indexOf('Integrated PDP') >= 0) {
                  task['sSurveyName'] = task['sSurveyName'];
                  category['task'].push(task);
                  category['bLoadMore'] = false;
                  category['iTotal'] = 2;
                }
                if ((category['sCategoryName'].toString().toLowerCase().indexOf('swot analysis') >= 0)
                  && task['sSubModuleItem'].indexOf('SWOT Analysis') >= 0) {
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
      this.setTileNotifications();
      this.checkLoaderAllClear();
    }
  }

  loadMore(category) {
    category['bLoadMore'] = !category['bLoadMore'];
    category['iTotal'] = category['bLoadMore'] === true ? category['task'].length : 2;
  }

  goPDP(tasks) {
    if (this._kraCompanySettings['bShowIntegratedPDP']) {
      if (this._performUser['userUUID'] !== this._sessionUser['P5Corp_userUID']) {
        for (let i = 0; i < tasks['3_current'].length; i++) {
          if (tasks['3_current'][i]['sSubModuleItem'] === 'Integrated PDP') {

            if (tasks['3_current'][i]['EmployeeUID'] === this._performUser['userUUID']) {
              this._kraPdpService._currentPDP = tasks['3_current'][i];
              this._router.navigate(['grow/pdp/integrated/list'], { replaceUrl: true });
            } else {
              this._router.navigate(['activity-summary'], { replaceUrl: true });
            }
          }
        }
      } else {
        this._router.navigate(['grow/pdp/integrated/list'], { replaceUrl: true });
      }
    } else {
      this._router.navigate(['grow/pdp/manual'], { replaceUrl: true });
    }
  }

  printPDF(task, viewMode: boolean) {
    this._loaderService.initLoader(true);
    // this._ptViewMode = viewMode;
    this._currentTask = task;

    if (task['sSubModuleItem'].indexOf('Competency') >= 0) {
      // Competency Review

      this.printCompetency(task, viewMode);
    } else if (task['sSubModuleItem'].toString().toLowerCase().indexOf('expertise') >= 0) {
      // Expertise Review
      this.printExpertise(task, viewMode);
    } else if (task['sSubModuleItem'].indexOf('SWOT Analysis') >= 0) {
      // SWOT Analysis
      this.printSwotAnalysis(task, viewMode);
    } else if (task['sSubModuleItem'].indexOf('Contract PDP') >= 0) {
      // Contract PDP
      this.printContractPDP(task, viewMode);
    } else if (task['sSubModuleItem'].indexOf('Integrated PDP') >= 0) {
      this.printIntegratedPDP(task, viewMode);
    }
  }

  printCompetency(assessee, viewMode) {
    /* bPDF is manipulated here as this value depicts what data should show.
      for the Assessee his data should always return all assessor data but the opposite is true for the assessor
      as it only shows the data the assessor scored. The functon getThreeSixtyReport is called in many places
      but the bPDF value is set to true only on the indivprint view */
    assessee['bPDF'] = true;
    this._threeSixtyService._selectedAssessee = assessee;
    this._threeSixtyService.getThreeSixtyReport(assessee)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._threeSixtyService.updateThreeSixtyNotifications(assessee.assesseeUUID, assessee.compAssessmentUID).pipe(takeUntil(this.onDestroy)).subscribe(v => {
          // this.getIndividualTasks(assessee.assesseeUUID, true);
        });
        if (viewMode) {
          this._printtoolService.initPrintThreesixtyReportView(this._threeSixtyService['_reportData'], false);
          this._loaderService.exitLoader();
        } else {
          this._threeSixtyService.printThreeSixtyReport(this._threeSixtyService._selectedAssessee)
            .pipe(takeUntil(this.onDestroy))
            .subscribe(v => {
              this._loaderService.exitLoader();
            });
        }
      });
  }

  printExpertise(task, viewMode) {
    // Self Survey Assessment
    this._expertiseReviewService.updateExpertiseNotifications(task.sAssessorInternal_fkUserUUID, task.SkillsAssessmentUID)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        // this.getIndividualTasks(task.sAssessorInternal_fkUserUUID, true);
      });
    if (viewMode) {
      this._expertiseReviewService.getExpertiseReviewReport(task)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this._printtoolService.initPrintExpertiseReviewReportView(this._expertiseReviewService._reportData, false);
          this._loaderService.exitLoader();
        });

    } else {
      this._expertiseReviewService.printExpertiseReviewReport(task)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this._loaderService.exitLoader();
        });
    }
  }

  printSwotAnalysis(task, viewMode) {
    this._SWOTAnalysisService.getSWOTAnalysisPDFReportData(task)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        if (viewMode) {
          this._printtoolService.initPrintSWOTReportView(this._SWOTAnalysisService['_SWOTAnalysisPDFReportData']);
          this._loaderService.exitLoader();
        } else {
          this._SWOTAnalysisService.printSWOTAnalysisReport(
            this._SWOTAnalysisService['_SWOTAnalysisPDFReportData']['PersonalDetails']['sEmployeeFullName'],
            this._SWOTAnalysisService['_SWOTAnalysisPDFReportData']['PersonalDetails']['UserUUID'],
            this._SWOTAnalysisService['_SWOTAnalysisPDFReportData']['SWOTAnalysis']['iMonth'],
            this._SWOTAnalysisService['_SWOTAnalysisPDFReportData']['SWOTAnalysis']['iYear'],
            this._SWOTAnalysisService['_SWOTAnalysisPDFReportData']['SWOTAnalysis']['SWOTAnalysisManualObjectivesUID']
          )
            .pipe(takeUntil(this.onDestroy))
            .subscribe(v => {
              this._loaderService.exitLoader();
            });
        }
      });
  }

  printContractPDP(task, viewMode) {
    if (viewMode) {
      this._kraPdpService.getContractedPdpPdfData(task['kraHrURPRoleUID'])
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this._printtoolService.initPrintPDPReportView(this._kraPdpService['_contractedPdpPDFData']);
          this._loaderService.exitLoader();
        });
    } else {
      this._kraPdpService.printManualPDPReport(task['kraHrURPRoleUID'], task['EmployeeUID'], this._sessionUser['sFullName'])
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this._loaderService.exitLoader();
        });
    }
  }

  printIntegratedPDP(task, viewMode) {
    if (viewMode) {
      this._kraPdpService.getIntegratedPdpPdfReportData(task['CompAssessmentUID'], task['EmployeeUID'])
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this._printtoolService.initPrintIntegratedPDPReportView(this._kraPdpService['_integratedPdpPDFData']);
          this._loaderService.exitLoader();
        });
    } else {
      this._kraPdpService.printIntegratedPDPReport(task['CompAssessmentUID'], task['EmployeeUID'], task['sEmployeeFullName'])
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this._loaderService.exitLoader();
        });
    }
  }

  goSwotAnalysis() {
    this._router.navigate(['grow/swot-analysis'], { replaceUrl: true });
  }

  goActivitySummary(sModuleName) {
    if (sModuleName === 'Expertise Review') {
      this._expertiseReviewService._expertise_review_assessees_pending = [];
      this._expertiseReviewService._expertise_review_assessees_completed = [];
      // set assessment
      this._expertiseReviewService._selectedAssessment = this._currentExpertiseTask;
      // navigate to assessee page
      this._router.navigate(['grow/expertise-review/assessee'], { replaceUrl: true });
    } else {
      this._threeSixtyService._threeSixty_assessees_pending = [];
      this._threeSixtyService._threeSixty_assessees_completed = [];
      // set assessment
      this._threeSixtyService._selectedAssessment = this._currentCompetencyTask;

      // navigate to assessee page
      this._router.navigate(['grow/three-sixty/list'], { replaceUrl: true });
    }

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

    tasks['1_arrears'] = tasks['1_arrears'].filter((item) =>
      item.sSubModuleItem === 'Expertise Review' ||
      item.sSubModuleItem === 'Competency' ||
      item.sSubModuleItem === 'Manual PDP' ||
      item.sSubModuleItem === 'SWOT Analysis' ||
      item.sSubModuleItem === 'Integrated PDP');

    tasks['1_arrears'] = tasks['1_arrears'].filter((item) => item.assessorUUID === this._performUser['P6_userUID'] || item.EmployeeUID === this._performUser['P6_userUID']);
    for (let i = 0; i < tasks['1_arrears'].length; i++) {
      if (tasks['1_arrears'][i]['sSubModuleItem'] === 'Expertise Review') {
        this._expertiseNumber = this._expertiseNumber + 1;
        this._currentExpertiseTask = tasks['1_arrears'][i];
      }

      if (tasks['1_arrears'][i]['sSubModuleItem'] === 'Competency' && tasks['1_arrears'][i]['sSubModule'] === 'competency') {
        this._competencyNumber = this._competencyNumber + 1;
        this._currentCompetencyTask = tasks['1_arrears'][i];
      }

      if (tasks['1_arrears'][i]['sSubModuleItem'] === 'Integrated PDP' || tasks['1_arrears'][i]['sSubModuleItem'] === 'Manual PDP') {
        this._pdpNumber = this._pdpNumber + 1;
      }

      if (tasks['1_arrears'][i]['sSubModuleItem'] === 'SWOT Analysis') {
        this._swotNumber = this._swotNumber + 1;
      }
    }

    tasks['2_draft'] = tasks['2_draft'].filter((item) =>
      item.sSubModuleItem === 'Expertise Review' ||
      item.sSubModuleItem === 'Competency' ||
      item.sSubModuleItem === 'Manual PDP' ||
      item.sSubModuleItem === 'SWOT Analysis' ||
      item.sSubModuleItem === 'Integrated PDP');

    tasks['2_draft'] = tasks['2_draft'].filter((item) => item.assessorUUID === this._performUser['P6_userUID'] || item.EmployeeUID === this._performUser['P6_userUID']);
    for (let i = 0; i < tasks['2_draft'].length; i++) {
      if (tasks['2_draft'][i]['sSubModuleItem'] === 'Expertise Review') {
        this._expertiseNumber = this._expertiseNumber + 1;
        this._currentExpertiseTask = tasks['2_draft'][i];
      }

      if (tasks['2_draft'][i]['sSubModuleItem'] === 'Competency' && tasks['2_draft'][i]['sSubModule'] === 'competency') {
        this._competencyNumber = this._competencyNumber + 1;
        this._currentCompetencyTask = tasks['2_draft'][i];
      }

      if (tasks['2_draft'][i]['sSubModuleItem'] === 'Integrated PDP' || tasks['2_draft'][i]['sSubModuleItem'] === 'Manual PDP') {
        this._pdpNumber = this._pdpNumber + 1;
      }

      if (tasks['2_draft'][i]['sSubModuleItem'] === 'SWOT Analysis') {
        this._swotNumber = this._swotNumber + 1;
      }
    }

    tasks['3_current'] = tasks['3_current'].filter((item) =>
      item.sSubModuleItem === 'Expertise Review' ||
      item.sSubModuleItem === 'Competency' ||
      item.sSubModuleItem === 'Manual PDP' ||
      item.sSubModuleItem === 'SWOT Analysis' ||
      item.sSubModuleItem === 'Integrated PDP');

    tasks['3_current'] = tasks['3_current'].filter((item) => item.assessorUUID === this._performUser['P6_userUID'] || item.EmployeeUID === this._performUser['P6_userUID']);
    for (let i = 0; i < tasks['3_current'].length; i++) {
      if (tasks['3_current'][i]['sSubModuleItem'] === 'Expertise Review') {
        this._expertiseNumber = this._expertiseNumber + 1;
        this._currentExpertiseTask = tasks['3_current'][i];
      }

      if (tasks['3_current'][i]['sSubModuleItem'] === 'Competency' && tasks['3_current'][i]['sSubModule'] === 'competency') {
        this._competencyNumber = this._competencyNumber + 1;
        this._currentCompetencyTask = tasks['3_current'][i];
      }

      if (tasks['3_current'][i]['sSubModuleItem'] === 'Integrated PDP' || tasks['3_current'][i]['sSubModuleItem'] === 'Manual PDP') {
        this._pdpNumber = this._pdpNumber + 1;
      }

      if (tasks['3_current'][i]['sSubModuleItem'] === 'SWOT Analysis') {
        this._swotNumber = this._swotNumber + 1;
      }
    }

    tasks['6_upcoming'] = tasks['6_upcoming'].filter((item) =>
      item.sSubModuleItem === 'Expertise Review' ||
      item.sSubModuleItem === 'Competency' ||
      item.sSubModuleItem === 'Manual PDP' ||
      item.sSubModuleItem === 'SWOT Analysis' ||
      item.sSubModuleItem === 'Integrated PDP');
    tasks['6_upcoming'] = tasks['6_upcoming'].filter((item) => item.assessorUUID === this._performUser['P6_userUID'] || item.EmployeeUID === this._performUser['P6_userUID']);
    for (let i = 0; i < tasks['6_upcoming'].length; i++) {
      if (tasks['6_upcoming'][i]['sSubModuleItem'] === 'Expertise Review') {
        this._expertiseNumber = this._expertiseNumber + 1;
      }

      if (tasks['6_upcoming'][i]['sSubModuleItem'] === 'Competency' && tasks['6_upcoming'][i]['sSubModule'] === 'competency') {
        this._competencyNumber = this._competencyNumber + 1;
      }

      if (tasks['6_upcoming'][i]['sSubModuleItem'] === 'Integrated PDP' || tasks['6_upcoming'][i]['sSubModuleItem'] === 'Manual PDP') {
        this._pdpNumber = this._pdpNumber + 1;
      }

      if (tasks['6_upcoming'][i]['sSubModuleItem'] === 'SWOT Analysis') {
        this._swotNumber = this._swotNumber + 1;
      }
    }
  }
}
