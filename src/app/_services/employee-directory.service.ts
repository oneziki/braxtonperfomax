import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { AppSettings, SessionUser } from '../_models/index';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { EmployeeDirectory } from '../_models/index';
import { AuthService } from '../_services/auth.service';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { PostService } from './post.service';
import { catchError, map, tap } from 'rxjs/operators';
import { MessengerService } from '../_services/messengerservice.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable()
export class EmployeeDirectoryService implements OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private AUTHSubscription: Subscription;

  _sessionUser: SessionUser;
  _teamEmployees: EmployeeDirectory[] = [];
  _orgDepartmentEmployees: EmployeeDirectory[] = [];
  _orgEmployees: EmployeeDirectory[] = [];
  _2ndReportToEmployees: EmployeeDirectory[] = [];
  _directReports: EmployeeDirectory[] = [];
  _adminAccessUsers: EmployeeDirectory[] = [];
  _employee = {};
  _clientUID = '';
  _organisationTiers = [];
  _employeeAdminReportTo: EmployeeDirectory[] = [];
  _performUser = {};
  // _dataChanged = new EventEmitter();
  // _dataChanged_organisationDirectory = new EventEmitter();
  // _dataChanged_departmentDirectory = new EventEmitter();
  // _2ndReportEmployeeDataChanged = new EventEmitter();
  // _employeeAdminReportToDataChanged = new EventEmitter();

  _employeePerformUserChanged = new EventEmitter();
  _employeeDirectReportDataChanged = new EventEmitter();

  constructor (
    private _mService: MessengerService,
    private _http: HttpClient,
    private _router: Router,
    public _authService: AuthService,
    private _pService: PostService
  ) {
    this.AUTHSubscription = this._authService._userSessionChanged.subscribe(
      (value) => this.updateSessionUser(value)
    );
    this._sessionUser = this._authService._sessionUser;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.AUTHSubscription.unsubscribe();
  }

  updateSessionUser(value) {
    this._sessionUser = this._authService._sessionUser;
    this._teamEmployees = [];
    this._orgDepartmentEmployees = [];
    this._orgEmployees = [];
    this._directReports = [];
    this._clientUID = this._sessionUser.P5ClientUID;
    // this._authService._sessionUser.P5ClientUID;
  }

  async getReportToEmployees(P6_userUID: string) {
    const bodyString = JSON.stringify({
      peformaxToken: AppSettings.PEFORMAX_TOKEN,
      P6_userUID: P6_userUID,
      sModule: 'employeeDirectory',
      sFunction: 'getReportToEmployees',
    });

    const result = await this._pService.postData('getReportToEmployees', bodyString, 'get');
    this._teamEmployees = JSON.parse(JSON.stringify(result));
    // this._dataChanged.emit();
  }

  async getEmployeesAdminReportTo(P6_userUID: string) {
    const bodyString = JSON.stringify({
      peformaxToken: AppSettings.PEFORMAX_TOKEN,
      P6_userUID: P6_userUID,
      sModule: 'employeeDirectory',
      sFunction: 'getEmployeesAdminReportTo',
    });

    const result = await this._pService.postData('getEmployeesAdminReportTo', bodyString, 'get');
    this._employeeAdminReportTo = JSON.parse(JSON.stringify(result));
    return this._employeeAdminReportTo;
    // this._employeeAdminReportToDataChanged.emit();
  }

  async getDirectReportsForEmployee(P6_userUID: string) {
    const bodyString = JSON.stringify({
      peformaxToken: AppSettings.PEFORMAX_TOKEN,
      P6_userUID: P6_userUID,
      sModule: 'employeeDirectory',
      sFunction: 'getDirectReportsForEmployee',
    });

    const result = await this._pService.postData('getDirectReportsForEmployee', bodyString, 'get');
    this._directReports = JSON.parse(JSON.stringify(result));
    this._employeeDirectReportDataChanged.emit();
    return this._directReports;
  }

  async get2ndLevelReportToEmployees(P6_userUID: string) {
    const bodyString = JSON.stringify({
      peformaxToken: AppSettings.PEFORMAX_TOKEN,
      P6_userUID: P6_userUID,
      sModule: 'employeeDirectory',
      sFunction: 'getSecondLevelReportToEmployees',
    });

    const result = await this._pService.postData('getSecondLevelReportToEmployees', bodyString, 'get');
    this._2ndReportToEmployees = JSON.parse(JSON.stringify(result));
    // this._2ndReportEmployeeDataChanged.emit();
  }

  async getOrgDepartmentEmployees(P6_userUID: string) {
    const bodyString = JSON.stringify({
      peformaxToken: AppSettings.PEFORMAX_TOKEN,
      P6_userUID: P6_userUID,
      sModule: 'employeeDirectory',
      organisationTiersUUID:
        this._authService._sessionUser.organisationTiersUUID,
      sFunction: 'getOrgDepartmentEmployees',
    });

    const result = await this._pService.postData('getOrgDepartmentEmployees', bodyString, 'get');
    this._orgDepartmentEmployees = JSON.parse(JSON.stringify(result));
    // this._dataChanged_departmentDirectory.emit();
  }

  async getOrganisationEmployees(P6_userUID: string, clientUID: string) {
    const bodyString = JSON.stringify({
      peformaxToken: AppSettings.PEFORMAX_TOKEN,
      P6_userUID: P6_userUID,
      sModule: 'employeeDirectory',
      clientUID: clientUID,
      sFunction: 'getOrganisationEmployees',
    });

    const result = await this._pService.postData('getOrganisationEmployees', bodyString, 'get');
    this._orgEmployees = JSON.parse(JSON.stringify(result));
    // this._dataChanged_organisationDirectory.emit();
  }

  async getUsersForUserAdminAccess(P6_userUID: string) {
    const bodyString = JSON.stringify({
      peformaxToken: AppSettings.PEFORMAX_TOKEN,
      P6_userUID: P6_userUID,
      sModule: 'employeeDirectory',
      sFunction: 'getUsersForUserAdminAccess',
    });

    const result = await this._pService.postData('getUsersForUserAdminAccess', bodyString, 'get');
    this._adminAccessUsers = JSON.parse(JSON.stringify(result));
  }

  async getOrganisationTiers(P6_userUID: string, clientUID: string) {
    const bodyString = JSON.stringify({
      peformaxToken: AppSettings.PEFORMAX_TOKEN,
      P6_userUID: P6_userUID,
      clientUID: clientUID,
      sModule: 'employeeDirectory',
      sFunction: 'getOrganisationTiers',
    });

    const result = await this._pService.postData('getOrganisationTiers', bodyString, 'get');
    this._organisationTiers = JSON.parse(JSON.stringify(result));
  }

  setPerformUser(user) {
    this._performUser = user;
    this._employeePerformUserChanged.emit();
  }
}
