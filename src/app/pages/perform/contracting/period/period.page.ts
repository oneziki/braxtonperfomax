import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, KraService, LoaderService, PrintToolService } from '../../../../_services/index';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CompanyTemplate, KraCompanySettings } from '../../../../_models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-period',
  templateUrl: './period.page.html',
  styleUrls: ['./period.page.scss'],
})

export class PeriodPage implements OnInit, OnDestroy {
  private readonly onDestroy = new Subject<void>();

  _kraURPData: object;
  _userProfileData = {};
  _bMonthAlreadyScored = false;
  _kraCompanySettings: KraCompanySettings;
  _sErrorMessage: string;
  _KRAStatus = '';
  _sRoleToEmployee = '';
  _bShowObjectives = false;

  _scoredMonths = [];
  _allScoredMonths = [];
  targetMonthNames: string;

  dateFrom: string;
  dateTo: string;

  _bObjectives = [];
  _performanceAgreementData: object;

  constructor(private _router: Router,
    private _kraService: KraService,
    private _loaderService: LoaderService,
    public _authService: AuthService,
    private _printToolService: PrintToolService) { }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._kraCompanySettings = this._kraService._kraCompanySettings;
    this._sRoleToEmployee = this._kraService._sRoleToEmployee;
    this._KRAStatus = this._kraService.getStatusOption();

