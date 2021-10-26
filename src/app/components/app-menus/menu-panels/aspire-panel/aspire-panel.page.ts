import { Component, OnInit, Output, EventEmitter, Input, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EmployeeDirectoryService, AuthService, MyMax7Service, NotificationService } from '../../../../_services/index';
import { CompanyTemplate, MyMaxTemplateMenu, SessionUser } from '../../../../_models';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-aspire-panel',
  templateUrl: './aspire-panel.page.html',
  styleUrls: ['./aspire-panel.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AspirePage implements OnInit, OnDestroy {

  @Input() sessionUser: any;
  @Output() onItemClick = new EventEmitter();

  _directReports = [];
  _sessionUser: SessionUser;
  _selectedEmployeeUID = '';
  _companyTemplate: CompanyTemplate;
  _myMaxReportingTemplateViews: MyMaxTemplateMenu[] = [];
  _linkedTile = {};

  _personalNotification = 0;
  private subscriptionUpdateNotifications: Subscription;

  private teamSub: Subscription;
  private readonly onDestroy = new Subject<void>();

  constructor(
    private _router: Router,
    private _employeeDirectoryService: EmployeeDirectoryService,
    public _authService: AuthService,
    private _notificationService: NotificationService,
    public _myMax7Service: MyMax7Service) {
    this.teamSub = this._employeeDirectoryService._employeeDirectReportDataChanged.subscribe(
      (value) => this.setTeam()
    );

    this.subscriptionUpdateNotifications = this._notificationService._subscriptionUpdateMenu.subscribe(
      (value) => this.setNotifications()
    );
  }

  ngOnInit() {
    this._sessionUser = this._authService._sessionUser;
    this._companyTemplate = this._sessionUser['companytemplate'];
    this._directReports = this._employeeDirectoryService._directReports;
    this._selectedEmployeeUID = this._sessionUser['P6_userUID'];
    this._personalNotification = 0;

    if (this._companyTemplate.linkedTiles.length > 0) {
      const pageIndex = this._companyTemplate.linkedTiles.findIndex(x => x['sName'] == 'Aspire');
      if (pageIndex !== -1) {
        this._linkedTile = this._companyTemplate.linkedTiles[pageIndex];
      }
    }

    if (this._sessionUser) {
      if (this._sessionUser['profilePhoto'] === '') {
        this._sessionUser['empSrcFail'] = true;
      } else {
        this._sessionUser['empSrcFail'] = false;

      }
    }

    if (!this._directReports.length) {
      this._employeeDirectoryService.getDirectReportsForEmployee(this.sessionUser['P6_userUID']).then(response => {
        this._directReports = response;
        this.setNotifications();
      });
    } else {
      this.setNotifications();
    }

    this._myMax7Service.getMyMaxReportingTemplateViews(this._linkedTile['portalTemplateTileUID'], 'Department', this.sessionUser['P6_userUID'])
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.setMyMaxReportingTemplateViews();
      });
  }

  ngOnDestroy() {
    this.subscriptionUpdateNotifications.unsubscribe();
    this.teamSub.unsubscribe();
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  setTeam() {
    this._directReports = this._employeeDirectoryService._directReports;
  }

  setSelectedUser(user) {
    if ('userUUID' in user) {
      this._selectedEmployeeUID = user['userUUID'];
    } else {
      this._selectedEmployeeUID = user['P6_userUID'];
    }
    if (this._router.url !== '/aspire' && this._router.url !== '/activity-summary') {
      this._router.navigate(['aspire'], { replaceUrl: true });
    }

    this._employeeDirectoryService.setPerformUser(user);
  }

  setMyMaxReportingTemplateViews() {
    if (this._myMax7Service._myMaxReportingTemplateViews.length > 0) {
      this._myMaxReportingTemplateViews = this._myMax7Service._myMaxReportingTemplateViews;
    }
  }

  setNotifications() {
    // Get Module
    const pageIndex = this._notificationService.appIconPages.findIndex(x => x['title'] == 'Aspire');
    if (pageIndex !== -1) {
      for (let index = 0; index < this._directReports.length; index++) {
        const employee = this._directReports[index];
        employee['iNumNotification'] = 0;
      }
      this._personalNotification = 0;
      // Set Module
      const Module = this._notificationService.appIconPages[pageIndex];
      // Loop through Module Notfication EMployees
      Module['notificationEmployees'].forEach(user => {
        // Check if current Module Notification ID is the userhimself
        if (user['userUID'] === this._sessionUser.P5Corp_userUID) {
          this._personalNotification = user['iNumNotification'];
        } else {
          // otherwise loop through direct reports
          for (let index = 0; index < this._directReports.length; index++) {
            const employee = this._directReports[index];
            if (employee['userUUID'] === user['userUID']) {
              employee['iNumNotification'] = user['iNumNotification'];
              // Break when we find match
              break;
            }
          }
        }
      });
    }
  }

}
