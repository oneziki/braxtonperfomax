import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, LoaderService } from '../../../_services/index';

@Component({
  selector: 'app-cookie-policy',
  templateUrl: './cookie-policy.page.html',
  styleUrls: ['./cookie-policy.page.scss'],
})
export class CookiePolicyPage implements OnInit {

  _hostName = window.location.hostname;
  _selectedAppTab = '';

  constructor (
    public _authService: AuthService,
    public _loaderService: LoaderService,
    private _router: Router
  ) { }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._authService.hideAppPanel(true);
    this._selectedAppTab = this._authService._selectedAppTab;
    this._loaderService.exitLoader();
  }

  goBack() {
    if (this._selectedAppTab === 'maintenance') {
      this._router.navigate(['home'], { replaceUrl: true });
    } else {
      this._router.navigate([this._selectedAppTab], { replaceUrl: true });
    }
  }

}
