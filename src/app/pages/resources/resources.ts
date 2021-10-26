import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService, LoaderService, ResourcesService } from '../../_services/index';
import { SessionUser, CompanyTemplate } from '../../_models/index';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';;
import { Router } from '@angular/router';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.html',
  styleUrls: ['./resources.scss'],
  encapsulation: ViewEncapsulation.None
})

export class Resources implements OnInit, OnDestroy {
  _resourcesList = [];
  _companyTemplate: CompanyTemplate;
  _sessionUser: SessionUser;
  _currentFilter = '';
  _searchText = '';

  private readonly onDestroy = new Subject<void>();

  constructor(
    public _authService: AuthService,
    private _resourcesService: ResourcesService,
    public _loaderService: LoaderService,
    private _router: Router
  ) { }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._authService.hideAppPanel(true);
    this._sessionUser = this._authService._sessionUser;
    this._resourcesList = this._resourcesService._resources;
    this._companyTemplate = this._sessionUser['companytemplate'];

    if (this._resourcesList.length === 0) {
      this._resourcesService.getResources()
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.setResources()
        });
    } else {
      this.setResources();
    }
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  setResources() {
    this._resourcesList = this._resourcesService._resources;
    this._resourcesService._resources.forEach(element => {
      this._resourcesList = this._resourcesList.filter(item => item.sFlag === 'Resource P7');
    });
    this._loaderService.exitLoader();
  }

  setCurrentFilter(id) {
    if (this._currentFilter === id) {
      this._currentFilter = '';
    } else {
      this._currentFilter = id;
    }
  }

  goBack() {
    this._router.navigate(['home'], { replaceUrl: true });
  }

}
