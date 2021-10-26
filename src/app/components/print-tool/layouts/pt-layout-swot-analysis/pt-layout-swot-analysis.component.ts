import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewEncapsulation } from '@angular/core';
import { AuthService, SWOTAnalysisService, LoaderService } from '../../../../_services/index';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PrintToolContent } from '../../print-tool';

@Component({
  selector: 'app-pt-layout-swot-analysis',
  templateUrl: './pt-layout-swot-analysis.component.html',
  styleUrls: ['./pt-layout-swot-analysis.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LayoutSwotReportComponent implements OnInit, OnDestroy {

  @Input() _coverData = {};
  @Input() _contentData: PrintToolContent;
  @Output() backHandler: EventEmitter<any> = new EventEmitter<any>();

  _navStatus = '';
  sEmployeeFullName = '';
  userUUID = '';
  iMonth = '';
  iYear = '';
  sWOTAnalysisManualObjectivesUID = '';

  private readonly onDestroy = new Subject<void>();


  constructor (
    public _authService: AuthService,
    public _sWOTAnalysisService: SWOTAnalysisService,
    private _loaderService: LoaderService
  ) {
  }

  ngOnInit() {
    this._navStatus = this._authService['_verticalNavType'];
    if (this._contentData) {
      this.sEmployeeFullName = this._contentData['PersonalDetails']['sEmployeeFullName'];
      this.userUUID = this._contentData['PersonalDetails']['UserUUID'];
      this.iMonth = this._contentData['SWOTAnalysis']['iMonth'];
      this.iYear = this._contentData['SWOTAnalysis']['iYear'];
      this.sWOTAnalysisManualObjectivesUID = this._contentData['SWOTAnalysis']['SWOTAnalysisManualObjectivesUID'];
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
    this._sWOTAnalysisService.printSWOTAnalysisReport(
      this.sEmployeeFullName, this.userUUID, this.iMonth, this.iYear, this.sWOTAnalysisManualObjectivesUID)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._loaderService.exitLoader();
      });
  }
}
