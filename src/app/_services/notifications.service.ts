import { AuthService } from '../_services/auth.service';
// import { MessengerService } from './messengerservice.service';
import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { CompanyTemplate, SessionUser, MenuItems } from '../_models/index';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MyMax7Service } from './mymax7.service';




@Injectable()
export class NotificationService implements OnDestroy {

  _companyTemplate: CompanyTemplate;
  _sessionUser: SessionUser;
  private readonly onDestroy = new Subject<void>();
  private ngUnsubscribe: Subject<any> = new Subject<any>();
  // private subscriptionUpdateMenu: Subscription;
  _subscriptionUpdateMenu = new EventEmitter();
  // _notficationsEmployees = {};

  public appIconPages = [
    {
      title: 'Perform',
      url: '/perform',
      icon: 'contract',
      image: '',
      bDisabled: true,
      iNumNotificationPersonal: 0,
      iNumNotificationTeam: 0,
      notificationEmployees: []
    },
    {
      title: 'Grow',
      url: '/grow',
      icon: 'leaf',
      image: '',
      bDisabled: true,
      iNumNotificationPersonal: 0,
      iNumNotificationTeam: 0,
      notificationEmployees: []
    },
    {
      title: 'Live',
      url: '/live',
      icon: 'accessibility',
      image: '',
      bDisabled: true,
      iNumNotificationPersonal: 0,
      iNumNotificationTeam: 0,
      notificationEmployees: []
    },
    {
      title: 'Choose',
      url: '/choose',
      icon: 'shuffle',
      image: '',
      bDisabled: true,
      iNumNotificationPersonal: 0,
      iNumNotificationTeam: 0,
      notificationEmployees: []
    },
    {
      title: 'Aspire',
      url: '/aspire',
      icon: 'telescope',
      image: '',
      bDisabled: true,
      iNumNotificationPersonal: 0,
      iNumNotificationTeam: 0,
      notificationEmployees: []
    },
    {
      title: 'Coach',
      url: '/coach',
      icon: 'medal',
      image: '',
      bDisabled: true,
      iNumNotificationPersonal: 0,
      iNumNotificationTeam: 0,
      notificationEmployees: []
    },
    {
      title: 'Talent',
      url: '#',
      icon: 'people-circle-outline',
      image: '',
      bDisabled: true,
      iNumNotificationPersonal: 0,
      iNumNotificationTeam: 0,
      notificationEmployees: []
    },
    {
      title: 'HR Admin',
      url: '#',
      icon: 'people-circle-outline',
      image: '',
      bDisabled: true,
      iNumNotificationPersonal: 0,
      iNumNotificationTeam: 0,
      notificationEmployees: []
    },
    {
      title: 'Leave',
      url: '#',
      icon: 'airplane',
      image: '',
      bDisabled: true,
      iNumNotificationPersonal: 0,
      iNumNotificationTeam: 0,
      notificationEmployees: []
    },
    {
      title: 'Reports',
      url: '/mymax-reporting',
      image: '',
      icon: 'bar-chart',
      bDisabled: true,
      iNumNotificationPersonal: 0,
      iNumNotificationTeam: 0,
      notificationEmployees: []
    }
  ];

  constructor (public _authService: AuthService,
    private _myMax7Service: MyMax7Service) {
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    // this.subscriptionUpdateMenu.unsubscribe();
    // this.subscriptionC.unsubscribe();
    this.onDestroy.next();
  }



  calulcateAllTasksNotifications(individualTasks, teamTasks) {
    this.appIconPages.forEach(tile => {
      tile['notificationEmployees'] = [];
    });
    this.calculateNotifications(individualTasks, 'iNumNotificationPersonal');
    this.calculateNotifications(teamTasks, 'iNumNotificationTeam');
  }

  calulcateIndividualTasks(individualTasks) {
    this.calculateNotifications(individualTasks, 'iNumNotificationPersonal');
  }

  calculateTeamTasks(teamTasks) {
    this.calculateNotifications(teamTasks, 'iNumNotificationTeam');
  }

