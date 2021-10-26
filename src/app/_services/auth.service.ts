/* eslint-disable space-before-function-paren */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-underscore-dangle */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AppSettings, SessionUser, Task } from '../_models/index';
import { MessengerService } from './messengerservice.service';
import { PostService } from './post.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class AuthService implements OnDestroy {
  // DEV VARS
  _debugger = false;
  env = environment;

  _linkUserUID = '';
  _linkSurveyUID = '';
  _KRAView = 'personal';

  _sPreviousUrl = '';

  _sessionUser: SessionUser;
  _sessionHistory: {};
  // _sessionHistory: {
  //   'lf20_aeo5ikeu': 3
  // };
  _envTheme = {};
  _fetchingTheme = false;
  bEnableAzureLogin = false;
  networkInfo = navigator;

  _taskFilter = {
    sYear: '',
    sMonth: 0
  };

  _categories = {
    threesixtyCatUIDs: '',
    esurveyCatUIDs: ''
  };

  _individualTasks: Task;
  _individualTasksFetch = false;
  _teamTasks: Task;
  _teamTasksFetch = false;
  _iNumNotificationCoach = 0;

  _token: string = null;
  _isActivitySummaryPage = false;

  _tokenChanged = new EventEmitter();
  _passwordChanged = new EventEmitter();
  _teamTasksChanged = new EventEmitter();
  _userSessionChanged = new EventEmitter();
  _loginChanged = new EventEmitter();
  _envThemeChanged = new EventEmitter();
  _kraViewChange = new EventEmitter();

  _appTabChanged = new EventEmitter();
  _panelChanged = new EventEmitter();

  _curPageChanged = new EventEmitter();
  _sessionHistoryChanged = new EventEmitter();

  // these variables are in use  when you access the site through an email link
  _logo = '';
  _background = '';
  _userUUID = '';
  _user = { userUID: '', sFullName: '' };

  // Dynamic Wizard
  _wizData = {};
  _curPage = 0;
  _selectedAppTab = 'home';
  _previousAppTab = '';
  _expandPanel = true;
  _bIsAzureLogin = false;
  _myMaxReportingStructure = {};

  private ngUnsubscribe: Subject<any> = new Subject<any>();
  private readonly onDestroy = new Subject<void>();


  constructor (private _mService: MessengerService,
    private _http: HttpClient,
    private _pService: PostService,
    private socket: Socket,
    private _router: Router,
    private msalService: MsalService) { }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  setUser() {

    if (localStorage.getItem('sessionUser')) {
      this._sessionUser = JSON.parse(localStorage.getItem('sessionUser'));

      if (!localStorage.getItem('cookieFooter')) {
        this._sessionUser['showCookieFooter'] = true;
      } else {
        this._sessionUser['showCookieFooter'] = false;
      }

      if (localStorage.getItem('myMaxIndivReportingStructure')) {
        const mymaxResult = JSON.parse(localStorage.getItem('myMaxIndivReportingStructure'));
        this._myMaxReportingStructure = mymaxResult[0];
      }
    }

    if (this._debugger && location.hostname === 'localhost') {
      console.log('setUser:: ', this._sessionUser);
    }

    if (this._sessionUser) {
      this._userUUID = this._sessionUser.P5Corp_userUID;
    }

  }

  getUser() {
    this.setUser();

    let result = {};

    if (this._sessionUser) {
      this._userSessionChanged.emit(this._sessionUser);
      // console.log('getUser:_sessionUser:: ', this._sessionUser);
      result = {
        type: '_sessionUser',
        data: this._sessionUser
      };
    }
    if (!this._sessionUser) {
      this._router.navigate(['/']);
      result = { data: null };
    }

    return result;
  }

  getNotificationStatusData() {

    const companytemplate = this._sessionUser.companytemplate;
    const sComingUpName = companytemplate.sComingUpName;
    const sCompletedName = companytemplate.sCompletedName;
    const sDraftStatusName = companytemplate.sDraftStatusName;
    const sFeedbackStatusName = companytemplate.sFeedbackStatusName;
    const sOptionalStatusName = companytemplate.sOptionalStatusName;
    const sOverdueStatusName = companytemplate.sOverdueStatusName;
    const sApproveStatusName = companytemplate.sApproveStatusName;
    const sToCompleteName = companytemplate.sToCompleteName;

    const notifications: object = {};

    notifications[sComingUpName] = 'bComingUp';
    notifications[sCompletedName] = 'bView';
    notifications[sDraftStatusName] = 'bContinue';
    notifications[sFeedbackStatusName] = '';
    notifications[sOptionalStatusName] = '';
    notifications[sOverdueStatusName] = 'bComplete';
    notifications[sToCompleteName] = 'bComplete';
    notifications[sApproveStatusName] = 'bAcceptInvites';

    return notifications;
  }


  ////////////////////////////////////////////////////////////////////////
  // FUNCTIONS:  LOGIN
  ////////////////////////////////////////////////////////////////////////

  async login(username: string, password: string, remember: boolean, sAzureEmail: string): Promise<any> {
    const bodyString = JSON.stringify({
      sLoginName: username,
      sLoginPassword: password,
      sAzureEmail,
      bEnableAzureLogin: this._envTheme['bEnableAzureLogin'],
      peformaxToken: AppSettings.PEFORMAX_TOKEN,
      isSuper: false,
      sModule: 'login',
      sFunction: 'authenticateUser',
      bIsP7: true
    });
    // reset the session user
    this._sessionUser = null;
    const data = await this._pService.postData('login', bodyString, 'get');
    const userInfo = data;
    const result = userInfo['stData'];
    const mymaxResult = userInfo['myMaxIndivReportingStructure'];


    if (result.token && result.token !== '') {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      if (remember) {
        localStorage.setItem('rememberUser', JSON.stringify(result));
      }
      sessionStorage.setItem('loginUser', JSON.stringify(result));
      localStorage.setItem('sessionUser', JSON.stringify(result));
      localStorage.setItem('myMaxIndivReportingStructure', JSON.stringify(mymaxResult));

      this._sessionUser = result;
      this._sessionUser = result;
      this._myMaxReportingStructure = mymaxResult[0];
      this._token = result.token;
      this._userUUID = this._sessionUser.P5Corp_userUID;

      this.setUser();
      // this.localNonSyncDatabase.put('sLoginName', {'sValue': this._sessionUser.sLoginName});

      // Update offline database if applicable
      if (AppSettings.OFFLINE_STATUS) {
        // this.addPouchDBUser(this._sessionUser.sLoginName, this._sessionUser);
      }
      this._loginChanged.emit(result);
      return result;
    }

    this._loginChanged.emit(result);
  }

  logout() {
    if (this._sessionUser) {
      this._user['userUID'] = this._sessionUser['P6_userUID'];
      this._user['sFullName'] = this._sessionUser['sFullName'];
      this.socket.emit('logout', this._user);
    }

    this._sessionUser = null;
    this._selectedAppTab = 'auth/login';
    this._loginChanged.emit();

    // if (this._envTheme['bEnableAzureLogin'] && this._bIsAzureLogin) {
    //   this.msalService.logout();
    // } else {
    this._router.navigate(['/auth/login'], { replaceUrl: true });
    // }

  }

  toggleAppMenu(tab) {
    this._selectedAppTab = tab.replace("/", "");
    this._appTabChanged.emit(tab);
    this._router.navigate(['/' + tab], { replaceUrl: true });
  }

  hideAppPanel(openStatus: boolean) {
    this._expandPanel = openStatus;
    this._panelChanged.emit();
  }

  emitAppMenu(tab) {
    this._selectedAppTab = tab.replace("/", "");
    this._appTabChanged.emit(tab);
  }

  ////////////////////////////////////////////////////////////////////////
  // FUNCTIONS: TASKS
  ////////////////////////////////////////////////////////////////////////

  async getIndividualTasks(P6_userUID: string, portalSetupTemplateUID: string, bReportingPDF: boolean): Promise<any> {
    const bodyString = JSON.stringify({
      peformaxToken: AppSettings.PEFORMAX_TOKEN,
      P6_userUID,
      portalSetupTemplateUID,
      sModule: 'task',
      bReportingPDF,
      sYear: this._taskFilter.sYear,
      sMonth: this._taskFilter.sMonth,
      categories: this._categories,
      companytemplate: this._sessionUser.companytemplate,
      sFunction: 'getIndividualTasks'
    });

    this._individualTasksFetch = true;
    this._individualTasks = await this._pService.postData('getIndividualTasks', bodyString, 'get');

    let tTotal = 0;
    Object.keys(this._individualTasks).forEach(item => {
      if (item !== '7_completed') {
        tTotal = tTotal + this._individualTasks[item].length;
      }
    });
    this._individualTasks['totalTasks'] = tTotal;
    this._individualTasksFetch = false;
    return this._individualTasks;
  }

  async getTeamTasks(P6_userUID: string, portalSetupTemplateUID: string): Promise<any> {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'P6_userUID': P6_userUID,
      'portalSetupTemplateUID': portalSetupTemplateUID,
      'sModule': 'task',
      'categories': this._categories,
      'companytemplate': this._sessionUser.companytemplate,
      'sFunction': 'getTeamTasks'
    });

    this._teamTasksFetch = true;
    this._teamTasks = await this._pService.postData('getTeamTasks', bodyString, 'get');

    let tTotal = 0;
    Object.keys(this._teamTasks).forEach(item => {
      if (item !== '7_completed') {
        tTotal = tTotal + this._teamTasks[item].length;
      }
    });
    this._teamTasks['totalTasks'] = tTotal;
    this._teamTasksFetch = false;
    // this._teamTasksChanged.emit();
    return this._teamTasks;
  }

  getCoachNotification() {

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'P6_userUID': this._sessionUser.P6_userUID,
      'sModule': 'task',
      'sFunction': 'getCoachNotification'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._iNumNotificationCoach = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getCoachNotification', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getCoachNotification'))
    );
  }

  ////////////////////////////////////////////////////////////////////////
  // LOCAL FUNCTIONS
  ////////////////////////////////////////////////////////////////////////

  getEnvironmentTheme() {
    this._fetchingTheme = true;
    const bodyString = JSON.stringify({
      peformaxToken: AppSettings.PEFORMAX_TOKEN,
      envName: this.env['envName'],
      sModule: 'login',
      sFunction: 'getEnvironmentTheme'
    });
    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {

        if (result !== null) {
          this._envTheme = JSON.parse(JSON.stringify(result));
        }

        if (!this._envTheme['skin'] || !this._envTheme['skin'].length) {
          this._envTheme['skin'] = 'Astros';
          this._envTheme['siteTheme'] = 'Default';
        }

        this.bEnableAzureLogin = this._envTheme['bEnableAzureLogin'] === 1 ? true : false;

        // ION Defaults
        document.documentElement.style.setProperty('--ion-default-font', 'Calibri, sans-serif');
        document.documentElement.style.setProperty('--ion-item-background', 'transparent');
        document.documentElement.style.setProperty('--ion-card-background', 'white');
        document.documentElement.style.setProperty('--min-height', '10px');

        // SITE Defaults
        document.documentElement.style.setProperty('--charcoal', '#2e323d');
        document.documentElement.style.setProperty('--lite-charcoal', '#5b6365');
        document.documentElement.style.setProperty('--lite-grey', '#adaeaf');
        document.documentElement.style.setProperty('--bg-grey', '#e7e6e6');
        document.documentElement.style.setProperty('--bg-white', '#f2f2f2');
        // THEME Defaults
        document.documentElement.style.setProperty('--primary-alt', '#f2f2f2');


        document.body.classList.add(this._envTheme['skin'].toLowerCase());
        document.body.classList.add('siteTheme-' + this._envTheme['siteTheme'].toLowerCase());

        if (this._envTheme['background'] && this._envTheme['background'].length) {
          document.documentElement.style.setProperty('--bg-url', 'url(' + this._envTheme['background'] + ') no-repeat center center');
        }

        if (this._envTheme['logo'] && this._envTheme['logo'].length) {
          document.documentElement.style.setProperty('--logo-url', 'url(' + this._envTheme['logo'] + ') no-repeat center center');
        }

        if (this._envTheme['theme']) {
          if (this._envTheme['theme']['sPrimaryColor'] && this._envTheme['theme']['sPrimaryColor'].length) {
            document.documentElement.style.setProperty('--ion-color-primary', this._envTheme['theme']['sPrimaryColor']);
            document.documentElement.style.setProperty('--primary', this._envTheme['theme']['sPrimaryColor']);
          }
          if (this._envTheme['theme']['sPrimaryDarkColor'] && this._envTheme['theme']['sPrimaryDarkColor'].length) {
            document.documentElement.style.setProperty('--primary-dark', this._envTheme['theme']['sPrimaryDarkColor']);
          }
          if (this._envTheme['theme']['sPrimaryLightColor'] && this._envTheme['theme']['sPrimaryLightColor'].length) {
            document.documentElement.style.setProperty('--primary-light', this._envTheme['theme']['sPrimaryLightColor']);
          }
          if (this._envTheme['theme']['sPrimaryAltColor'] && this._envTheme['theme']['sPrimaryAltColor'].length) {
            document.documentElement.style.setProperty('--primary-alt', this._envTheme['theme']['sPrimaryAltColor']);
          }
          if (this._envTheme['theme']['sAccentColor'] && this._envTheme['theme']['sAccentColor'].length) {
            document.documentElement.style.setProperty('--accent', this._envTheme['theme']['sAccentColor']);
          }
          if (this._envTheme['theme']['sDividerColor'] && this._envTheme['theme']['sDividerColor'].length) {
            document.documentElement.style.setProperty('--divider', this._envTheme['theme']['sDividerColor']);
          }
          if (this._envTheme['theme']['sIconColor'] && this._envTheme['theme']['sIconColor'].length) {
            document.documentElement.style.setProperty('--icons', this._envTheme['theme']['sIconColor']);
          }
          if (this._envTheme['theme']['sSuccessColor'] && this._envTheme['theme']['sSuccessColor'].length) {
            document.documentElement.style.setProperty('--success', this._envTheme['theme']['sSuccessColor']);
          }
          if (this._envTheme['theme']['sDangerColor'] && this._envTheme['theme']['sDangerColor'].length) {
            document.documentElement.style.setProperty('--danger', this._envTheme['theme']['sDangerColor']);
          }
        }

        this._fetchingTheme = false;
        this._envThemeChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getEnvironmentTheme', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getEnvironmentTheme'))
    );
  }

  handleNoSkin() {
    this._envTheme['skin'] = 'Astros';
    this._envTheme['siteTheme'] = 'Default';
    document.body.classList.add(this._envTheme['skin'].toLowerCase());
    document.body.classList.add('siteTheme-' + this._envTheme['siteTheme'].toLowerCase());
    this._envThemeChanged.emit();
  }


  ////////////////////////////////////////////////////////////////////////
  // FUNCTIONS:  POUCH
  ////////////////////////////////////////////////////////////////////////

  addPouchDBUser(sLoginName, userInfo) {

    const timeStamp = String(new Date().getTime());

    // Check to see if user is available
    // this.localSyncDatabase.get(sLoginName).then(getResult => {
    //   // User exists within sync database -do nothing
    // }, error => {
    //   userInfo.dPouchDateCreated = timeStamp;
    //   // Add new user to database and sync immediately to fetch latest data
    //   this.localSyncDatabase.put(sLoginName, userInfo).then(putResult => {
    //     // after adding, sync database for user
    //     this.localSyncDatabase.sync(AppSettings.OFFLINE_SERVER, sLoginName);
    //     // get newly created user to manage local/session storage
    //     this.localSyncDatabase.get(sLoginName).then(pouchUser => {
    //         this.setPouchDBUser(sLoginName, pouchUser);
    //       });
    //     });
    // });
  }

  setPouchDBUser(sLoginName, userInfo) {

    const timeStamp = String(new Date().getTime());

    // set user details
    this._sessionUser = userInfo;
    sessionStorage.setItem('loginUser', JSON.stringify(userInfo));
    localStorage.setItem('sessionUser', JSON.stringify(userInfo));

    // Check to see if login name is available
    // this.localNonSyncDatabase.get('sLoginName').then(getResult => {
    //   // Login name id is within database - check to value
    //   if (getResult.sValue !== sLoginName) {
    //     this.localNonSyncDatabase.put('sLoginName', {'sValue': sLoginName, 'dPouchDateUpdated': timeStamp});
    //   }
    //   // console.log('non sync getResult', getResult);
    // }, error => {
    //   // Add new login name to database
    //   this.localNonSyncDatabase.put('sLoginName', {'sValue': sLoginName, 'dPouchDateCreated': timeStamp}).then(putResult => {
    //     // console.log('non sync putResult', putResult);
    //     });
    // });

    // this._loginChanged.emit({ 'status': 'Success' });
  }

  getDummyWizard() {
    return {
      wID: 'lf20_aeo5ikeu',
      wTitle: 'Dyno Wiz',
      wNotes: 'Identify the Business Objectives that you as an individual can contribute to in your current role',
      wLottie: 'https://assets8.lottiefiles.com/packages/lf20_aeo5ikeu.json',
      intro: [
        {
          iTitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          iIcon: 'checkmark-done-sharp'
        }
      ]
    }
  }


  setWizData(data) {
    this._wizData = data;
    console.log('setWizData:: ', this._wizData);
    return this._wizData
  }
  getWizData() {
    return this._wizData
  }
  getWizardPage() {
    return this._curPage;
  }
  setWizardPage(newPage) {
    this._curPage = newPage;
    this.autoSetSessionHistory(this._curPage);
    console.log('setWizardPage()', newPage);
    this._curPageChanged.emit();

    return this._curPage;
  }

  getSessionHistory() {
    if (!this._sessionHistory) {
      this._sessionHistory = {};
    }
    return this._sessionHistory;
  }
  autoSetSessionHistory(newPage) {
    this.setSessionHistory(this._wizData, newPage);
  }
  setSessionHistory(wizardID, newPage) {
    this._curPage = newPage;
    if (!this._sessionHistory) {
      this._sessionHistory = {};
      this._sessionHistory[wizardID] = {};
    }
    if (this._sessionHistory[wizardID]) {
      // console.log('~ _sessionHistory:: ', this._sessionHistory);
    } else {
      this._sessionHistory[wizardID] = {};
      // console.log('~~ _sessionHistory:: ', this._sessionHistory);
    }

    this._sessionHistory[wizardID] = newPage;

    this._sessionHistoryChanged.emit();
    return this._sessionHistory;
  }


}
