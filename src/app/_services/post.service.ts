/* eslint-disable space-before-function-paren */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-underscore-dangle */
import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { StorageService } from './storage.service';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { AppSettings } from '../_models/index';
import { catchError, map, tap } from 'rxjs/operators';
import { MessengerService } from './messengerservice.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};


@Injectable()
export class PostService implements OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  networkInfo = navigator;

  constructor (private _http: HttpClient,
    private _mService: MessengerService,
    private storage: StorageService) {
    window.addEventListener('online', () => this.networkChanged('Online'));
    window.addEventListener('offline', () => this.networkChanged('Offline'));
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // Logic For storing Data or getting data from storage
  async postData(functionName, bodyString, postType): Promise<any> {
    // Network is online
    if (this.networkInfo.onLine) {
      return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
        map((result: any) => {
          const data = JSON.parse(JSON.stringify(result));
          // Store data with functionName
          this.storeData(functionName, data);
          return data;
        }),
        tap(_ => this._mService.handleTap(this.constructor.name, functionName, bodyString)),
        catchError(this._mService.handleError<any>(this.constructor.name, functionName))
      ).toPromise();
    } else {
      // Network is offline
      // If trying to submit store the post request and rerun post when we back online
      if (postType = 'submit') {
        await this.storePost(bodyString);
        return true;
      } else {
        // If getting data we check if we have a stored key with the function name and return that as the data;
        let result = await this.getData(functionName);
        return result;
      }
    }
  }

  // Rerun failed posts when network is back online
  async networkChanged(networkStatus) {
    if (networkStatus === 'Offline') return;
    // Check if network is still online and make sure that the connection is stable by using a timeout
    if (!this.networkInfo.onLine) return;

    // Fetch stored array
    let postArray = await this.storage.get('submitPostsArray');
    // If there is none then return as there is no posts to rerun
    if (postArray === null) return;

    // loop through posts and rerun them
    for (let i = 0; i < postArray.length; i++) {
      const post = postArray[i];
      const bodystring = JSON.stringify(post);
      await this.postRequest(bodystring, post['sFunction']);
    }
    this.storage.remove('submitPostsArray');
  }

  // Post Request function
  async postRequest(bodystring, functionName) {
    return this._http.post(AppSettings.API_ENDPOINT, bodystring, httpOptions).pipe(
      map((result: any) => {
        const data = JSON.parse(JSON.stringify(result));
        return data;
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, functionName, bodystring)),
      catchError(this._mService.handleError<any>(this.constructor.name, functionName))
    ).toPromise();
  }

  // Set data in BraxtonDB
  storeData(key: string, value: any) {
    this.storage.set(key, value);
  }

  // Get data in BraxtonDB
  async getData(functionName): Promise<any> {
    let result = await this.storage.get(functionName);
    return result
  }

  // Set POST ON FAIL SUBMIT
  async storePost(bodyString): Promise<any> {
    let postArray = await this.storage.get('submitPostsArray');
    if (postArray === null) {
      postArray = [];
    }

    // Parse Object so that we able to store it in an array
    const stringifybodyString = JSON.parse(bodyString);

    // Remove duplicate function and add latest one
    postArray = postArray.filter(item => item.sFunction !== stringifybodyString.sFunction);
    // Push Object into array
    postArray.push(stringifybodyString);
    // Push stringify array to store data
    const restringifiedData = JSON.parse(JSON.stringify(postArray));
    // Add new array
    this.storeData('submitPostsArray', restringifiedData);
    return true;
  }


}
