import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { KraCompanySettings, SessionUser, ThreeSixtyAssessment } from '../../../../../_models/index';
import {
  AuthService,
  KraPdpService, KraService, LoaderService, ThreeSixtyService, EmployeeDirectoryService
} from '../../../../../_services/index';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListPage implements OnInit, OnDestroy {

  _sessionUser: SessionUser;
  _threeSixty_assessments: ThreeSixtyAssessment[] = [];
  _all_threeSixty_assessments: ThreeSixtyAssessment[] = [];
  _kraCompanySettings: KraCompanySettings;
  _CategoryNames = [];
  _bManager = false;
  // _filterYearList = ['All'];
  // _filterYear = '';

  private readonly onDestroy = new Subject<void>();

  constructor (public _authService: AuthService,
    private _threeSixtyService: ThreeSixtyService,
    private _loaderService: LoaderService,
    public _kraService: KraService,
    private _kraPDPService: KraPdpService,
    private _router: Router,
    private _employeeDirectoryService: EmployeeDirectoryService) { }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._authService.hideAppPanel(true);
    this._sessionUser = this._authService._sessionUser;
    this._kraCompanySettings = this._kraService._kraCompanySettings;
    this._threeSixtyService._reportData = {};
    this._all_threeSixty_assessments = this._threeSixtyService._threeSixty_assessments;

    if ('P6_userUID' in this._employeeDirectoryService._performUser && this._sessionUser['P6_userUID'] !== this._employeeDirectoryService._performUser['P6_userUID']) {
      this._bManager = true;
    }

    if (this._bManager) {
      this._router.navigate(['grow/pdp/integrated/design'], { replaceUrl: true });
    }

    if (this._all_threeSixty_assessments.length === 0) {
      this._threeSixtyService.getThreeSixtyAssessmentsForUser(this._sessionUser.P5Corp_userUID)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.updateAssessmentsChanged();
        });
    } else {
      this.updateAssessmentsChanged();
    }
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  // assessmentFilterChange(year) {
  //   this._filterYear = year;
  // }

  updateAssessmentsChanged() {
    this._all_threeSixty_assessments = this._threeSixtyService._threeSixty_assessments;

    const tempCapture = [];

    this._all_threeSixty_assessments.forEach(ts => {
      if (tempCapture.indexOf(ts['sAssessmentName']) === -1 && ts['sAssessorTypeDescription'] === 'Self'
        && Number(ts['bIsComplete']) === 1) {
        if (this._CategoryNames.indexOf(ts['sCategoryName']) === -1 && ts['sCategoryName'] !== '') {
          this._CategoryNames.push(ts['sCategoryName']);
        }
        this._threeSixty_assessments.push(ts);
        // this._filterYearList.push(ts['sAssessmentYear']);
        tempCapture.push(ts['sAssessmentName']);

      }
    });

    // this._filterYear = this._filterYearList[0];
    this._loaderService.exitLoader();
  }

  goAssessmentPage(assessment: ThreeSixtyAssessment) {
    this._threeSixtyService._selectedAssessment = assessment;
    this._router.navigate(['grow/pdp/integrated/assessment'], { replaceUrl: true });
  }

  goGrowPage() {
    this._router.navigate(['grow'], { replaceUrl: true });
  }

}
