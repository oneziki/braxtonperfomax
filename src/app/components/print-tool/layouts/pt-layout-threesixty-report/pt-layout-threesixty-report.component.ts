import { Component, OnInit, Input, ViewEncapsulation, EventEmitter, Output, OnDestroy } from '@angular/core';
import { AuthService, ThreeSixtyService, LoaderService } from '../../../../_services';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PrintToolContent } from '../../print-tool';


@Component({
  selector: 'app-pt-layout-threesixty-report',
  templateUrl: './pt-layout-threesixty-report.component.html',
  styleUrls: ['./pt-layout-threesixty-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LayoutThreesixtyReportsComponent implements OnInit, OnDestroy {

  @Input() _coverData = {};
  @Input() _contentData: PrintToolContent;
  @Output() backHandler: EventEmitter<any> = new EventEmitter<any>();

  numAssessors = 1;
  _navStatus = '';
  bShowPercentage = true;
  iMaxValue = 5;
  progressCols = [1, 2, 3, 4, 5];

  private readonly onDestroy = new Subject<void>();

  constructor (
    public _authService: AuthService,
    private _threeSixtyService: ThreeSixtyService,
    private _loaderService: LoaderService

  ) {
  }

  ngOnInit() {
    this._navStatus = this._authService['_verticalNavType'];
    this.numAssessors = this._contentData['details'][0]['numAssessors'];

    this.iMaxValue = this._contentData['iMaxScore'];

    if (this._contentData['details'][0]['sScoreDisplayType'] === 'avg_actuals') {
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
    const assessee = {
      compAssessmentUID: this._contentData['details'][0]['compAssessmentUID'],
      assesseeUUID: this._contentData['details'][0]['assesseeUUID'],
      compAssessorTypeUID: this._contentData['details'][0]['compAssessorTypeUID'],
      assessorUUID: this._contentData['details'][0]['assessorUUID']
    };

    this._threeSixtyService.printThreeSixtyReport(assessee)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._loaderService.exitLoader();
        // do nothing - pdf open in new tab from service call
      });
  }

}
