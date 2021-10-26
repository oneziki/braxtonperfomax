import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationStart, Router, RoutesRecognized } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuController, Platform } from '@ionic/angular';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { CompanyTemplate, KraCompanySettings, SessionUser } from './_models/index';
import {
  AuthService,
  ConversationService,
  EmployeeDirectoryService,
  NotificationService,
  KraService,
  LoaderService,
  PrintToolService,
  ResourcesService
} from './_services';

import { filter, pairwise } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss',
    '../theme/fontawesome-free/css/fontawesome.css'],
})
export class AppComponent implements OnInit, OnDestroy {

  networkInfo = navigator;
  currentRoute: string;

  _notificationsList = [];
  activityList = [];
  _conversationFeedCat = [];
  _individualTasks = {};
  _teamTasks = {};
  _totalOverdueTasks = 0;
  _totalDraftTasks = 0;
  _totalPendingTasks = 0;
  _totalCompletedTasks = 0;

  _envTheme: object;
  _sessionUser: SessionUser;
  _companyTemplate: CompanyTemplate;
  _kraCompanySettings: KraCompanySettings;

  _expandPanel = true;
  _selectedAppTab = 'home';
  public selectedIndex = -1;

  public appIconPages = [];

  _myManagers = [];
  _directReports = [];
  _myTeam = [];
  _imgDisplayTeamNum = 6;

  private loginSub: Subscription;
  private tabSub: Subscription;
  private notificationSub: Subscription;
  private togglePanelSub: Subscription;
  private myTeamSub: Subscription;
  private subscriptionUpdateMenu: Subscription;
  private ngUnsubscribe: Subject<any> = new Subject<any>();
  private readonly onDestroy = new Subject<void>();

