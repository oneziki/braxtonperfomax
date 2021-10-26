import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AuthService, KraPdpService, LoaderService } from '../../../../_services/index';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PrintToolContent } from '../../print-tool';

@Component({
  selector: 'app-pt-layout-pdp',
  templateUrl: './pt-layout-pdp.component.html',
  styleUrls: ['./pt-layout-pdp.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LayoutPDPReportComponent implements OnInit, OnDestroy {

  @Input() _coverData = {};
  @Input() _contentData: PrintToolContent;
  @Input() bShowFullScreen = false;
  @Output() backHandler: EventEmitter<any> = new EventEmitter<any>();

  _navStatus = '';

  private readonly onDestroy = new Subject<void>();

  constructor (
    public _authService: AuthService,
    public _kraPdpService: KraPdpService,
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
    this._kraPdpService.printManualPDPReport(this._contentData['personalDetails']['kraHrURPRoleUID'],
      this._contentData['personalDetails']['sEmployeeUUID'],
      this._contentData['personalDetails']['sEmployeeName'])
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._loaderService.exitLoader();
      });
  }
}
