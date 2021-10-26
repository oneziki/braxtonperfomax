import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewEncapsulation } from '@angular/core';
import { AuthService, KraPdpService, LoaderService } from '../../../../_services/index';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PrintToolContent } from '../../print-tool';

@Component({
  selector: 'app-pt-layout-integrated-pdp',
  templateUrl: './pt-layout-integrated-pdp.component.html',
  styleUrls: ['./pt-layout-integrated-pdp.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LayoutIntegratedPDPReportComponent implements OnInit, OnDestroy {

  @Input() _coverData = {};
  @Input() _contentData: PrintToolContent;
  @Input() bShowFullScreen = false;
  @Output() backHandler: EventEmitter<any> = new EventEmitter<any>();

  _navStatus = '';
  compAssessmentUID = '';
  userUUID = '';
  sEmployeeName = '';

  private readonly onDestroy = new Subject<void>();

  constructor (
    public _authService: AuthService,
    public _kraPdpService: KraPdpService,
    private _loaderService: LoaderService
  ) {
  }

  ngOnInit() {
    this._navStatus = this._authService['_verticalNavType'];
    if (this._contentData) {
      this.compAssessmentUID = this._contentData['pdpProfile']['CompAssessmentUID'];
      this.userUUID = this._contentData['pdpProfile']['userUUID'];
      this.sEmployeeName = this._contentData['personalDetails'][0]['sEmployeeName'];
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
    this._kraPdpService.printIntegratedPDPReport(this.compAssessmentUID, this.userUUID, this.sEmployeeName)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._loaderService.exitLoader();
      });
  }
}
