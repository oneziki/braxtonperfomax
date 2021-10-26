import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { CompanyTemplate, MyMaxTemplateMenu, SessionUser, Task } from '../../_models';
import {
  AuthService,
  EmployeeDirectoryService,
  KraService,
  LoaderService,
  MyMax7Service, PersonalPortfolioService, PrintToolService,
  TrainingService
} from '../../_services/index';


@Component({
  selector: 'app-aspire',
  templateUrl: './aspire.page.html',
  styleUrls: ['./aspire.page.scss'],
})
export class AspirePage implements OnInit, OnDestroy {
  // Image AND PDF's
  _individualTasks: Task;
  _sessionUser: SessionUser;
  _selectedUser = {};
  _companyTemplate: CompanyTemplate;
  _kraCompanySettings = {};
  _myMaxReportingTemplateViews: MyMaxTemplateMenu[] = [];
  _portalTiles = [];
  _linkedCategories = [];
  _linkedTile = {};
  bLoadTiles = false;
  _aspireTemplate = {};

  _isLoadingKRACompanySettings = true;
  _isLoadingTiles = true;
  _isLoadingMyMaxTemplate = true;
  _isLoading = true;
  _currentTask: any = {};

  // Training
  _isLoadingTraining = true;
  _employeeView = true;
  _managerView = false;

  _trainingNeedsData: object = {};
  _trainingNeeds = [];
  _sRoleToEmployee: string;
  _bView = false;
  _bNoData = false;
  _bPortfolioData = true;

  private selectedUserSub: Subscription;
  private readonly onDestroy = new Subject<void>();

  constructor (private _router: Router,
    public _authService: AuthService,
    public _myMax7Service: MyMax7Service,
    private activatedRoute: ActivatedRoute,
    private _employeeDirectoryService: EmployeeDirectoryService,
    public _loaderService: LoaderService,
    private _trainingService: TrainingService,
    public _personalPortfolioService: PersonalPortfolioService,
    private _printtoolService: PrintToolService,
    private _kraService: KraService) {
    this.selectedUserSub = this._employeeDirectoryService._employeePerformUserChanged.subscribe(
      (value) => this.setSelectedUser()
    );
  }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._authService.hideAppPanel(false);
    this._employeeView = true;
    this._sessionUser = this._authService._sessionUser;
    this._companyTemplate = this._sessionUser['companytemplate'];
    this._individualTasks = this._authService._individualTasks;
    this._bPortfolioData = true;

    this._selectedUser = this._sessionUser;

    if (this._companyTemplate.linkedTiles.length > 0) {
      const pageIndex = this._companyTemplate.linkedTiles.findIndex(x => x['sName'] == 'Aspire');
      if (pageIndex !== -1) {
        this._linkedTile = this._companyTemplate.linkedTiles[pageIndex];
      }
    }

    this.getTasks();
    this._loaderService.exitLoader();
    this.getTrainingNeedsDataEmployee();
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
    this._isLoadingTraining = true;
    this._selectedUser = this._employeeDirectoryService._performUser;

