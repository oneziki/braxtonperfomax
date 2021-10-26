import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {
  JobTitleRoleProfile,
  KraCompanySettings,
} from '../../../_models/index';
import {
  AuthService,
  JobTitleRoleProfileService,
  KraService, LoaderService
} from '../../../_services/index';

@Component({
  selector: 'app-role-profiles-list',
  templateUrl: './role-profiles-list.page.html',
  styleUrls: ['./role-profiles-list.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RoleProfilesListPage implements OnInit, OnDestroy {
  _jobTitleRoles: JobTitleRoleProfile[] = [];
  _kraCompanySettings: KraCompanySettings;
  _orgDepartments = [];
  _expandedComp = false;
  _sDepartmentFilter = '';
  _searchText = '';
  _sSearchFilterOption = 'Role Title';
  _searchFilterOptions = ['Role Title', 'Competency', 'KRA'];
  _isLoadingDepartmentList = true;
  _isLoadingJobTitlesList = true;
  _sortType = { RoleTitle: 'none', Department: 'none', Location: 'none' };

  private readonly onDestroy = new Subject<void>();

  constructor(
    private _jobTitleRoleProfileService: JobTitleRoleProfileService,
    public _authService: AuthService,
    public _kraService: KraService,
    private _router: Router,
    public _loaderService: LoaderService
  ) { }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._authService.hideAppPanel(true);
    this._orgDepartments = this._jobTitleRoleProfileService._OrgDepartments;
    this._jobTitleRoles = this._jobTitleRoleProfileService._roleProfile;
    this._kraCompanySettings = this._kraService._kraCompanySettings;

    if (this._orgDepartments.length === 0) {
      this._jobTitleRoleProfileService
        .getJobTileRoleProfileDepartments(
          this._authService._sessionUser.P5Corp_userUID
        )
        .pipe(takeUntil(this.onDestroy))
        .subscribe((v) => {
          this.orgDepartmentsChanged();
        });
    } else {
      this._isLoadingDepartmentList = false;
    }

    if (!this._kraCompanySettings) {
      this._kraService
        .getKraCompanySettings()
        .pipe(takeUntil(this.onDestroy))
        .subscribe((v) => {
          this.setKRACompanySettings();
        });
    }

    if (this._jobTitleRoles.length === 0) {
      this._jobTitleRoleProfileService
        .getAllRoleProfiles()
        .pipe(takeUntil(this.onDestroy))
        .subscribe((v) => {
          this.jobTitleRoleProfileUpdate();
        });
    } else {
      this._isLoadingJobTitlesList = false;
    }

    this.checkLoaderAllClear();
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  checkLoaderAllClear() {
    let toReturn = true;

    if (this._isLoadingDepartmentList) {
      toReturn = false;
    }
    if (this._isLoadingJobTitlesList) {
      toReturn = false;
    }

    if (toReturn === true) {
      this._loaderService.exitLoader();
    }
  }

  // EMITTERS
  orgDepartmentsChanged() {
    this._orgDepartments = this._jobTitleRoleProfileService._OrgDepartments;
    const depart = new Object();
    depart['sOrganisationTierName'] = 'All';
    depart['organisationTiersUUID'] = '';
    this._orgDepartments.unshift(depart);
    this._sDepartmentFilter = this._orgDepartments[0]['sOrganisationTierName'];
    this._isLoadingDepartmentList = false;
    this.checkLoaderAllClear();
  }

  jobTitleRoleProfileUpdate() {
    this._jobTitleRoles = this._jobTitleRoleProfileService._roleProfile;
    this._jobTitleRoles.forEach((role) => {
      role['expanded'] = false;
    });
    this._isLoadingJobTitlesList = false;
    this.checkLoaderAllClear();
  }

  setKRACompanySettings() {
    this._kraCompanySettings = this._kraService._kraCompanySettings;
  }

  // FILTER CHANGE EVENTS
  departmentFilterChange(department) {
    this._jobTitleRoles = this._jobTitleRoleProfileService._roleProfile;
    this._sDepartmentFilter = department['detail']['value']['sOrganisationTierName'];

    if (this._sDepartmentFilter !== 'All') {
      this._jobTitleRoles = this._jobTitleRoles.filter(
        (item) => item['sOrganisationTierName'] === this._sDepartmentFilter
      );
    }
  }

  searchFilterOptionChanged(sSearchFilterOption) {
    this._sSearchFilterOption = sSearchFilterOption['detail']['value'];
  }

  viewRolePorfile(JobTitleUUID) {
    this._jobTitleRoleProfileService._selectedJobTitle = JobTitleUUID;
    this._router.navigate(['/profile-library/role-profiles-view'], { replaceUrl: true });
  }

  sortBy(column) {
    if (column === 'RoleTitle') {
      // sort by roletitle asc/desc logic
      if (
        this._sortType['RoleTitle'] === 'desc' ||
        this._sortType['RoleTitle'] === 'none'
      ) {
        this._jobTitleRoles.sort((a, b) =>
          a.sJobTitleRoleName > b.sJobTitleRoleName ? 1 : -1
        );
        this._sortType['RoleTitle'] = 'asc';
      } else {
        this._jobTitleRoles.sort((a, b) =>
          b.sJobTitleRoleName > a.sJobTitleRoleName ? 1 : -1
        );
        this._sortType['RoleTitle'] = 'desc';
      }
      // hide arrows for other columns that were prev sorted
      this._sortType['Department'] = 'none';
      this._sortType['Location'] = 'none';
    } else if (column === 'Department') {
      // sort by Department asc/desc logic
      if (
        this._sortType['Department'] === 'desc' ||
        this._sortType['Department'] === 'none'
      ) {
        this._jobTitleRoles.sort((a, b) =>
          a.sOrganisationTierName > b.sOrganisationTierName ? 1 : -1
        );
        this._sortType['Department'] = 'asc';
      } else {
        this._jobTitleRoles.sort((a, b) =>
          b.sOrganisationTierName > a.sOrganisationTierName ? 1 : -1
        );
        this._sortType['Department'] = 'desc';
      }
      // hide arrows for other columns that were prev sorted
      this._sortType['RoleTitle'] = 'none';
      this._sortType['Location'] = 'none';
    }
  }

  printPDFReport(JobTitleUUID) {
    this._jobTitleRoleProfileService.printRoleProfileReport(JobTitleUUID)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._loaderService.exitLoader();
      });
  }

  goBack() {
    this._router.navigate(['home'], { replaceUrl: true });
  }
}
