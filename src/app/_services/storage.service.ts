/* eslint-disable space-before-function-paren */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public _storage: Storage | null = null;

  constructor (public storage: Storage) {
    this.init();
  }

  async init() {
    if (this._storage != null) {
      return;
    }
    // await this.storage.defineDriver(CordovaSQLiteDriver);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public async set(key: string, value: any): Promise<any> {
    await this.init();
    return await this._storage?.set(key, value);
  }

  public async get(key: string): Promise<any> {
    await this.init();
    return await this._storage?.get(key);
  }

  public async remove(key: string): Promise<any> {
    await this.storage.remove(key);
  }
}