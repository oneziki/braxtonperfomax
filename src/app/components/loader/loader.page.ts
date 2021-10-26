import { Component, OnDestroy } from '@angular/core';

// Braxton Code //
import { LoaderService } from '../../_services/index';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.page.html',
  styleUrls: ['./loader.page.scss'],
})
export class LoaderPage implements OnDestroy {
  private _loaderSub: Subscription;
  private ngUnsubscribe: Subject<any> = new Subject<any>();

  public isLoaderVisible = true;
  public isLoaderOpac = false;

  constructor(
    private _loaderService: LoaderService
  ) {
    
    const _loaderSub = this._loaderService._loaderChanged.subscribe(value =>
      this.setLoader()
      );
  }

  ngOnInit() {
  }
    
  setLoader() {
    this.isLoaderOpac = this._loaderService._loaderOptions['isOpac'];
    this.isLoaderVisible = this._loaderService._loaderOptions['isLoading'];
  }

  ngOnDestroy(): void {
    this.isLoaderVisible = false;
  }
}