  constructor(
    private menu: MenuController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public _kraService: KraService,
    private router: Router,
    public authService: AuthService,
    public _loaderService: LoaderService,
    private _resourcesService: ResourcesService,
    public _conversationService: ConversationService,
    public _notificationService: NotificationService,
    private _employeeDirectoryService: EmployeeDirectoryService,
    private _printtoolService: PrintToolService
  ) {
    this.loginSub = this.authService._loginChanged.subscribe((value) =>
      this.loginChanged()
    );
    this.subscriptionUpdateMenu = this._notificationService._subscriptionUpdateMenu.subscribe((value) =>
      this.updateMenu()
    );
    this.tabSub = this.authService._appTabChanged.subscribe(() =>
      this.tabChanged()
    );
    this.notificationSub = this._resourcesService._dataChanged_notifications.subscribe(() =>
      this.setNotifications()
    );
    this.togglePanelSub = this.authService._panelChanged.subscribe(() =>
      this.togglePanel()
    );
    this.myTeamSub = this._employeeDirectoryService._employeeDirectReportDataChanged.subscribe(() =>
    this.setMyTeam()
  );

    window.addEventListener('offline', () => {
      console.log('offline');
    });
    window.addEventListener('online', () => {
      console.log('online');
    });

    //Router subscriber
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {

        let urlSplit = event['url'].split("/");

        if (urlSplit[1] !== 'auth') {
          this.loginCheck();
        }

        const tabArray = ['auth', 'home', 'personal', 'team', 'perform', 'grow', 'live', 'choose', 'aspire', 'coach', 'mymax-reporting'];
        if (tabArray.indexOf(urlSplit[1]) !== -1) {
          if (this._selectedAppTab !== urlSplit[1]) {
            this.authService.emitAppMenu(urlSplit[1]);
          }
        }
      }
      this.menu.close('MainMenu');
    });

    this.router.events
      .pipe(filter((e: any) => e instanceof RoutesRecognized),
        pairwise()
      ).subscribe((e: any) => {
        this.authService._sPreviousUrl = e[0].urlAfterRedirects; // previous url
      });

    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    //
    //  Environment Theme
    //
    this._envTheme = this.authService['_envTheme'];
    if (!this.authService['_envTheme'] || !this.authService['_envTheme']['skin']) {
      this.authService.getEnvironmentTheme()
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
        });
    }

    this.appIconPages = this._notificationService.appIconPages;
    //
    //  User Logged in
    //
    this.loginCheck();

  }

  setMyTeam() {
    this._myTeam = this._employeeDirectoryService._directReports;
  }

  loginCheck() {
    this.authService.setUser();
    this._sessionUser = this.authService['_sessionUser'];

    if (!this._sessionUser || this._sessionUser == undefined) {
      this.router.navigate(['/auth/login'], { replaceUrl: true });
    } else {

      this._companyTemplate = this._sessionUser['companytemplate'];
      // this._notifcationService.setModuleMenu();
      this._kraCompanySettings = this._kraService._kraCompanySettings;
      this._conversationFeedCat = this._conversationService._conversationFeedCat;

      this._selectedAppTab = window.location.pathname.split("/")[1];
      this.authService._selectedAppTab = this._selectedAppTab;
      // this.appIconPages = this._notifcationService.appIconPages;
      this._notificationService.setModuleMenu();
      this.tabChanged();

      if (!this._kraCompanySettings) {
        this._kraService.getKraCompanySettings()
          .pipe(takeUntil(this.onDestroy))
          .subscribe(v => {
            this.emitCompanySettings();
          });
      } else {
        this.emitCompanySettings();
      }

    }

    // console.log('_sessionUser:: ', this._sessionUser);
    // console.log('_companyTemplate:: ', this._companyTemplate);
  }

  ngOnDestroy() {
    this.loginSub.unsubscribe();
    this.tabSub.unsubscribe();
    this.notificationSub.unsubscribe();
    this.subscriptionUpdateMenu.unsubscribe();
    this.myTeamSub.unsubscribe();
    this.ngUnsubscribe.next();
  }

  loginChanged() {
    this._sessionUser = this.authService['_sessionUser'];

    if (this._sessionUser) {
      if (this._sessionUser['profilePhoto'] === '') {
        this._sessionUser['empSrcFail'] = true;
      } else {
        this._sessionUser['empSrcFail'] = false;
      }
    }
  }

  logOut() {
    this._sessionUser = null;
    this.authService._selectedAppTab = 'login';
    this.router.navigate(['/auth/login'], { replaceUrl: true });
  }

  togglePanel() {
    this._expandPanel = !this.authService._expandPanel;
  }

  tabTo(tab) {
    this._employeeDirectoryService._performUser = this.authService['_sessionUser'];
    this.closePDFView();
    if (tab === '/talent' || tab === '#') {
      Swal.fire({
        title: '',
        text: 'No Data',
        icon: 'warning',
        confirmButtonColor: 'var(--primary)',
        heightAuto: false
      });
    } else {
      this.authService.toggleAppMenu(tab);
    }
  }

  closePDFView() {
    this._printtoolService._triggerClosingView.emit();
  }

  tabChanged() {
    this._selectedAppTab = this.authService._selectedAppTab.replace("/", "");
    if (this._selectedAppTab === 'home') {
      if (Object.keys(this._individualTasks).length === 0 || Object.keys(this._teamTasks).length === 0) {
        this.getAllTasks();
      }

      if (this._conversationFeedCat.length === 0) {
        this._conversationService.getLatestConversationForCat(this._sessionUser['P6_userUID'], 'all')
          .pipe(takeUntil(this.onDestroy))
          .subscribe(v => {
            this.emitSetConversation();
          });
      }
    } else if (this._selectedAppTab === 'personal') {

      this._myManagers = this._employeeDirectoryService._employeeAdminReportTo;

      if (this._myManagers.length === 0) {
        const managers = this._employeeDirectoryService.getEmployeesAdminReportTo(this._sessionUser.P6_userUID).then(response => {
          this._myManagers = response;
        });
      }
    } else if (this._selectedAppTab === 'team') {

      this._myManagers = this._employeeDirectoryService._employeeAdminReportTo;
      this._directReports = this._employeeDirectoryService._directReports;

      // Report To's
      if (this._myManagers.length === 0) {
        const managers = this._employeeDirectoryService.getEmployeesAdminReportTo(this._sessionUser.P6_userUID).then(response => {
          this._myManagers = response;
        });
      }

      // Direct Reports
      if (this._myManagers.length === 0) {
        const directReports = this._employeeDirectoryService.getDirectReportsForEmployee(this._sessionUser.P6_userUID).then(response => {
          this._directReports = response;
        });
      }
    }
  }

  setNotifications() {
    this._notificationsList = this._resourcesService._notifications;
  }

  emitCompanySettings() {
    this._kraCompanySettings = this._kraService._kraCompanySettings;
  }

  emitSetConversation() {
    this._conversationFeedCat = this._conversationService._conversationFeedCat;
  }

  async getAllTasks() {
    this._totalOverdueTasks = 0;
    this._totalDraftTasks = 0;
    this._totalPendingTasks = 0;
    this._totalCompletedTasks = 0;

    if (this._sessionUser && this._companyTemplate) {
      this._individualTasks = await this.authService.getIndividualTasks(
        this._sessionUser['P6_userUID'], this._companyTemplate['portalSetupTemplateUID'], false);
      this.setIndividualTasks();
      this._teamTasks = await this.authService.getTeamTasks(
        this._sessionUser['P6_userUID'], this._companyTemplate['portalSetupTemplateUID'])
      this.setTeamTasks();
      this.allTasksLoaded(this.authService._individualTasks, this.authService._teamTasks);
    }
  }

  setIndividualTasks() {
    this._individualTasks = JSON.parse(JSON.stringify(this.authService._individualTasks));

    for (const status of Object.keys(this._individualTasks)) {
      if (status !== 'totalTasks') {
        this._individualTasks[status] = this._individualTasks[status].filter(item => item.sSubModule !== 'SWOTAnalysis');
        this._individualTasks[status] = this._individualTasks[status].filter(item => item.sSubModuleItem !== 'Integrated PDP');
        this._individualTasks[status] = this._individualTasks[status].filter(item => item.sSubModuleItem !== 'Contract PDP');
        this._individualTasks[status] = this._individualTasks[status].filter(item => item.sSubModuleItem !== 'Train');

        if (status === '1_arrears') {
          this._totalOverdueTasks = this._totalOverdueTasks + this._individualTasks[status].length;
        }
        if (status === '2_draft') {
          this._totalDraftTasks = this._totalDraftTasks + this._individualTasks[status].length;
        }
        if (status === '3_current') {
          this._individualTasks[status] = this._individualTasks[status].filter(item => item.sSubModule !== 'surveyAssessment');
          this._totalPendingTasks = this._totalPendingTasks + this._individualTasks[status].length;
        }
        if (status === '7_completed') {
          this._totalCompletedTasks = this._totalCompletedTasks + this._individualTasks[status].length;
        }
      }
    }
  }

  setTeamTasks() {

    this._teamTasks = this.authService._teamTasks;
    if (this._teamTasks) {
      for (const status of Object.keys(this._teamTasks)) {
        if (status !== 'totalTasks') {
          if (status === '1_arrears') {
            this._totalOverdueTasks = this._totalOverdueTasks + this._teamTasks[status].length;
          }
          if (status === '2_draft') {
            this._totalDraftTasks = this._totalDraftTasks + this._teamTasks[status].length;
          }
          if (status === '3_current') {
            this._teamTasks[status] = this._teamTasks[status].filter(item => item.sSubModuleItem !== 'Manual PDP');
            this._totalPendingTasks = this._totalPendingTasks + this._teamTasks[status].length;
          }
          if (status === '7_completed') {
            this._totalCompletedTasks = this._totalCompletedTasks + this._teamTasks[status].length;
          }
        }
      }
    }
  }

  allTasksLoaded(individualTasks, teamTasks) {
    this._notificationService.calulcateAllTasksNotifications(individualTasks, teamTasks);
  }


  goCookie() {
    this.router.navigate(['/maintenance/cookie-policy'], { replaceUrl: true });
  }

  updateMenu() {
    this.appIconPages = this._notificationService.appIconPages;
  }
}
