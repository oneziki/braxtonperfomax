import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { AuthService, LoaderService, RecruitmentService } from '../../../../_services/index';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { JobTitleRoleProfile } from 'src/app/_models';

@Component({
  selector: 'app-vacancy-list',
  templateUrl: './vacancy-list.page.html',
  styleUrls: ['./vacancy-list.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VacancyListPage implements OnInit, OnDestroy {


  private readonly onDestroy = new Subject<void>();

  _vacancyList: JobTitleRoleProfile[] = [];
  _departments = [];
  _sDepFilter = 'All';
  _searchText = '';
  _sortType = { RoleTitle: 'none', Department: 'none', Location: 'none' };

  _isLoadingVacancyList = true;
  _isLoadingDepartmentList = true;

  constructor (public _authService: AuthService,
    private _recruitmentService: RecruitmentService,
    private _loaderService: LoaderService,
    private _router: Router) { }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._authService.hideAppPanel(true);
    this._recruitmentService.getAllVacancies()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.updateVacancies();
      });


    this._recruitmentService.getVacancyDepartments()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.updateVacancyDepartments();
      });

  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  checkLoaderAllClear() {
    let toReturn = true;

    if (this._isLoadingVacancyList) {
      toReturn = false;
    }
    if (this._isLoadingDepartmentList) {
      toReturn = false;
    }

    if (toReturn === true) {
      this._loaderService.exitLoader();
    }
  }

  updateVacancies() {
    this._vacancyList = this._recruitmentService._vacancies;
    this._vacancyList.forEach(role => {
      role['expanded'] = false;
    });
    this._isLoadingVacancyList = false;
    this.checkLoaderAllClear();
  }

  updateVacancyDepartments() {
    this._departments = this._recruitmentService._OrgDepartments;
    const depart = new Object();
    depart['sOrganisationTierName'] = 'All';
    depart['organisationTiersUUID'] = '';
    this._departments.unshift(depart);
    this._sDepFilter = this._departments[0]['sOrganisationTierName'];
    this._isLoadingDepartmentList = false;
    this.checkLoaderAllClear();
  }

  departmentFilterChange(department) {
    this._vacancyList = this._recruitmentService._vacancies;
    this._sDepFilter = department['detail']['value']['sOrganisationTierName'];

    if (this._sDepFilter !== 'All') {
      this._vacancyList = this._vacancyList.filter(
        (item) => item['sOrganisationTierName'] === this._sDepFilter
      );
    }
  }


  viewVacancyProfile(JobTitleRoleUID) {
    this._recruitmentService._selectedJobTitle = JobTitleRoleUID;
    this._router.navigate(['choose/recruitment/vacancy'], { replaceUrl: true });

  }

  printPDFReport(JobTitleUUID) {
    this._recruitmentService.printRoleProfileReport(JobTitleUUID)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        // do nothing - service handling new tab with pdf
      });
  }

  sortBy(column) {
    if (column === 'RoleTitle') {
      // sort by roletitle asc/desc logic
      if (
        this._sortType['RoleTitle'] === 'desc' ||
        this._sortType['RoleTitle'] === 'none'
      ) {
        this._vacancyList.sort((a, b) =>
          a.sJobTitleRoleName > b.sJobTitleRoleName ? 1 : -1
        );
        this._sortType['RoleTitle'] = 'asc';
      } else {
        this._vacancyList.sort((a, b) =>
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
        this._vacancyList.sort((a, b) =>
          a.sOrganisationTierName > b.sOrganisationTierName ? 1 : -1
        );
        this._sortType['Department'] = 'asc';
      } else {
        this._vacancyList.sort((a, b) =>
          b.sOrganisationTierName > a.sOrganisationTierName ? 1 : -1
        );
        this._sortType['Department'] = 'desc';
      }
      // hide arrows for other columns that were prev sorted
      this._sortType['RoleTitle'] = 'none';
      this._sortType['Location'] = 'none';
    }
  }

  goChoosePage() {
    this._router.navigate(['choose'], { replaceUrl: true });
  }


}
