/* eslint-disable space-before-function-paren */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-underscore-dangle */
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
  Inject,
  AfterViewInit,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppSettings, CompanyTemplate } from '../../_models/index';
import {
  AuthService,
  LoaderService,
  StorageService,
  NotificationService,
} from '../../_services/index';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { AuthenticationResult, EventMessage, EventType, InteractionStatus, InteractionType, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { HttpClient } from '@angular/common/http';

import * as t from 'apexcharts';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, AfterViewInit, OnDestroy {
  loginStatus = '';
  passwordStatus = '';
  _companyTemplate: CompanyTemplate;

  _signInSubmitButton = {
    disabled: false,
    text: 'Sign in',
  };

  sAzureEmail = '';
  sErrorMessage = '';
  bErrorMessage = false;
  _envTheme = {};

  public _form: NgForm;

  private readonly onDestroy = new Subject<void>();
  private themeSubscription: Subscription;
  private subscription1: Subscription;
  private _urlType = '';

  constructor (
    private router: Router,
    public _authService: AuthService,
    private _loaderService: LoaderService,
    public _notifcationService: NotificationService,
    private msalService: MsalService, private httpClient: HttpClient,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private storage: StorageService
  ) {
    this.themeSubscription = this._authService._envThemeChanged.subscribe(
      (value) => this.setEnvTheme()
    );
  }

  ngOnInit() {
    this._loaderService.initLoader();
    this._authService.logout();
    this._envTheme = this._authService['_envTheme'];
    
    // Setting Dummy Data ;
    // this.storage.set('TEST KEY', 'TEST VALUE');

    // Dummy Call;
    // const testCall = this.storage.get('TEST KEY').then(data => {
    // console.log(data);
    // });

    // console.log(this.storage.get('TEST KEY'));

    // setTimeout(() => {
    // this component is accessed from email links and we redirect from here
    // to other components/modules
    // token is the variable attached to the url and value of token will always be encrypted
    if (this.router['rawUrlTree'].queryParams.token !== undefined) {
      // replacing values within string
      let tokens = this.router['rawUrlTree'].queryParams.token;
      const re1 = /\ /gi;
      tokens = tokens.replace(re1, '+');
      const re2 = /\%3D/gi;
      tokens = tokens.replace(re2, '=');
      // decrypt the link
      const urlString = AppSettings.getDecryptedValues(tokens);
      // get array of url items
      const arrUrl = urlString.split('=');
      if (arrUrl.length > 1) {
        const arrUrlItems = arrUrl[1].split('|');
        this._urlType =
          arrUrlItems.length > 0 ? arrUrlItems[0].split('_')[1] : '';
        let UserID = arrUrlItems.length > 0 ? arrUrlItems[1].split('_')[1] : '';
        // handling esurvey and threesixty emails
        if (this._urlType === 'resetPassword') {
          UserID = arrUrl[2];
          this.router.navigate(['/password-manager/reset-password']);
        }
      }
    } else {
      if (
        !this._authService['_fetchingTheme'] &&
        this._authService['_envTheme']
      ) {
        this._loaderService.exitLoader();
      }

      // normal login process
      // const historyUser = this._authService.getUser();
      // if (historyUser && historyUser['type'] === '_sessionUser') {
      //   if (localStorage.getItem('loginUser') && localStorage.getItem('sessionUser')) {
      //     // this.router.navigate(['/lock-out']);
      //     this.router.navigate(['/login']);
      //   }
      //   if (localStorage.getItem('rememberUser') && localStorage.getItem('sessionUser')) {
      //     // this.router.navigate(['/lock-out']);
      //     this.router.navigate(['/login']);
      //   }
      // }
    }
    // }, 1500);
  }

  ngAfterViewInit() {
    const options = {
      series: [],
      chart: {
        height: 390,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: '25%',
            background: 'transparent',
            image: undefined,
          },
          dataLabels: {
            name: {
              show: true,
            },
            value: {
              show: true,
            },
          },
        },
      },
      colors: [],
      labels: [],
      legend: {
        show: false,
        floating: true,
        fontSize: '16px',
        position: 'left',
        offsetX: 50,
        offsetY: 10,
        labels: {
          useSeriesColors: true,
        },
        itemMargin: {
          horizontal: 3,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              show: false,
            },
          },
        },
      ],
    };

    const ApexCharts = t['default'];
    const chartElement = document.querySelector('#chart');
    const chart = new ApexCharts(chartElement, options);
    // chart.render();
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
    this.onDestroy.next();
  }

  setEnvTheme() {
    this._envTheme = this._authService['_envTheme'];
    this._loaderService.exitLoader();
  }

  authUpdate(response) {
    if (response) {
      this._signInSubmitButton.text = 'Sign in';
      this._signInSubmitButton.disabled = false;

      this.loginStatus = response['status'];
      this.passwordStatus = response['passwordStatus'];
      this._companyTemplate = response['companytemplate'];

      if (
        this._companyTemplate &&
        this._companyTemplate.bActivatePasswordExpiry
      ) {
        if (this.passwordStatus === 'Not Expired' || !this.passwordStatus) {
          if (this.loginStatus === 'Success') {
            this._notifcationService.setModuleMenu();
            this._authService.toggleAppMenu('home');
          } else if (this.loginStatus === 'First Login') {
            this._authService._linkUserUID = response.P6_userUID;
            this.router.navigate(['/password-manager/reset-password']);
          } else {
            this.loginStatus = 'Failure';
          }
        } else {
          this.passwordStatus = 'Expired';
          this.loginStatus = 'Failure';
        }
      } else {
        this.passwordStatus = '';
        if (this.loginStatus === 'Success') {
          this._notifcationService.setModuleMenu();
          this._authService.toggleAppMenu('home');
        } else if (this.loginStatus === 'First Login') {
          this._authService._linkUserUID = response.P6_userUID;
          this.router.navigate(['/password-manager/reset-password']);
        } else {
          this.loginStatus = 'Failure';
        }
      }

    }
  }

  loginAzure() {
    if (this.msalService.instance.getActiveAccount() != null) {
      this.sAzureEmail = this.msalService.instance.getActiveAccount().username;
      this.submitloginAzure(this.sAzureEmail);
    } else {
      this.msalService.loginPopup().subscribe((response: AuthenticationResult) => {
        this.msalService.instance.setActiveAccount(response.account);
        if (this.msalService.instance.getActiveAccount() != null) {
          this.sAzureEmail = response.account['username'];
          this.submitloginAzure(this.sAzureEmail);
        }
      });
    }
  }

  async submitloginAzure(sAzureEmail) {
    this._loaderService.initLoader(true);
    this._notifcationService.resetModuleStatesAndNotifications();
    const data = await this._authService.login('', '', false, sAzureEmail);
    
    if (data) {
      this.authUpdate(data);
      this._authService['_bIsAzureLogin'] = true;
      this.bErrorMessage = false;
    } else {
      this.bErrorMessage = true;
      this.sErrorMessage = '*Invalid Microsoft Email';
      this._loaderService.exitLoader();
    }
  }

  async submitLogin(form: NgForm) {
    this._loaderService.initLoader(true);
    this._notifcationService.resetModuleStatesAndNotifications();
    
    const data = await this._authService.login(form['username'], form['password'], form['remember'], '');
    // const data = await this._authService.login(
    // '534_dev',
    // 'h.visagie_dev',
    // '572_dev',
    // '989_dev',
    // '00741_dev', 
    // 'password',
    // form['remember'], 
    // ''
    // );

    if (data) {
      this.authUpdate(data);
      this.bErrorMessage = false;
      this._authService['_bIsAzureLogin'] = false;
    } else {
      this.bErrorMessage = true;
      this.sErrorMessage = '*Invalid Username/Password';
      this._loaderService.exitLoader();
    }
  }
}