    this._kraService.getUserRoleProfileData()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.emitRoleProfileData();
      });
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }


  goActivitySummary() {
    this._router.navigate([this._authService._sPreviousUrl], { replaceUrl: true });
  }

  emitRoleProfileData() {
    this._kraURPData = this._kraService._p7kraRoleProfileData;
    this._userProfileData = this._kraURPData['personalDetails'];
    this._bObjectives = this._kraURPData['businessObjectives'];
    this._scoredMonths = this._userProfileData['targetMonths'];
    this._allScoredMonths = this._userProfileData['allScoredMonths'];
    this.targetMonthNames = this._userProfileData['targetMonthNames'];

    if (this._userProfileData['sEmployeeProfileImageUrl'] === '') {
      this._userProfileData['empSrcFail'] = true;
    } else {
      this._userProfileData['empSrcFail'] = false;
      if (this._userProfileData['sEmployeeProfileImageUrl'].indexOf('?') === -1) {
        this._userProfileData['sEmployeeProfileImageUrl'] =
          this._userProfileData['sEmployeeProfileImageUrl'] + '?' + Math.floor(Math.random() * 1000 + 1);
      }
    }

    if (this._userProfileData['sAdminProfileImageUrl'] === '') {
      this._userProfileData['managerSrcFail'] = true;
    } else {
      this._userProfileData['managerSrcFail'] = false;
      if (this._userProfileData['sAdminProfileImageUrl'].indexOf('?') === -1) {
        this._userProfileData['sAdminProfileImageUrl'] =
          this._userProfileData['sAdminProfileImageUrl'] + '?' + Math.floor(Math.random() * 1000 + 1);
      }
    }

    if (this._userProfileData['sContractPeriodStart'] !== '') {
      this.dateFrom = this._userProfileData['sContractPeriodStart'];
      this.dateTo = this._userProfileData['sContractPeriodEnd'];
    }

    if (this._userProfileData['sAllocatedRoleType'] !== 'Role Based') {
      this._bShowObjectives = true;
    } else {
      this._bShowObjectives = false;
    }
    // Always fetch the latest data
    this._kraService.getKraPerformanceAgreement()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.emitUpdateAgreement();
      });
  }

  emitUpdateAgreement() {

    if (this._kraService._kraPerformanceAgreementData) {
      this._performanceAgreementData = this._kraService._kraPerformanceAgreementData.performanceAgreement;

      if (this._KRAStatus === 'bView' || this._sRoleToEmployee !== 'Employee' || this._userProfileData['sAllocatedRoleType'] === 'Role Based') {
        this._bObjectives = this._performanceAgreementData['businessObjectives'];
        this._bObjectives.forEach(bo => {
          bo['checked'] = true;
        });
      } else {
        if (this._KRAStatus === this._kraService.taskStatusOptions['Draft'] && this._KRAStatus !== 'bComplete') {
          this._kraService._performanceAgreementProfile.objectivesData = this._performanceAgreementData['businessObjectives'];
          this._bObjectives.forEach(bo => {
            let isSet = false;
            this._performanceAgreementData['businessObjectives'].forEach(set => {
              if (set && set['BusinessUnitObjectivesUID'] === bo['BusinessUnitObjectivesUID']) {
                isSet = true;
                bo['checked'] = true;
              }

            });
            if (!isSet) {
              bo['Kra'] = [];
              bo['checked'] = false;
            }
          });
        }
      }
    }
    this._loaderService.exitLoader();
  }

  validateContractPeriod() {
    this._sErrorMessage = null;

    this._bMonthAlreadyScored = false;
    var start = new Date(this.dateFrom);
    // set and lock the end date
    if (this._kraCompanySettings['bLockAgreementEndDate'] === 1 && this.dateFrom) {


      const _endYear: number = start.getFullYear();
      const _endMonth: number = parseInt(this._kraCompanySettings['iAgreementEndMonthDate']);
      const _endDay: number = parseInt(this._kraCompanySettings['iAgreementEndDayDate']);
      this.dateTo = _endYear + '-' + _endMonth + '-' + _endDay;
    }

    // only do the validation of the end year is selected
    if (this.dateTo && this.dateTo !== undefined) {
      var end = new Date(this.dateTo);
      const tempArray = [];
      const sMonths = '';

      const _diff: number = end.getTime() - start.getTime();
      const _diffDays: number = _diff / (1000 * 3600 * 24);
      const _diffMonths: number =
        (end.getFullYear() - start.getFullYear()) * 12 +
        end.getMonth() -
        start.getMonth() +
        1;
      if (_diffDays < 0) {

        Swal.fire(
          'From date should be before the To date',
          'warning'
        );
      } else if (_diffDays === 0) {
        Swal.fire({
          title: 'Invalid dates',
          text: 'From and To date cannot be the same',
          icon: 'warning',
          heightAuto: false,
          confirmButtonColor: 'var(--primary)'
        });
      } else {
        // check if theres a score month on the agreement period selected
        let _bHasScoringMonths = false;
        for (let i = 0; i < _diffMonths; i++) {
          if (this._scoredMonths.filter(item => item.data === start.getMonth() + 1).length > 0) {
            _bHasScoringMonths = true;
          }

          for (let x = 0; x < this._allScoredMonths.length; x++) {
            if (parseInt(this._allScoredMonths[x].dMonthScoredFor.split('-')[1]) === start.getMonth() + 1 &&
              parseInt(this._allScoredMonths[x].dMonthScoredFor.split('-')[0]) === start.getFullYear()) {
              this._bMonthAlreadyScored = true;
              break;
            }
          }
          start.setMonth(start.getMonth() + 1);
        }

        if (!_bHasScoringMonths) {
          Swal.fire({
            title: 'Invalid dates',
            text: 'No scoring months available for selected period. (Available scoring month(s): ' + this.targetMonthNames + ')',
            icon: 'warning',
            heightAuto: false,
            confirmButtonColor: 'var(--primary)'
          });

        }
        if (this._bMonthAlreadyScored) {
          Swal.fire({
            title: 'Invalid dates',
            text: 'Please change your contracting dates',
            icon: 'warning',
            heightAuto: false,
            confirmButtonColor: 'var(--primary)'
          });
        }

      }

      if (this._userProfileData['sPrevContractPeriodStart'] &&
        this._userProfileData['sPrevContractPeriodStart'] !== '') {
        const _startYear: number = parseInt(this._userProfileData['sPrevContractPeriodStart'].split('-')[0]);
        const _endYear: number = parseInt(this._userProfileData['sPrevContractPeriodEnd'].split('-')[0]);
        const _startMonth: number = parseInt(this._userProfileData['sPrevContractPeriodStart'].split('-')[1]);
        const _endMonth: number = parseInt(this._userProfileData['sPrevContractPeriodEnd'].split('-')[1]);
        start = new Date(this.dateFrom);
        if (start.getFullYear() === _startYear &&
          end.getFullYear() === _endYear &&
          start.getMonth() + 1 === _startMonth &&
          end.getMonth() + 1 === _endMonth) {
          Swal.fire({
            title: 'Invalid dates',
            text: 'Contract period is incorrect, please insert correct dates',
            icon: 'warning',
            heightAuto: false,
            confirmButtonColor: 'var(--primary)'
          });
        }

      }

    }
  }

  busObjCheckboxChange(e, option) {
    if (this._KRAStatus !== 'bView') {
      if (e) {
        option['Kra'] = [];
        option['BppUID'] = option['bpp_fkBppUID'];
        option['checked'] = true;
        this._kraService._performanceAgreementProfile.objectivesData.push(option);
      } else {
        const that = this;
        for (let i = 0; i < that._kraService._performanceAgreementProfile.objectivesData.length; i++) {
          if (that._kraService._performanceAgreementProfile.objectivesData[i]['BusinessUnitObjectivesUID'] === option['BusinessUnitObjectivesUID']) {
            that._kraService._performanceAgreementProfile.objectivesData.splice(i, 1);
          }
        }
      }
    }

  }

  formatDates() {

    this._userProfileData['sContractPeriodStart'] = this.dateFrom;
    this._userProfileData['sContractPeriodEnd'] = this.dateTo;
  }

  goContractDesign() {
    let iNumberOfErrors: number = 0;
    if (this._KRAStatus !== 'bView' && this._sRoleToEmployee == 'Employee') {
      if (!this.dateFrom || !this.dateTo || this.dateFrom === '' || this.dateTo === '' || this.dateFrom === null) {
        Swal.fire({
          title: 'Invalid dates',
          text: 'Please enter the Performance Agreement Period to continue',
          icon: 'warning',
          heightAuto: false,
          confirmButtonColor: 'var(--primary)'
        });
        iNumberOfErrors++;
      }

      if (this._userProfileData['sPrevContractPeriodStart'] &&
        this._userProfileData['sPrevContractPeriodStart'] !== '') {
        const start = new Date(this.dateFrom);
        const end = new Date(this.dateTo);
        const _startYear: number = parseInt(this._userProfileData['sPrevContractPeriodStart'].split('-')[0]);
        const _endYear: number = parseInt(this._userProfileData['sPrevContractPeriodEnd'].split('-')[0]);
        const _startMonth: number = parseInt(this._userProfileData['sPrevContractPeriodStart'].split('-')[1]);
        const _endMonth: number = parseInt(this._userProfileData['sPrevContractPeriodEnd'].split('-')[1]);


        if (start.getFullYear() === _startYear &&
          end.getFullYear() === _endYear &&
          start.getMonth() + 1 === _startMonth &&
          end.getMonth() + 1 === _endMonth) {
          Swal.fire({
            title: 'Invalid dates',
            text: 'Contract period is incorrect, please insert correct dates',
            icon: 'warning',
            heightAuto: false,
            confirmButtonColor: 'var(--primary)'
          });
          iNumberOfErrors++
        }

      }

      let _bObjectiveSelected = false;
      this._bObjectives.forEach(bo => {
        if (bo['checked'] || bo['checked'] === true) {
          _bObjectiveSelected = true;
        }

      });

      if (!_bObjectiveSelected) {
        Swal.fire({
          title: 'Business Objectives',
          text: 'Please select a business objectives before continuing ',
          icon: 'warning',
          heightAuto: false,
          confirmButtonColor: 'var(--primary)'
        });
        iNumberOfErrors++;
      }
      this.formatDates();
    }

    if (iNumberOfErrors === 0) {
      this._router.navigate(['perform/contracting/design'], { replaceUrl: true });
    }

  }

  printKraContratingPDF() {
    this._loaderService.initLoader(true);
    this._kraService.getKRAPerformanceAgreementPDFProfile()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._printToolService.initPerformanceAgreementsView(this._kraService['_agreementPDFProfileData'], false);
        this._loaderService.exitLoader();
      });
  }

}