  calculateNotifications(tasks, notificationtype) {
    let kraCounter = 0;
    let compCounter = 0;
    let chooseCounter = 0;
    let coachCounter = 0;
    let trainCounter = 0;
    let liveCounter = 0;
    let reportsCounter = 0;

    if (tasks) {
      this.appIconPages.forEach(tile => {
        // Calculation are being done for each tile. Looping through each task and adding the numbers up
        //-------- PERFORM -------- //
        if (tile['title'] === 'Perform') {
          if (!tile['notificationEmployees']) {
            tile['notificationEmployees'] = [];
          }
          // Arrears
          for (let i = 0; i < tasks['1_arrears'].length; i++) {
            if (tasks['1_arrears'][i]['sSubModule'] === 'kra') {
              const user = { userUID: tasks['1_arrears'][i]['EmployeeUID'], iNumNotification: 1 };
              const index = tile['notificationEmployees'].findIndex(x => x['userUID'] == user['userUID']);
              index === -1 ? tile['notificationEmployees'].push(user) : tile['notificationEmployees'][index]['iNumNotification'] += 1
              kraCounter = kraCounter + 1;
            }
          }
          // Draft
          for (let i = 0; i < tasks['2_draft'].length; i++) {
            if (tasks['2_draft'][i]['sSubModule'] === 'kra') {
              const user = { userUID: tasks['2_draft'][i]['EmployeeUID'], iNumNotification: 1 };
              const index = tile['notificationEmployees'].findIndex(x => x['userUID'] == user['userUID']);
              index === -1 ? tile['notificationEmployees'].push(user) : tile['notificationEmployees'][index]['iNumNotification'] += 1
              kraCounter = kraCounter + 1;
            }
          }
          // for (let i = 0; i < tasks['6_upcoming'].length; i++) {
          //   if (tasks['6_upcoming'][i]['sSubModule'] === 'kra') {
          //     kraCounter = kraCounter + 1;
          //   }
          // }

          // Current
          for (let i = 0; i < tasks['3_current'].length; i++) {
            if (tasks['3_current'][i]['sSubModule'] === 'kra' && tasks['3_current'][i]['sSubModuleItem'] !== 'Integrated PDP') {
              const user = { userUID: tasks['3_current'][i]['EmployeeUID'], iNumNotification: 1 };
              const index = tile['notificationEmployees'].findIndex(x => x['userUID'] == user['userUID']);
              index === -1 ? tile['notificationEmployees'].push(user) : tile['notificationEmployees'][index]['iNumNotification'] += 1
              kraCounter = kraCounter + 1;
            }
          }
          tile[notificationtype] = kraCounter;

          //-------- GROW -------- //
        } else if (tile['title'] === 'Grow') {
          for (let i = 0; i < tasks['1_arrears'].length; i++) {
            if (tasks['1_arrears'][i]['sSubModule'] === 'competency') {
              const user = { userUID: tasks['3_current'][i]['assessorUUID'], iNumNotification: 1 };
              const index = tile['notificationEmployees'].findIndex(x => x['userUID'] == user['userUID']);
              index === -1 ? tile['notificationEmployees'].push(user) : tile['notificationEmployees'][index]['iNumNotification'] += 1
              compCounter = compCounter + 1;
            }
          }
          for (let i = 0; i < tasks['2_draft'].length; i++) {
            if (tasks['2_draft'][i]['sSubModule'] === 'competency') {
              const user = { userUID: tasks['2_draft'][i]['assessorUUID'], iNumNotification: 1 };
              const index = tile['notificationEmployees'].findIndex(x => x['userUID'] == user['userUID']);
              index === -1 ? tile['notificationEmployees'].push(user) : tile['notificationEmployees'][index]['iNumNotification'] += 1
              compCounter = compCounter + 1;
            }
          }
          for (let i = 0; i < tasks['3_current'].length; i++) {
            if (tasks['3_current'][i]['sSubModule'] === 'competency' || tasks['3_current'][i]['sSubModuleItem'] === 'Integrated PDP') {
              const user = { userUID: tasks['3_current'][i]['assessorUUID'], iNumNotification: 1 };
              const index = tile['notificationEmployees'].findIndex(x => x['userUID'] == user['userUID']);
              index === -1 ? tile['notificationEmployees'].push(user) : tile['notificationEmployees'][index]['iNumNotification'] += 1
              compCounter = compCounter + 1;
            }
          }
          // if (this._authService['_KRAView'] !== 'personal') {
          // for (let i = 0; i < tasks['3_current'].length; i++) {
          //   if (tasks['3_current'][i]['sSubModule'] === 'kra' || tasks['3_current'][i]['sSubModuleItem'] === 'Manual PDP') {
          //     compCounter = compCounter + 1;
          //   }
          // }
          // }
          tile[notificationtype] = compCounter;

          //-------- CHOOSE -------- //
        } else if (tile['title'] === 'Choose') {
          for (let i = 0; i < tasks['3_current'].length; i++) {
            if (tasks['3_current'][i]['sSubModule'] === 'questionnaire') {
              const user = { userUID: tasks['3_current'][i]['EmployeeUID'], iNumNotification: 1 };
              const index = tile['notificationEmployees'].findIndex(x => x['userUID'] == user['userUID']);
              index === -1 ? tile['notificationEmployees'].push(user) : tile['notificationEmployees'][index]['iNumNotification'] += 1
              chooseCounter = chooseCounter + 1;
            }
            if (tasks['3_current'][i]['sSubModule'] === 'choose') {
              const user = { userUID: tasks['3_current'][i]['assessorUUID'], iNumNotification: 1 };
              const index = tile['notificationEmployees'].findIndex(x => x['userUID'] == user['userUID']);
              index === -1 ? tile['notificationEmployees'].push(user) : tile['notificationEmployees'][index]['iNumNotification'] += 1
              chooseCounter = chooseCounter + 1;
            }
          }
          tile[notificationtype] = chooseCounter;

          //-------- COACH -------- //
        } else if (tile['title'] === 'Coach') {
          if (notificationtype === 'iNumNotificationPersonal') {
            this._authService.getCoachNotification()
              .pipe(takeUntil(this.onDestroy))
              .subscribe(v => {
                tile[notificationtype] = this._authService._iNumNotificationCoach;
              });
          }

          //-------- ASPIRE -------- //
        } else if (tile['title'] === 'Train' || tile['title'] === 'Aspire') {
          for (let i = 0; i < tasks['3_current'].length; i++) {
            if (tasks['3_current'][i]['sSubModule'] === 'Train') {
              const user = { userUID: tasks['3_current'][i]['P5Corp_userUID'], iNumNotification: 1 };
              const index = tile['notificationEmployees'].findIndex(x => x['userUID'] == user['userUID']);
              index === -1 ? tile['notificationEmployees'].push(user) : tile['notificationEmployees'][index]['iNumNotification'] += 1
              trainCounter = trainCounter + 1;
            }
          }
          tile[notificationtype] = trainCounter;

          //-------- LIVE -------- //
        } else if (tile['title'] === 'Live') {
          for (let i = 0; i < tasks['3_current'].length; i++) {
            if (tasks['3_current'][i]['sSubModule'] === 'live' || tasks['3_current'][i]['sSubModuleItem'] === 'Exit Interview') {
              const user = { userUID: tasks['3_current'][i]['sAssessorInternal_fkUserUUID'], iNumNotification: 1 };
              const index = tile['notificationEmployees'].findIndex(x => x['userUID'] == user['userUID']);
              index === -1 ? tile['notificationEmployees'].push(user) : tile['notificationEmployees'][index]['iNumNotification'] += 1
              liveCounter = liveCounter + 1;
            }
            if (tasks['3_current'][i]['sSubModuleItem'] === 'esurvey') {
              const user = { userUID: tasks['3_current'][i]['Users_fkiUserUUId'], iNumNotification: 1 };
              const index = tile['notificationEmployees'].findIndex(x => x['userUID'] == user['userUID']);
              index === -1 ? tile['notificationEmployees'].push(user) : tile['notificationEmployees'][index]['iNumNotification'] += 1
              liveCounter = liveCounter + 1;
            }
          }
          tile[notificationtype] = liveCounter;

        } else if (tile['title'] === 'Reports') {

          const reports = this._authService._myMaxReportingStructure;
          if (notificationtype == 'iNumNotificationPersonal') {
            for (let i = 0; i < reports['children'].length; i++) {
              if (reports['children'][i]['name'] == 'Personal') {
                reportsCounter = reports['children'][i]['iNotifications'];
              }

            }
          } else {
            for (let i = 0; i < reports['children'].length; i++) {
              if (reports['children'][i]['name'] == 'Department') {
                reportsCounter = reports['children'][i]['iNotifications'];
              }
            }
          }

          tile[notificationtype] = reportsCounter;
        }

      });
      this._subscriptionUpdateMenu.emit();
    }
  }