    if (this._selectedUser['P6_userUID'] !== this._sessionUser['P6_userUID']) {
      this._employeeView = false;
      this.getUserDataManager();
    } else {
      this._employeeView = true;
      this.getTrainingNeedsDataEmployee();
    }
    this.closePDFView();
  }

  checkLoaderAllClear() {
    let toReturn = true;

    if (this._isLoadingTiles) {
      toReturn = false;
    }
    if (this._isLoadingTraining) {
      toReturn = false;
    }
    if (toReturn === true) {
      this._isLoading = false;
      this._loaderService.exitLoader();
    }
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
          item.sSubModule === 'competency' || item.sSubModuleItem === 'Contract PDP' || item.sSubModule === 'SWOTAnalysis');
      }
    }
    this.setTiles();
  }

  setTiles() {
    if (this._individualTasks) {
      let aspire = JSON.parse(JSON.stringify(this._companyTemplate['linkedTiles']));
      let portfolio = JSON.parse(JSON.stringify(this._companyTemplate['linkedTiles']));

      aspire = aspire.filter(item => item.sName === 'Aspire');
      portfolio = portfolio.filter(item => item.sName === 'Personal Portfolio');
      this._aspireTemplate = aspire[0];

      if (portfolio.length !== 0) {
        this._bPortfolioData = true
        this._linkedCategories = portfolio[0]['linkedCategories'];
        this._linkedCategories.forEach(category => {
          category['task'] = [];
          for (const status of Object.keys(this._individualTasks)) {
            if (this._individualTasks[status].length) {
              if (category['sCategoryName'].toString().toLowerCase().indexOf('personal portfolio') >= 0) {
                category['task'] = [{
                  P5Corp_userUID: this._authService._userUUID,
                  sSubModuleItem: 'Personal Portfolio',
                  sSurveyName: 'Personal Portfolio'
                }];
              }
              category['iTotal'] = 2;
            }
          }
        });
      } else {
        this._bPortfolioData = false;
      }
      this.bLoadTiles = true;
      this._isLoadingTiles = false;
      this.checkLoaderAllClear();
    }
  }

  printPDF(task, viewMode: boolean) {
    this._loaderService.initLoader(true);
    let userUUID: string;
    if ('userUUID' in this._selectedUser) {
      userUUID = this._selectedUser['userUUID'];
    } else {
      userUUID = this._selectedUser['P5Corp_userUID'];
    }

    this._currentTask = task;

    if (viewMode) {
      this._personalPortfolioService.getPortfolioData(userUUID)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this._loaderService.exitLoader();
          this._printtoolService.initPrintPersonalPortfolioReportView(this._personalPortfolioService._userData, false);
        });
    } else {
      this._personalPortfolioService.printPersonalPortfolio(userUUID)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this._loaderService.exitLoader();
        });
    }
  }

  loadMore(category) {
    category['bLoadMore'] = !category['bLoadMore'];
    category['iTotal'] = category['bLoadMore'] === true ? category['task'].length : 2;
  }

  // Employee View

  getTrainingNeedsDataEmployee() {
    this._loaderService.initLoader(true);
    this._isLoadingTraining = true;
    this._trainingService.getUserTrainingProfile(this._sessionUser.P5Corp_userUID)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.updateProfile();
      });
  }

  updateProfile() {
    this._bNoData = false;
    this._isLoadingTraining = false;
    this._trainingNeedsData = this._trainingService._userTrainingProfile;

    if (this._trainingNeedsData['Outstanding'].length !== 0) {
      this._trainingNeeds = this._trainingNeedsData['Outstanding'];
      this._bView = false;
    } else if (this._trainingNeedsData['Current'].length !== 0) {
      this._trainingNeeds = this._trainingNeedsData['Current'];
      this._bView = true;
    } else {
      this._bView = true;
      this._bNoData = true;
    }

    this.checkLoaderAllClear();
  }

  validateProfileEmployee() {
    this._loaderService.initLoader(true);
    let sMessage: string = '';
    this._trainingNeeds.forEach(training => {
      if (training.iPriority === 0) {
        sMessage += '- Please select the priority for ' + training.sModule + '<br>'
      }
    });

    if (sMessage) {
      this._loaderService.exitLoader();
      Swal.fire({
        title: '',
        html: sMessage,
        icon: 'warning',
        confirmButtonColor: 'var(--primary)',
        heightAuto: false
      });
    } else {
      this.submitTrainingNeedsEmployee();
    }
  }

  submitTrainingNeedsEmployee() {
    this._trainingService.submitTrainingNeeds(this._trainingNeeds, 'Employee', this._sessionUser.P5Corp_userUID)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._sessionUser['companytemplate']['linkedTiles'].forEach(tile => {
          if (tile.sName === 'Train' || tile['sName'] === 'Aspire') {
            tile['iNumNotifications'] = 0;
          }
        });
        this.getTrainingNeedsDataEmployee();
      });
  }

  // Manager View
  getUserDataManager() {
    this._loaderService.initLoader();
    this._isLoadingTraining = true;
    this._trainingService.getUserTrainingProfileManager(this._selectedUser['userUUID'])
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._trainingNeeds = this._trainingService._userTrainingProfileManager;
        if (this._trainingNeeds.length === 0) {
          this._bNoData = true;
        }
        this._isLoadingTraining = false;
        this.checkLoaderAllClear();
      });
  }

  validateProfileManager() {
    this._loaderService.initLoader(true);
    let sMessage: string = '';
    this._trainingNeeds.forEach(training => {
      if (training.sStatus === 'Pending') {
        sMessage += '- Please Select A Status for Module ' + training.sModule + ' <br>';
      }
    });

    this._trainingNeeds.forEach(training => {
      if (training.sStatus === 'Rejected' && /^ *$/.test(training.sDeclinedMessage)) {
        sMessage += '- Please Enter A Reason For Rejecting The Module ' + training.sModule + ' <br>';
      }
    });
    if (sMessage) {
      Swal.fire({
        title: '',
        html: sMessage,
        icon: 'warning',
        confirmButtonColor: 'var(--primary)',
        heightAuto: false
      });
      this._loaderService.exitLoader();
    } else {
      this._loaderService.initLoader();
      this.submitTrainingNeedsManager();
    }
  }

  submitTrainingNeedsManager() {
    this._loaderService.initLoader();
    this._trainingService.submitTrainingNeeds(this._trainingNeeds, 'Manager', this._selectedUser['userUUID'])
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.getUserDataManager();
      });
  }

  goTrainersTool() {
    localStorage.setItem('isExternalTrainer', JSON.stringify(false));
    this._router.navigate(['aspire/trainers-tool'], { replaceUrl: true });
  }

}
