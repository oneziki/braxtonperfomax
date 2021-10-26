import { Component, OnInit, Output, EventEmitter, Input, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EmployeeDirectoryService, AuthService, MyMax7Service } from '../../../../_services/index';
import { CompanyTemplate, MyMaxTemplateMenu, SessionUser } from '../../../../_models';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-coach-panel',
  templateUrl: './coach-panel.page.html',
  styleUrls: ['./coach-panel.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CoachPage implements OnInit, OnDestroy {

  @Input() sessionUser: any;
  @Output() onItemClick = new EventEmitter();

  _directReports = [];
  _sessionUser: SessionUser;
  _selectedEmployeeUID = '';
  _companyTemplate: CompanyTemplate;
  _myMaxReportingTemplateViews: MyMaxTemplateMenu[] = [];
  _linkedTile = {};

  private teamSub: Subscription;
  private readonly onDestroy = new Subject<void>();

  constructor(
    private _router: Router,
    private _employeeDirectoryService: EmployeeDirectoryService,
    public _authService: AuthService,
    public _myMax7Service: MyMax7Service) {
    this.teamSub = this._employeeDirectoryService._employeeDirectReportDataChanged.subscribe(
      (value) => this.setTeam()
    );
  }

  ngOnInit() {
    this._sessionUser = this._authService._sessionUser;
    this._companyTemplate = this._sessionUser['companytemplate'];
    this._directReports = this._employeeDirectoryService._directReports;
    this._selectedEmployeeUID = this._sessionUser['P6_userUID'];

    if (this._sessionUser) {
      if (this._sessionUser['profilePhoto'] === '') {
        this._sessionUser['empSrcFail'] = true;
      } else {
        this._sessionUser['empSrcFail'] = false;

      }
    }

    if (this._companyTemplate.linkedTiles.length > 0) {
      const pageIndex = this._companyTemplate.linkedTiles.findIndex(x => x['sName'] == 'Coach');
      if (pageIndex !== -1) {
        this._linkedTile = this._companyTemplate.linkedTiles[pageIndex];
      }
    }

    for (let i = 0; i < this._companyTemplate['linkedTiles'].length; i++) {
      if (this._companyTemplate['linkedTiles'][i]['sName'] === 'Coach') {
        this._linkedTile = this._companyTemplate['linkedTiles'][i];
        break;
      }
    }

    if (!this._directReports.length) {
      this._employeeDirectoryService.getDirectReportsForEmployee(this.sessionUser['P6_userUID']).then(response => {
        this._directReports = response;
      });
    }

    this._myMax7Service.getMyMaxReportingTemplateViews(this._linkedTile['portalTemplateTileUID'], 'Department', this.sessionUser['P6_userUID'])
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.setMyMaxReportingTemplateViews();
      });
  }

  ngOnDestroy() {
    this.onDestroy.next();
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
    if (this._router.url !== '/coach' && this._router.url !== '/activity-summary') {
      this._router.navigate(['coach'], { replaceUrl: true });
    }

    this._employeeDirectoryService.setPerformUser(user);
  }

  setMyMaxReportingTemplateViews() {
    if (this._myMax7Service._myMaxReportingTemplateViews.length > 0) {
      this._myMaxReportingTemplateViews = this._myMax7Service._myMaxReportingTemplateViews;
    }
  }

}
