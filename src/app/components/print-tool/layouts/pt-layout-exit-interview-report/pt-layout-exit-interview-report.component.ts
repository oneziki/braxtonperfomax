import { Component, OnInit, Input, ViewEncapsulation, EventEmitter, Output, OnDestroy } from '@angular/core';
import { AuthService, ExitInterviewService, LoaderService } from '../../../../_services/index';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PrintToolContent } from '../../print-tool';


@Component({
  selector: 'app-pt-layout-exit-interview-report',
  templateUrl: './pt-layout-exit-interview-report.component.html',
  styleUrls: ['./pt-layout-exit-interview-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LayoutExitInterviewReportsComponent implements OnInit, OnDestroy {

  @Input() _coverData = {};
  @Input() _contentData: PrintToolContent;
  @Output() backHandler: EventEmitter<any> = new EventEmitter<any>();

  numAssessors = 1;
  _navStatus = '';
  bShowPercentage = true;

  private readonly onDestroy = new Subject<void>();

  constructor (
    public _authService: AuthService,
    private _exitInterviewService: ExitInterviewService,
    private _loaderService: LoaderService
  ) {}

  ngOnInit() {
    this._navStatus = this._authService['_verticalNavType'];
    this.numAssessors = this._contentData['details'][0]['numAssessors'];
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
      exitInterviewAssessmentUID: this._contentData['details'][0]['exitInterviewAssessmentUID'],
      assesseeUUID: this._contentData['details'][0]['assesseeUUID'],
      compAssessorTypeUID: this._contentData['details'][0]['compAssessorTypeUID'],
      assessorUUID: this._contentData['details'][0]['assessorUUID']
    };

    this._exitInterviewService.printExitInterviewAssessmentReport(assessee)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._loaderService.exitLoader();
      });
  }

}
