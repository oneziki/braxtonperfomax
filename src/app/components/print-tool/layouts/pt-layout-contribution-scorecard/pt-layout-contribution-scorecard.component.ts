import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { AuthService, ContributionScorecardService, LoaderService } from '../../../../_services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PrintToolContent } from '../../print-tool';

@Component({
  selector: 'app-pt-layout-contribution-scorecard',
  templateUrl: './pt-layout-contribution-scorecard.component.html',
  styleUrls: ['./pt-layout-contribution-scorecard.component.scss']
})
export class LayoutContributionScorecardComponent implements OnInit, OnDestroy {

  @Input() _coverData = {};
  @Input() _contentData: PrintToolContent;
  @Output() backHandler: EventEmitter<any> = new EventEmitter<any>();

  _navStatus = '';
  iMaxValue = 5;
  progressCols = [1, 2, 3, 4, 5];

  private readonly onDestroy = new Subject<void>();

  constructor (
    public _authService: AuthService,
    public _contributionScorecardService: ContributionScorecardService,
    private _loaderService: LoaderService
  ) {
  }

  ngOnInit() {
    this._navStatus = this._authService['_verticalNavType'];
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  goBack(): void {
    this.backHandler.emit();
  }


  printPDFReport(): void {
    this._loaderService.initLoader(true);
    this._contributionScorecardService.printContributionScorecardPDFData(this._contentData['userDetails']['userUUID'],
      this._contentData['userDetails']['dbMonthDate'])
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._loaderService.exitLoader();
      });
  }

  getWidth(iValue) {
    return ((iValue / this.iMaxValue) * 100) + '%';
  }
}
