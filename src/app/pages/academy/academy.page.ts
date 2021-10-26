import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Resource } from '../../_models/index';
import { AuthService, ResourcesService, LoaderService } from '../../_services/index';
import { ModalController } from '@ionic/angular';
import { AcademyModalPage } from './academy-modal/academy-modal';

@Component({
  selector: 'app-academy',
  templateUrl: './academy.page.html',
  styleUrls: ['./academy.page.scss',
    '../../../theme/fontawesome-free/css/fontawesome.css'],
  encapsulation: ViewEncapsulation.None
})
export class AcademyPage implements OnInit, OnDestroy {

  _academies: Resource[];
  _sCompanyResourceDescription: string;

  _searchText = '';
  _currentFilter = '';

  private readonly onDestroy = new Subject<void>();

  constructor (
    public _authService: AuthService,
    private _resourcesService: ResourcesService,
    public _loaderService: LoaderService,
    public modalController: ModalController,
    private _router: Router
  ) { }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._authService.hideAppPanel(true);
    this._academies = this._resourcesService._resources;

    if (this._resourcesService._academies.length === 0) {
      this._resourcesService.getResources().pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.resourceUpdate();
        });
    } else {
      this.resourceUpdate();
    }
  }


  ngOnDestroy() {
    this.onDestroy.next();
  }

  resourceUpdate() {
    this._academies = this._resourcesService._resources;
    this._sCompanyResourceDescription = this._resourcesService._sCompanyResourceDescription;
    this._loaderService.exitLoader();
  }

  trackAcademyActivity(resUpload: object, sSubCategoryName: string) {
    resUpload['sSubCategoryName'] = sSubCategoryName;
    this._resourcesService.trackAcademyActivity(resUpload).pipe(takeUntil(this.onDestroy))
      .subscribe(v => { });
  }

  async open(resUpload) {
    const modal = await this.modalController.create({
      component: AcademyModalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'resUpload': resUpload,
      }
    });

    modal.onDidDismiss()
      .then((data) => {
      });

    return await modal.present();
  }

  goBack(value) {
    if (value === '') {
      this._router.navigate(['home'], { replaceUrl: true });
    } else {
      this._currentFilter = '';
    }
  }


}
