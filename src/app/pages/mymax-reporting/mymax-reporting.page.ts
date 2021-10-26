import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService, EmployeeDirectoryService, MyMax7Service, LoaderService, PrintToolService, NotificationService } from '../../_services/index';
import { Subscription } from 'rxjs';
import { AppSettings, SessionUser, Task, CompanyTemplate, KraCompanySettings, MyMaxTemplateMenu, MyMaxFilter } from '../../_models';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mymax-reporting',
  templateUrl: './mymax-reporting.page.html',
  styleUrls: ['./mymax-reporting.page.scss'],
})
export class MymaxReportingPage implements OnInit, OnDestroy {

  _sessionUser: SessionUser;
  _performUser = {};
  _companyTemplate: CompanyTemplate;
  _myMaxReportingData = {};
  _printerFilter = '';
  _isLoading = true;
  _personal = [];
  _myTeam = [];

  private performUserSub: Subscription;
  private readonly onDestroy = new Subject<void>();

  constructor(private _router: Router,
    public _authService: AuthService,
    public _myMax7Service: MyMax7Service,
    private _notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
    private _employeeDirectoryService: EmployeeDirectoryService,
    public _loaderService: LoaderService,
    private _printtoolService: PrintToolService) {
    this.performUserSub = this._employeeDirectoryService._employeePerformUserChanged.subscribe(
      (value) => this.setPerformUser()
    );
  }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._authService.hideAppPanel(false);

    this._sessionUser = this._authService._sessionUser;
    this._companyTemplate = this._sessionUser['companytemplate'];
    this._myMaxReportingData = this._myMax7Service._myMaxReportingData;

    if ('P6_userUID' in this._employeeDirectoryService._performUser) {
      this._performUser = this._employeeDirectoryService._performUser;
    } else {
      this._performUser = this._sessionUser;
    }

    if (this.isEmpty(this._myMaxReportingData)) {
      this._myMax7Service.getIndivReportingMenuStructureForUserUID(this._sessionUser['P6_userUID'], this._sessionUser['P6CompanyUID'])
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.setMyMaxReportingData();
        });
    } else {
      this.setMyMaxReportingData();
    }

  }

  ngOnDestroy() {
    this.closePDFView();
    this.onDestroy.next();
    this.onDestroy.complete();
    this.performUserSub.unsubscribe();
  }

  closePDFView() {
    this._printtoolService._triggerClosingView.emit();
  }

  setPerformUser() {
    this._loaderService.initLoader(true);
    this._performUser = this._employeeDirectoryService._performUser;
    this.closePDFView();
    if ('userUUID' in this._performUser) {
      this._performUser['P6_userUID'] = this._performUser['userUUID'];
    }
    if ('sJobTitleName' in this._performUser) {
      this._performUser['sJobTitle'] = this._performUser['sJobTitleName'];
    }
    this._loaderService.exitLoader();
  }

  setMyMaxReportingData() {
    this._myMaxReportingData = this._myMax7Service._myMaxReportingData;
    let _personalTemp = [];
    let _myTeamTemp = [];

    for (let i = 0; i < this._myMaxReportingData['children'].length; i++) {
      if (this._myMaxReportingData['children'][i]['name'] === 'Personal') {
        if (this._myMaxReportingData['children'][i]['children'].length !== 0) {
          this._myMaxReportingData['children'][i]['children'].forEach((child) => {
            if (child['name'] === 'Dashboard' && child['myMaxChildren'].length > 0) {
              child['myMaxChildren'].forEach(element => {
                this._personal.push({ sTile: element['sName'], myMaxChildren: [] });
              });
            }
          });
        }
      } else {
        if (this._myMaxReportingData['children'][i]['children'].length !== 0) {
          this._myMaxReportingData['children'][i]['children'].forEach((child) => {
            if (child['name'] === 'Dashboard' && child['myMaxChildren'].length > 0) {
              child['myMaxChildren'].forEach(element => {
                this._myTeam.push({ sTile: element['sName'], myMaxChildren: [] });
              });
            }
          });
        }
      }
    }

    this._personal.map(x => _personalTemp.filter(a => a.sTile == x.sTile && a.sTile == x.sTile).length > 0 ? null : _personalTemp.push(x));
    this._personal = _personalTemp;
    this._myTeam.map(x => _myTeamTemp.filter(a => a.sTile == x.sTile && a.sTile == x.sTile).length > 0 ? null : _myTeamTemp.push(x));
    this._myTeam = _myTeamTemp;

    for (let i = 0; i < this._myMaxReportingData['children'].length; i++) {
      if (this._myMaxReportingData['children'][i]['name'] === 'Personal') {
        if (this._myMaxReportingData['children'][i]['children'].length !== 0) {
          this._myMaxReportingData['children'][i]['children'].forEach((child) => {
            if (child['name'] === 'Dashboard' && child['myMaxChildren'].length > 0) {
              child['myMaxChildren'].forEach(element => {
                this._personal.forEach(tile => {
                  if (tile['sTile'] === element['sName']) {
                    tile['myMaxChildren'].push(element);
                  }
                });
              });
            }
          });
        }
      } else {
        if (this._myMaxReportingData['children'][i]['children'].length !== 0) {
          this._myMaxReportingData['children'][i]['children'].forEach((child) => {
            if (child['name'] === 'Dashboard' && child['myMaxChildren'].length > 0) {
              child['myMaxChildren'].forEach(element => {
                this._myTeam.forEach(tile => {
                  if (tile['sTile'] === element['sName']) {
                    tile['myMaxChildren'].push(element);
                  }
                });
              });
            }
          });
        }
      }
    }

    this._isLoading = false;
    this._loaderService.exitLoader();
  }

  isEmpty(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  updateFilter(sHeading, myMaxChildren) {

    if (myMaxChildren['iNotifications'] > 0) {
      myMaxChildren['iNotifications'] = 0;
      this._notificationService.appIconPages.forEach(tile => {
        if (tile['title'] === 'Reports') {
          if (sHeading === 'Personal') {
            tile['iNumNotificationPersonal'] -= 1;
          } else {
            tile['iNumNotificationTeam'] -= 1;
          }
        }
      });
      this._notificationService.updateSubscriptionMenu();
    }

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

}
