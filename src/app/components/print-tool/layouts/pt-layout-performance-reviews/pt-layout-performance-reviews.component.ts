import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { AuthService, KraService, LoaderService } from '../../../../_services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PrintToolContent } from '../../print-tool';

@Component({
  selector: 'app-pt-layout-performance-reviews',
  templateUrl: './pt-layout-performance-reviews.component.html',
  styleUrls: ['./pt-layout-performance-reviews.component.scss']
})
export class LayoutPerformanceReviewsComponent implements OnInit, OnDestroy {

  @Input() _coverData = {};
  @Input() _contentData: PrintToolContent;
  @Output() backHandler: EventEmitter<any> = new EventEmitter<any>();

  _navStatus = '';
  userUID = '';
  iMaxValue = 5;
  progressCols = [1, 2, 3, 4, 5];

  // sectionA = 1;
  sectionB = 1;
  sectionC = 2;
  sectionD = 3;
  sectionE = 4;
  sectionF = 5;

  private readonly onDestroy = new Subject<void>();

  constructor (
    public _authService: AuthService,
    private kraService: KraService,
    private _loaderService: LoaderService,
  ) {
  }

  ngOnInit() {
    this._navStatus = this._authService['_verticalNavType'];
    this.userUID = this._contentData['pdfData']['userPersonalDetails']['userUUID'];

    if (this._contentData['pdfData']['kraOverall'].length === 0) {
      this.sectionC = 2;
      this.sectionD = 3;
      this.sectionE = 4;
      this.sectionF = 5;
    }

    if (!this._contentData['pdfData']['compProfile']) {
      this.sectionE = 3;
      this.sectionF = 4;
    }
    if (this._contentData['pdfData']['settings']['sShowOverallScoreAsPercentage'] !== 'Percentage') {
      this.iMaxValue = this._contentData['iMaxValue'];
    } else {
      this.iMaxValue = this._contentData['pdfData']['kraLegend'].length;
    }
    if (this._contentData['pdfData']['settings']['sShowOverallScoreAsPercentage'] !== 'Percentage') {
      this.progressCols = Array(this.iMaxValue).fill(this.iMaxValue).map((x, i) => (i + 1));
    } else {
      this.progressCols = Array(this.iMaxValue).fill(this.iMaxValue).map((x, i) => ((i + 1) / this.iMaxValue) * 100);
    }
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  goBack(): void {
    this.backHandler.emit();
  }

  printPDFReport(): void {
    this._loaderService.initLoader(true);
    this.kraService.printReviewPDFData(this._contentData['pdfData']['userPersonalDetails']['userUUID'],
      this._contentData['pdfData']['kraProfile'][0]['kraHrURPRoleUID'],
      this._contentData['pdfData']['userPersonalDetails']['dMonthScoredFor'],
      this._contentData['bScoreInDraft'])
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._loaderService.exitLoader();
      });
  }

  getWidth(iValue) {
    return ((iValue / this.iMaxValue) * 100) + '%';
  }
}
