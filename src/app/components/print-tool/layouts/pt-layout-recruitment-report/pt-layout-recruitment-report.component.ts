import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AuthService, RecruitmentService, LoaderService } from '../../../../_services/index';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PrintToolContent } from '../../print-tool';

@Component({
  selector: 'app-pt-layout-recruitment-report',
  templateUrl: './pt-layout-recruitment-report.component.html',
  styleUrls: ['./pt-layout-recruitment-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LayoutRecruitmentReportsComponent implements OnInit, OnDestroy {

  @Input() _coverData = {};
  @Input() _contentData: PrintToolContent;
  @Input() bShowFullScreen = false;
  @Output() backHandler: EventEmitter<any> = new EventEmitter<any>();

  _navStatus = '';
  bShowPercentage = true;
  numAssessors = 1;
  competencylegend = [];

  private readonly onDestroy = new Subject<void>();

  constructor (
    public _authService: AuthService,
    public _recruitmentService: RecruitmentService,
    private _loaderService: LoaderService
  ) {
  }

  ngOnInit() {
    this._navStatus = this._authService['_verticalNavType'];
    this.bShowPercentage = this._contentData['details']['sScoreDisplayType'] === 'Percentage';
    this.numAssessors = this._contentData['details']['numAssessors'];
    this.competencylegend = this._contentData['competencylegend']
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  goBack(): void {
    this.backHandler.emit();
  }

  printPDFReport(): void {
    this._loaderService.initLoader(true);
    this._recruitmentService.printRecruitmentReport(this._contentData['details'])
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._loaderService.exitLoader();
      });
  }
}
