import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { AuthService, KraService, LoaderService } from '../../../../_services';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PrintToolContent } from '../../print-tool';

@Component({
  selector: 'app-pt-layout-performance-agreements',
  templateUrl: './pt-layout-performance-agreements.component.html',
  styleUrls: ['./pt-layout-performance-agreements.component.scss']
})
export class LayoutPerformanceAgreementsComponent implements OnInit, OnDestroy {

  @Input() _coverData = {};
  @Input() _contentData: PrintToolContent;
  @Output() backHandler: EventEmitter<any> = new EventEmitter<any>();

  _navStatus = '';

  sectionA = 1;
  sectionB = 2;
  sectionC = 3;
  sectionD = 4;

  private readonly onDestroy = new Subject<void>();

  constructor (
    public _authService: AuthService,
    private kraService: KraService,
    private _loaderService: LoaderService

  ) {
  }

  ngOnInit() {
    this._navStatus = this._authService['_verticalNavType'];
    if (this._contentData['pdpData'] && this._contentData['pdpData'].length === 0) {
      this.sectionD = 3;
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
    this.kraService.printKRAPerformanceAgreementPDFProfile(this._contentData['personalDetails']['sEmployeeUUID'],
      this._contentData['personalDetails']['kraHrURPRoleUID'])
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._loaderService.exitLoader();
      });
  }
}
