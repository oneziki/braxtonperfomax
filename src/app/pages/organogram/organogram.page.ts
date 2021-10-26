import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService, LoaderService, OrganogramService } from '../../_services/index';
import { ModalController } from '@ionic/angular';
import { OrganogramModalPage } from './organogram-modal/organogram-modal';
import * as $ from "jquery";
import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image';

@Component({
  selector: 'app-organogram',
  templateUrl: './organogram.page.html',
  styleUrls: ['./organogram.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrganogramPage implements OnInit, OnDestroy {
  private readonly onDestroy = new Subject<void>();
  private ngUnsubscribe: Subject<any> = new Subject<any>();

  topEmployee: any;
  _organogramTypes = [{ sOrganogramType: 'Departmental Structure' }, { sOrganogramType: 'Reporting Line Structure' }]
  _filterDateList = [];
  _filterDate = '';
  _filterType = 'Departmental Structure';
  _orgs = {};
  _listUserModal: object[] = [];
  _linkedJobTitleRolesModal = {};
  _listJobTitleModal: object[] = [];
  _errorUserImage = {};
  _structLoaded = false;
  _structPrinting = false;
  _objempty = true;
  _orgSlider = 90;

  constructor (
    public _authService: AuthService,
    public _loaderService: LoaderService,
    private _organogramService: OrganogramService,
    private modalController: ModalController,
    private _router: Router
  ) { }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._authService.hideAppPanel(true);
    this.topEmployee = this._organogramService._reportingStructure;


    if (Object.entries(this.topEmployee).length === 0) {
      this._organogramService.getBusinessUnitStructure(this._authService._sessionUser.P6_userUID,
        this._authService._sessionUser.P5Corp_userUID, 'Current')
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.reportingStructureChanged();
        });
    } else {
      this.reportingStructureChanged();
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.onDestroy.next();
  }

  printOrg() {
    this._loaderService.initLoader(true);
    this._orgSlider = 99;
    this._structPrinting = true;
    const that = this;

    setTimeout(function () {

      const el = document.getElementById('temp-printer');

      domtoimage.toPng(el).then(function (dataUrl) {
        that.sendURI(dataUrl);
      }).catch(function (error) {
          console.error('oops, something went wrong!', error);
      });

      // const el = document.getElementById('temp-printer');
      // html2canvas(el, { backgroundColor: null }).then(canvas => {
      //   that.sendURI(canvas.toDataURL('image/png'));
      // });
    }, 1000);

  }

  sendURI(htmlURI) {
    const link = document.createElement('a');
    const today = new Date();
    const d = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    link.download = d + ' - organogram';
    link.href = htmlURI;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this._structPrinting = false;
    this._loaderService.exitLoader();
  }

  switchDepartment(view) {
    let id = view['organisationTiersUUID'];
    if (this._filterType === 'Reporting Line Structure') {
      id = view['jobTitleUUID'];
    }

    if (!this._orgs[id]) {

      let baseStatus = 'default';
      if (Object.keys(this._orgs).length === 0 && view['dept'].length) {
        baseStatus = 'showDept';
      }
      if (Object.keys(this._orgs).length === 0 && !view['dept'].length && view['users'].length) {
        baseStatus = 'showUser';
      }

      this._orgs[id] = {
        status: baseStatus,
        bUsers: view['users'].length ? true : false,
        bDepts: view['dept'].length ? true : false
      };
    }

    if ((this._orgs[id]['status'] === 'default' || this._orgs[id]['status'] === 'hideDept') && this._orgs[id]['bDepts']) {
      this._orgs[id]['status'] = 'showDept';
      view['subordinates'] = view['dept'];

      if (this._orgs[id]['bUsers']) {
        view['cssClass'] = 'dept-block animated fadeIn showUser';
      } else {
        view['cssClass'] = 'dept-block animated fadeIn hideDept';
      }
      return true;
    }

    if (this._orgs[id]['status'] === 'showDept' && !this._orgs[id]['bUsers']) {
      this._orgs[id]['status'] = 'default';
      view['subordinates'] = [];

      if (this._orgs[id]['bDepts']) {
        view['cssClass'] = 'dept-block animated fadeIn showDept';
      }
      return true;
    }

    // eslint-disable-next-line max-len
    if ((this._orgs[id]['status'] === 'default' || this._orgs[id]['status'] === 'showDept') && !this._orgs[id]['bDepts'] && this._orgs[id]['bUsers']) {
      this._orgs[id]['status'] = 'showUser';
      this.setUsers(view['users']);
      this.setLinkedJobTitleRoles(view['users'], view['linkedJobTitleRoles']);
      this.setJobTitles(view['jobTitles']);
      this.OrganogramModal();

      if (this._orgs[id]['bDepts']) {
        view['cssClass'] = 'dept-block animated fadeIn hideDept';
      }
      return true;
    }

    if (this._orgs[id]['status'] === 'showDept' && this._orgs[id]['bUsers']) {
      this._orgs[id]['status'] = 'showUser';
      this.setUsers(view['users']);
      this.setLinkedJobTitleRoles(view['users'], view['linkedJobTitleRoles']);
      this.setJobTitles(view['jobTitles']);
      this.OrganogramModal();

      if (this._orgs[id]['bDepts']) {
        view['cssClass'] = 'dept-block animated fadeIn hideDept';
      }
      return true;
    }

    if (this._orgs[id]['status'] === 'showUser' && this._orgs[id]['bDepts']) {
      this._orgs[id]['status'] = 'default';
      view['subordinates'] = [];

      if (this._orgs[id]['bDepts']) {
        view['cssClass'] = 'dept-block animated fadeIn showDept';
      }
      return true;
    }

    if (this._orgs[id]['status'] === 'showUser' && !this._orgs[id]['bDepts'] && this._orgs[id]['bUsers']) {
      this.setUsers(view['users']);
      this.setLinkedJobTitleRoles(view['users'], view['linkedJobTitleRoles']);
      this.setJobTitles(view['jobTitles']);
      this.OrganogramModal();
      return true;
    }

    return false;
  }

  reportingStructureChanged() {

    this._orgs = {};
    this.topEmployee = this._organogramService._reportingStructure;

    if (this.topEmployee !== null && Object.entries(this.topEmployee).length !== 0) {
      this._objempty = false;
      setTimeout(function () {
        document.getElementById('temp-scroller').scrollLeft = ($('#temp-scroller').outerWidth() / 2.5);
      }, 0);
    } else {
      this._objempty = true;
    }

    this._structLoaded = true;
    if (this._filterDateList && this._filterDateList.length === 0) {

      this._organogramService.getFilterDate(this._authService._sessionUser.P6_userUID, this._authService._sessionUser.P5Corp_userUID)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.dateFilterChanged();
        });
    }

    this.topEmployee['status'] = 'showUser';
    this._loaderService.exitLoader();
  }

  dateFilterChanged() {
    this._filterDateList = this._organogramService._filterDates;
    this._loaderService.exitLoader();
  }

  setUsers(users) {
    this._listUserModal = users;
  }

  setLinkedJobTitleRoles(users, linkedJobTitleRoles) {
    const tmpArray = users;

    if (this._filterType === 'Departmental Structure') {

      linkedJobTitleRoles.forEach(jobTitleRole => {
        users.forEach(user => {
          if (user['designation'] === jobTitleRole['designation']) {
            jobTitleRole['iNumOfRoles']--;
          }
        });

        for (let x = 0; x < jobTitleRole['iNumOfRoles']; x++) {
          tmpArray.push(jobTitleRole);
        }

      });

      tmpArray.sort((a, b) => (a.designation > b.designation) ? 1 : -1);
    } else {

      let iNumOfRoles = 0;

      users.forEach(user => {

        linkedJobTitleRoles.forEach(jobTitleRole => {
          if (user['designation'] === jobTitleRole['designation']) {
            iNumOfRoles = jobTitleRole['iNumOfRoles'];

            for (let x = 0; x < iNumOfRoles; x++) {
              if (users.length < iNumOfRoles) {
                tmpArray.push(jobTitleRole);
              }

            }
          }

        });
      });

      tmpArray.sort((a, b) => (a.designation > b.designation) ? 1 : -1);
    }
  }


  setJobTitles(jobs) {
    this._listJobTitleModal = jobs;
  }

  imgError(user) {
    user['iconImage'] = true;
  }

  rlsFilterChange(date) {
    this._loaderService.initLoader(true);
    if (this._filterType === 'Departmental Structure') {

      this._organogramService.getBusinessUnitStructure(this._authService._sessionUser.P6_userUID,
        this._authService._sessionUser.P5Corp_userUID, 'Current')
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.reportingStructureChanged();
        });

    } else {

      this._organogramService.getReportingLineStructure(this._authService._sessionUser.P6_userUID,
        this._authService._sessionUser.P5Corp_userUID, date)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.reportingStructureChanged();
        });
    }

  }

  orgTypeFilterChange(sType) {
    this._loaderService.initLoader(true);
    this._filterType = sType;
    if (sType === 'Departmental Structure') {
      this._organogramService.getBusinessUnitStructure(this._authService._sessionUser.P6_userUID,
        this._authService._sessionUser.P5Corp_userUID, 'Current')
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.reportingStructureChanged();
        });
    } else {

      this._organogramService.getReportingLineStructure(this._authService._sessionUser.P6_userUID,
        this._authService._sessionUser.P5Corp_userUID, 'Current')
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.reportingStructureChanged();
        });
    }
  }

  printOrganogramExcel() {

    this._organogramService.printOrganogramExcelReport(this._authService._sessionUser.P6_userUID,
      this._authService._sessionUser.P5Corp_userUID)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        // do nothing
      });

  }

  async OrganogramModal() {
    const modal = await this.modalController.create({
      component: OrganogramModalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'listUserModal': this._listUserModal,
        'listJobTitleModal': this._listJobTitleModal
      }
    });

    modal.onDidDismiss()
      .then((data) => {
        const returnedData = data;
      });

    return await modal.present();
  }

  goBack() {
    this._router.navigate(['home'], { replaceUrl: true });
  }

}
