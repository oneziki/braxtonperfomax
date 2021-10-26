import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { KraCompanySettings, SWOTAnalysisManual, SWOTAnalysisScales, SWOTArray } from '../../../_models/index';
import { AuthService, KraService, LoaderService, SWOTAnalysisService } from '../../../_services/index';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-swot-analysis',
  templateUrl: './swot-analysis.page.html',
  styleUrls: ['./swot-analysis.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SwotAnalysisPage implements OnInit, OnDestroy {

  _kraCompanySettings: KraCompanySettings;
  _personalSWOTAnalysis: SWOTAnalysisManual;
  _SWOTAnalysisScale: SWOTAnalysisScales[] = [];
  _removedSWOTAnalysisItems = [];

  _pageGO = false;
  _bViewMode = false;
  _isLoading = true;

  _filterYear: string;
  _filterMonth = 0;
  _sFilterMonth: string;
  _filterMonthList = [];
  _filterYearList = [];

  _isLoadingKRACompanySettings = true;
  _isLoadingSwotScales = true;
  _isLoadingSwotYears = true;

  private readonly onDestroy = new Subject<void>();

  constructor (public _kraService: KraService,
    public _authService: AuthService,
    private _router: Router,
    private _loaderService: LoaderService,
    private _SWOTAnalysisService: SWOTAnalysisService,
    public platform: Platform) { }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._authService.hideAppPanel(true);
    this._personalSWOTAnalysis = this._SWOTAnalysisService._SWOTAnalysisManual;
    this._kraCompanySettings = this._kraService._kraCompanySettings;
    this._filterYearList = this._SWOTAnalysisService._SWOTYears;

    if (!this._kraCompanySettings) {
      this._kraService.getKraCompanySettings()
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.setKRACompanySettings();
        });
    } else {
      this.setKRACompanySettings();
    }

    this._SWOTAnalysisService.getSWOTAnalysisScales()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.setSWOTAnalysisScales();
      });

    if (this._filterYearList.length === 0) {
      this._SWOTAnalysisService.getSWOTAnalyisYears()
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.setSWOTYears();
        });
    } else {
      this.setSWOTYears();
    }
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  checkLoaderAllClear() {
    let toReturn = true;

    if (this._isLoadingKRACompanySettings) {
      toReturn = false;
    }
    if (this._isLoadingSwotScales) {
      toReturn = false;
    }
    if (this._isLoadingSwotYears) {
      toReturn = false;
    }

    if (toReturn === true) {
      this._isLoading = false;
      this._loaderService.exitLoader();
    }
  }

  setKRACompanySettings() {
    this._kraCompanySettings = this._kraService._kraCompanySettings;
    this._isLoadingKRACompanySettings = false;
    this.checkLoaderAllClear();
  }

  setSWOTAnalysisScales() {
    this._SWOTAnalysisScale = this._SWOTAnalysisService._swotAnalysisScales;
    this._isLoadingSwotScales = false;
    this.checkLoaderAllClear();
  }

  setSWOTYears() {
    this._filterYearList = this._SWOTAnalysisService._SWOTYears;

    if (this._SWOTAnalysisService._SWOTYears.length > 0) {
      this._filterYear = this._SWOTAnalysisService._SWOTYears[0]['iYear'];
    } else {
      this._filterYear = '';
    }

    if (this._filterYear) {
      this._SWOTAnalysisService.getSWOTAnalysisMonths(this._filterYear)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.setSWOTMonths();
        });
    }
    this._isLoadingSwotYears = false;
    this.checkLoaderAllClear();
  }

  setSWOTMonths() {
    this._filterMonthList = this._SWOTAnalysisService._SWOTMonths;
    this._filterMonth = this._SWOTAnalysisService._SWOTMonths[0]['iMonth'];
    this._sFilterMonth = this.getMonthString(this._filterMonth - 1);
    this._filterMonthList.forEach(month => {
      month['sMonth'] = this.getMonthString(month.iMonth - 1);
    });

    this._SWOTAnalysisService.getPersonalSWOTAnalysisManual(
      this._filterYear, this._filterMonth)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.setPersonalSWOTAnalysis();
      });
  }

  getMonthString(iMonth) {
    const months = [
      'January', 'February', 'March',
      'April', 'May', 'June',
      'July', 'August', 'September',
      'October', 'November', 'December'
    ];

    if (iMonth > -1) {
      return months[iMonth];
    } else {
      return 'All';
    }
  }

  editSWOTAnalysis() {
    this._bViewMode = false;
  }

  setPersonalSWOTAnalysis() {
    this._personalSWOTAnalysis = this._SWOTAnalysisService._SWOTAnalysisManual;

    if (this.isEmpty(this._SWOTAnalysisService._SWOTAnalysisManual)) {
      this._SWOTAnalysisService._SWOTAnalysisManual = new SWOTAnalysisManual();
      this._SWOTAnalysisService._SWOTAnalysisManual.SWOTAnalysisManualObjectivesUID = '';
      this._SWOTAnalysisService._SWOTAnalysisManual.sSWOT3monthsManualObjectiveComment = '';
      this._SWOTAnalysisService._SWOTAnalysisManual.sSWOT6monthsManualObjectiveComment = '';
      this._SWOTAnalysisService._SWOTAnalysisManual.sSWOT12monthsManualObjectiveComment = '';
      this._SWOTAnalysisService._SWOTAnalysisManual.sSWOT2to3YearsManualObjectiveComment = '';
      this._personalSWOTAnalysis = this._SWOTAnalysisService._SWOTAnalysisManual;
    }

    this._pageGO = true;
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

  removeSWOTAnalysis(swotIndex, scaleName, analysis) {
    const that = this;
    Swal.fire({
      title: 'Remove ' + scaleName,
      text: 'Are you sure you want to remove this ' + scaleName + ' ?',
      icon: 'warning',
      showCancelButton: true,
      heightAuto: false,
      confirmButtonColor: 'var(--primary)',
      cancelButtonColor: 'var(--danger)',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then(function (dismiss) {
      if (dismiss.value === true) {
        if (analysis['SWOTAnalysisUID'] !== '') {
          that._removedSWOTAnalysisItems.push({
            'SWOTAnalysisUID': analysis['SWOTAnalysisUID']
          });
        }
        that._personalSWOTAnalysis.SWOT.splice(swotIndex, 1);
      }
    }).catch();
  }

  addSWOTAnalysis(scale) {
    const personalSWOT = new SWOTArray();
    personalSWOT.SWOTAnalysisUID = '';
    personalSWOT.SWOTscaleUID = scale['SWOTscaleUID'];
    personalSWOT.ScaleName = scale['sName'];
    personalSWOT.sSWOTAnalysis = '';
    this._personalSWOTAnalysis.SWOT.push(personalSWOT);
  }

  saveSWOTAnalysisManual() {
    let sMessage = '';
    if (this._SWOTAnalysisService._SWOTAnalysisManual.sSWOT3monthsManualObjectiveComment === '') {
      sMessage = sMessage + 'Please identify your 3 months objectives<br>';
    }
    if (this._SWOTAnalysisService._SWOTAnalysisManual.sSWOT6monthsManualObjectiveComment === '') {
      sMessage = sMessage + 'Please identify your 6 months objectives<br>';
    }
    if (this._SWOTAnalysisService._SWOTAnalysisManual.sSWOT12monthsManualObjectiveComment === '') {
      sMessage = sMessage + 'Please identify your 12 months objectives<br>';
    }
    if (this._SWOTAnalysisService._SWOTAnalysisManual.sSWOT2to3YearsManualObjectiveComment === '') {
      sMessage = sMessage + 'Please identify your 2-3 year objectives<br>';
    }
    if (this._SWOTAnalysisService._SWOTAnalysisManual['SWOT'].length === 0) {
      sMessage = sMessage + 'Please add at least 1 Strength, Weakness, Opportunity, or Threat';
    }

    if (sMessage !== '') {
      Swal.fire({
        title: '',
        html: sMessage,
        icon: 'warning',
        confirmButtonColor: 'var(--primary)',
        heightAuto: false
      });
    } else {
      this._loaderService.initLoader(true);
      this._SWOTAnalysisService.saveSWOTAnalysisManual(this._removedSWOTAnalysisItems,
        this._filterYear, this._filterMonth)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this._router.navigate(['grow'], { replaceUrl: true });
        });
    }
  }

  goGrowPage() {
    this._router.navigate(['grow'], { replaceUrl: true });
  }

}
