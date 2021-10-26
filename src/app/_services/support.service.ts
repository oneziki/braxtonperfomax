import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../_services/auth.service';
import { AppSettings, Support } from '../_models/index';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';

import { catchError, map, tap } from 'rxjs/operators';
import { MessengerService } from '../_services/messengerservice.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class SupportService implements OnDestroy {
    private ngUnsubscribe: Subject<void> = new Subject<void>();

    _supportInfo: Support[] = [];
    _selectedDepartment: Object;

    constructor(
        private _mService: MessengerService,
        private _http: HttpClient,
        public _authService: AuthService
    ) { }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    getSupportInformation() {
        const bodyString = JSON.stringify({
            'peformaxToken': AppSettings.PEFORMAX_TOKEN,
            'sModule': 'setup',
            'subModule': 'support',
            'sFunction': 'getSupportInformation',
            'P6CompanyUID': this._authService._sessionUser.P6CompanyUID
        });

        return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
            map((result: any) => {
                this._supportInfo = JSON.parse(JSON.stringify(result));
            }),
            tap(_ => this._mService.handleTap(this.constructor.name, 'getSupportInformation', bodyString)),
            catchError(this._mService.handleError<any>(this.constructor.name, 'getSupportInformation'))
        );
    }
}