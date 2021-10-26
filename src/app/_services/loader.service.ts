import { Injectable, EventEmitter } from '@angular/core';


@Injectable()
export class LoaderService  {

  _loaderChanged = new EventEmitter();

  _loaderOptions = {
    isClear: true,
    isLoading: false,
    isOpac: false
  };

  _debugger = false;

  constructor() {}

  //////////////////
  // LOADER
  //////////////////

  // SERVICE FUNCTION
  initLoader(hasOpac: boolean = false) {
    this._loaderOptions = {
      isClear: false,
      isLoading: true,
      isOpac: hasOpac
    };
    
    if (this._debugger) {
      console.log('initLoading()', this._loaderOptions);
    }
    this._loaderChanged.emit();
  }
  exitLoader() {
    this._loaderOptions.isLoading = false;
    if (this._debugger) {
      console.log('exitLoader()', this._loaderOptions);
    }
    this.preEmit();
  }
  preEmit() {
    this.checkIsClear();
    setTimeout(() => {
      this._loaderChanged.emit();
    }, 500);
  }

  // IS CLEAR
  checkIsClear() {
    if (this._loaderOptions.isLoading) {
      this._loaderOptions.isClear = false;
    } else {
      this._loaderOptions.isClear = true;
    }
  }

  // LOADER FUNCTIONS
  loaderTrue() {
    this._loaderOptions.isLoading = true;
    if (this._debugger) {
      console.log('loaderTrue()', this._loaderOptions);
    }
    this.preEmit();
  }

  loaderFalse() {
    this._loaderOptions.isLoading = false;
    this.preEmit();
  }

  loaderToggle() {
    this._loaderOptions.isLoading = !this._loaderOptions.isLoading;
    this.preEmit();
  }

}
