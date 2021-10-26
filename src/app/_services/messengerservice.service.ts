import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


@Injectable()
export class MessengerService {

  _debugger = false;

  constructor() { }

  /**
 * If true show user tap information
 * @param service - name of the service that made the call
 * @param operation - name of the operation that was called
 * @param descriptor - optional value give more context
 */
  public handleTap(service = 'service', operation = 'operation', descriptor = '') {
    if (this._debugger) {
      if (descriptor.length) {
        console.log(`${service} => ${operation} => `, JSON.parse(descriptor));
      } else {
        console.log(`${service} ( ${operation} )`);
      }
    }
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param service - name of the service that made the call
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  public handleError<T>(service = 'service', operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.log(`${service} error caught: ${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
