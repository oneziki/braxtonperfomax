import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService, SupportService, LoaderService } from '../../_services/index';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Support } from '../../_models/index';
import { Router } from '@angular/router';
@Component({
  selector: 'app-support',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SupportPage implements OnInit, OnDestroy {

  _supportInfo: Support[] = [];
  _searchText = '';

  private readonly onDestroy = new Subject<void>();

  constructor(
    public _authService: AuthService,
    private _supportService: SupportService,
    public _loaderService: LoaderService,
    private _router: Router
  ) { }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._authService.hideAppPanel(true);
    this._supportInfo = this._supportService._supportInfo;

    if (this._supportService._supportInfo && !this._supportService._supportInfo['CompanyUID']) {
      this._supportService.getSupportInformation()
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.supportUpdate();
        });
    } else {
      this.supportUpdate();
    }
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }


  supportUpdate() {
    this._supportInfo = this._supportService._supportInfo;
    this._loaderService.exitLoader();
  }

  isMatch(supportItem) {
    if (!this._searchText.length) {
      return true;
    }

    if (supportItem['sBusinessUnitName'].toLowerCase().indexOf(this._searchText.toLowerCase()) > -1) {
      return true;
    } else if (supportItem['sUnitContactPerson'].toLowerCase().indexOf(this._searchText.toLowerCase()) > -1) {
      return true;
    } else {
      return false;
    }
  }

  goBack() {
    this._router.navigate(['home'], { replaceUrl: true });
  }
}