  updateSubscriptionMenu() {
    this._subscriptionUpdateMenu.emit();
  }

  resetModuleStatesAndNotifications() {
    this.appIconPages = [
      {
        title: 'Perform',
        url: '/perform',
        icon: 'contract',
        image: '',
        bDisabled: true,
        iNumNotificationPersonal: 0,
        iNumNotificationTeam: 0,
        notificationEmployees: []
      },
      {
        title: 'Grow',
        url: '/grow',
        icon: 'leaf',
        image: '',
        bDisabled: true,
        iNumNotificationPersonal: 0,
        iNumNotificationTeam: 0,
        notificationEmployees: []
      },
      {
        title: 'Live',
        url: '/live',
        icon: 'accessibility',
        image: '',
        bDisabled: true,
        iNumNotificationPersonal: 0,
        iNumNotificationTeam: 0,
        notificationEmployees: []
      },
      {
        title: 'Choose',
        url: '/choose',
        icon: 'shuffle',
        image: '',
        bDisabled: true,
        iNumNotificationPersonal: 0,
        iNumNotificationTeam: 0,
        notificationEmployees: []
      },
      {
        title: 'Aspire',
        url: '/aspire',
        icon: 'telescope',
        image: '',
        bDisabled: true,
        iNumNotificationPersonal: 0,
        iNumNotificationTeam: 0,
        notificationEmployees: []
      },
      {
        title: 'Coach',
        url: '/coach',
        icon: 'medal',
        image: '',
        bDisabled: true,
        iNumNotificationPersonal: 0,
        iNumNotificationTeam: 0,
        notificationEmployees: []
      },
      {
        title: 'Talent',
        url: '#',
        icon: 'people-circle-outline',
        image: '',
        bDisabled: true,
        iNumNotificationPersonal: 0,
        iNumNotificationTeam: 0,
        notificationEmployees: []
      },
      {
        title: 'HR Admin',
        url: '#',
        icon: 'people-circle-outline',
        image: '',
        bDisabled: true,
        iNumNotificationPersonal: 0,
        iNumNotificationTeam: 0,
        notificationEmployees: []
      },
      {
        title: 'Leave',
        url: '#',
        icon: 'airplane',
        image: '',
        bDisabled: true,
        iNumNotificationPersonal: 0,
        iNumNotificationTeam: 0,
        notificationEmployees: []
      },
      {
        title: 'Reports',
        url: '/mymax-reporting',
        image: '',
        icon: 'bar-chart',
        bDisabled: true,
        iNumNotificationPersonal: 0,
        iNumNotificationTeam: 0,
        notificationEmployees: []
      }
    ]
  }

  setModuleMenu() {
    this._companyTemplate = this._authService._sessionUser['companytemplate'];
    if (this._companyTemplate?.linkedTiles) {
      // this._companyTemplate = this._authService._sessionUser['companytemplate'];

      this.appIconPages.forEach(page => {
        let pageIndex = this._companyTemplate['linkedTiles'].findIndex(x => x['sName'].toLowerCase() === page['title'].toLowerCase());
        if (pageIndex !== -1 && this._companyTemplate['linkedTiles'][pageIndex]['bDisplayP7']) {
          page.bDisabled = false;
          if (page.image === '') {
            page.image = '../../assets/imgs/modules/' + page['title'].replace(/ /g, "_").toLowerCase() + '.png';
          } else {
            page.image = this._companyTemplate['linkedTiles'][pageIndex]['sTileImageURL'];
          }
          page.icon = this._companyTemplate['linkedTiles'][pageIndex]['sIconP7'];
        }
        // Added for testing purposes displays all modules
        // page.bDisabled = false;

      });
      this._subscriptionUpdateMenu.emit();
    }



  }

}
