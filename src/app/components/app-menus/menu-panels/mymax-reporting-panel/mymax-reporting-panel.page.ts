import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EmployeeDirectoryService, AuthService, PrintToolService } from '../../../../_services/index';
import { CompanyTemplate, SessionUser } from '../../../../_models';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-mymax-reporting-panel',
  templateUrl: './mymax-reporting-panel.page.html',
  styleUrls: ['./mymax-reporting-panel.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MymaxReportingPanel implements OnInit, OnDestroy {

  @Input() sessionUser: any;
  @Output() onItemClick = new EventEmitter();

  _directReports = [];
  _sessionUser: SessionUser;
  _selectedEmployeeUID = '';
  _companyTemplate: CompanyTemplate;
  _linkedTile = {};

  private teamSub: Subscription;
  private readonly onDestroy = new Subject<void>();

  constructor(
    private _router: Router,
    private _employeeDirectoryService: EmployeeDirectoryService,
    public _authService: AuthService,
    private _printtoolService: PrintToolService) {
    this.teamSub = this._employeeDirectoryService._employeeDirectReportDataChanged.subscribe(
      (value) => this.setTeam()
    );
  }

  ngOnInit() {
    this._sessionUser = this._authService._sessionUser;
    this._companyTemplate = this._sessionUser['companytemplate'];
    this._directReports = this._employeeDirectoryService._directReports;
    this._selectedEmployeeUID = this._sessionUser['P6_userUID'];

    if (this._companyTemplate.linkedTiles.length > 0) {
      const pageIndex = this._companyTemplate.linkedTiles.findIndex(x => x['sName'] == 'Reports');
      if (pageIndex !== -1) {
        this._linkedTile = this._companyTemplate.linkedTiles[pageIndex];
      }
    }

    if (!this._directReports.length) {
      this._employeeDirectoryService.getDirectReportsForEmployee(this.sessionUser['P6_userUID']).then(response => {
        this._directReports = response;
      });
    }

    if (this._sessionUser) {
      if (this._sessionUser['profilePhoto'] === '') {
        this._sessionUser['empSrcFail'] = true;
      } else {
        this._sessionUser['empSrcFail'] = false;

      }
    }
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  setTeam() {
    this._directReports = this._employeeDirectoryService._directReports;
  }

  setPerformUser(user) {
    if ('userUUID' in user) {
      this._selectedEmployeeUID = user['userUUID'];
    } else {
      this._selectedEmployeeUID = user['P6_userUID'];
    }
    this.closePDFView();
    this._employeeDirectoryService.setPerformUser(user);
  }

  closePDFView() {
    this._printtoolService._triggerClosingView.emit();
  }

}
