import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, LoaderService, MyMax7Service } from '../../_services/index';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { MyMaxFilter, MyMaxTemplateMenu } from '../../_models';
import { ModalController } from '@ionic/angular';
import { FilterModalPage } from './filter-modal/filter-modal';
import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image';

import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

// declare let html2canvas;

@Component({
  selector: 'app-mymax',
  templateUrl: './mymax.page.html',
  styleUrls: ['./mymax.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MyMaxPage implements OnInit, OnDestroy {

  _selectedNode: MyMaxTemplateMenu;
  _myMaxFilter: MyMaxFilter;
  _singleComponentData = {};

  _componentData = [];
  _printerFilter = '';
  _bShowFilter = false;

  options: GridsterConfig;
  dashboard: Array<GridsterItem>;
  _rowHeightDetract = 75
  _optionsEdit = false;
  optionSections: GridsterConfig = {};
  optionsFixed: GridsterConfig = {
    gridType: 'verticalFixed',
    displayGrid: 'onDrag&Resize',
    compactType: 'compactUp',
    margin: 1,
    outerMargin: true,
    outerMarginTop: null,
    outerMarginRight: null,
    outerMarginBottom: null,
    outerMarginLeft: null,
    mobileBreakpoint: 970,
    minCols: 6,
    maxCols: 100,
    minRows: 2,
    maxRows: 100,
    maxItemCols: 20,
    minItemCols: 1,
    maxItemRows: 6,
    minItemRows: 1,
    maxItemArea: 500,
    minItemArea: 2,
    defaultItemCols: 2,
    defaultItemRows: 1,
    fixedColWidth: 100,
    fixedRowHeight: (window.innerHeight - 230) / 2,
    keepFixedHeightInMobile: false,
    keepFixedWidthInMobile: false,
    scrollSensitivity: 10,
    scrollSpeed: 20,
    enableEmptyCellClick: false,
    enableEmptyCellContextMenu: false,
    enableEmptyCellDrop: true,
    enableEmptyCellDrag: true,
    emptyCellDragMaxCols: 50,
    emptyCellDragMaxRows: 50,
    ignoreMarginInRow: false,
    draggable: {
      // enabled: true
      enabled: false
    },
    resizable: {
      // enabled: true
      enabled: false
    },
    swap: false,
    pushItems: true,
    disablePushOnDrag: false,
    disablePushOnResize: false,
    pushDirections: { north: true, east: true, south: true, west: true },
    pushResizeItems: true,
    disableWindowResize: false,
    disableWarnings: false,
    scrollToNewItems: false
  };
  optionsEdit: GridsterConfig = {
    gridType: 'verticalFixed',
    displayGrid: 'always',
    compactType: 'none',
    margin: 10,
    outerMargin: true,
    outerMarginTop: null,
    outerMarginRight: null,
    outerMarginBottom: null,
    outerMarginLeft: null,
    mobileBreakpoint: 800,
    minCols: 6,
    maxCols: 100,
    minRows: 2,
    maxRows: 100,
    maxItemCols: 20,
    minItemCols: 1,
    maxItemRows: 6,
    minItemRows: 1,
    maxItemArea: 500,
    minItemArea: 2,
    defaultItemCols: 2,
    defaultItemRows: 1,
    fixedColWidth: 100,
    fixedRowHeight: (window.innerHeight - 125) / 2,
    keepFixedHeightInMobile: false,
    keepFixedWidthInMobile: false,
    scrollSensitivity: 10,
    scrollSpeed: 20,
    enableEmptyCellClick: false,
    enableEmptyCellContextMenu: false,
    enableEmptyCellDrop: true,
    enableEmptyCellDrag: true,
    emptyCellDragMaxCols: 50,
    emptyCellDragMaxRows: 50,
    ignoreMarginInRow: false,
    draggable: {
      enabled: true
    },
    resizable: {
      enabled: true
    },
    swap: false,
    pushItems: true,
    disablePushOnDrag: false,
    disablePushOnResize: false,
    pushDirections: { north: true, east: true, south: true, west: true },
    pushResizeItems: true,
    disableWindowResize: false,
    disableWarnings: false,
    scrollToNewItems: false
  };
  _downloadingImage = false;
  _downloadingImageItem: string;

  private readonly onDestroy = new Subject<void>();
  private subDownloadTrigger: Subscription;

  constructor (
    private _router: Router,
    public _authService: AuthService,
    public _loaderService: LoaderService,
    private _mymaxService: MyMax7Service,
    public modalController: ModalController
  ) {
    this.subDownloadTrigger = this._mymaxService._myMaxDownloadTrigger.subscribe(value => this.downloadImage());
  }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._authService.hideAppPanel(true);

    this._myMaxFilter = this._mymaxService._myMaxFilter;
    this._bShowFilter = this._mymaxService._bShowFilter;

    // this._myMaxFilter['businessId'] = this._authService._sessionUser['organisationTiersUUID'];
    // this._myMaxFilter['businessLabel'] = this._authService._sessionUser['sOrganisationTierName'];

    Object.assign(this._myMaxFilter, { bIsP7: true });

    if (this._mymaxService._componentData && !this._mymaxService._componentData['node_uuid']) {
      this._mymaxService.getComponentDataForMenuItem(this._myMaxFilter, this._authService['_sessionUser']['P6_userUID'])
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.componentDataChanged();
        });
    } else {
      this.componentDataChanged();
    }
    this.setOptions();
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.subDownloadTrigger.unsubscribe();
  }

  setOptions() {
    this.setFixedRowHeight();
    if (this._optionsEdit) {
      this.options = this.optionsEdit;
    } else {
      this.options = this.optionsFixed;
    }
  }

  getComponentDataForMenuItem() {
    this._loaderService.initLoader(true);

    this._mymaxService.getComponentDataForMenuItem(this._myMaxFilter,
      this._authService._sessionUser.P6_userUID)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._componentData = this._mymaxService._componentData;
        this._loaderService.exitLoader();
      });
    // this._mymaxService._selectedMymaxTemplateMenuComponentUID = componentData.MymaxTemplateMenuComponentUID;
  }

  onResize() {
    this.setFixedRowHeight();
    this.changedOptions();
    this.gridResize();
  }

  gridResize() {
    if (this.options.api) {
      this.options.api.resize();
    }
  }
  
  changedOptions() {
    if (this.options.api) {
      this.options.api.optionsChanged();
    }
  }

  setFixedRowHeight() {
    this._rowHeightDetract = 230;
    this.optionsEdit['fixedRowHeight'] = (window.innerHeight - this._rowHeightDetract) / 2;
    this.optionsFixed['fixedRowHeight'] = (window.innerHeight - this._rowHeightDetract) / 2;
  }

  componentDataChanged() {

    if (!this._mymaxService._componentData || !this._mymaxService._componentData.length) {
      console.error('MyMax No Data Re-Route');
      this._router.navigate(['mymax-reporting'], { replaceUrl: true });
    }

    this._componentData = this._mymaxService._componentData;
    setTimeout(() => {
      this._loaderService.exitLoader();
    }, 1500);

    this.setPrinterFilter();
  }

  async open() {
    const modal = await this.modalController.create({
      component: FilterModalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'sessionUser': this._authService._sessionUser,
        'myMaxFilter': this._myMaxFilter,

        // 'subjectHeadingEdit': this._subjectHeadingEdit,
        // 'type': type,
        // 'conversation': this._conversation,
        // 'newSubject': this._newSubject,
        // 'selectedUser': this._selectedUser,
        // 'searchFrom': this._searchFrom,
        // 'searchTo': this._searchTo
      }
    });

    modal.onDidDismiss()
      .then((data) => {
        const returnedData = data;

        if (returnedData.data && returnedData.data.dismissed !== true) {
          this._mymaxService._myMaxFilter = returnedData.data;
          this.myMaxFilterSearchChanged();
        }
      });

    return await modal.present();
  }

  myMaxFilterSearchChanged() {
    this._myMaxFilter = this._mymaxService._myMaxFilter;
    this._componentData = [];
    this.setPrinterFilter();
    // -------------------------------------
    // fetch multiple or single component
    if (this._myMaxFilter.viewPrefix === 'ss_' || this._myMaxFilter.viewPrefix === 'ts_') {
      this.getComponentDataForMenuItem();
    } else {
      this.getComponentData(this._mymaxService._selectedMymaxTemplateMenuComponentUID);
    }
  }

  getComponentData(MymaxTemplateMenuComponentUID) {

    // if (this.validateOfflineSingleComponent(MymaxTemplateMenuComponentUID)) {
    //   this.singleComponentDataChanged();
    // } else {

    this._mymaxService.getComponentData(this._myMaxFilter,
      this._authService._sessionUser.P6_userUID,
      MymaxTemplateMenuComponentUID)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.singleComponentDataChanged();
      });

    // // get new components for filter changes
    // this._mymaxService.getComponentData(
    //   this._myMaxFilter,
    //   this._authService._sessionUser.P6_userUID,
    //   MymaxTemplateMenuComponentUID
    // ).takeUntil(this.ngUnsubscribe).subscribe();
    // }
  }

  singleComponentDataChanged() {
    this._loaderService.exitLoader();
    this._singleComponentData = this._mymaxService._singleComponentData;
    let i = 0;

    // for (i = 0; i < this._mymaxService._componentData.length; i++) {
    // eslint-disable-next-line

    //   if (this._mymaxService._componentData[i]['MymaxTemplateMenuComponentUID'] === this._singleComponentData['MymaxTemplateMenuComponentUID']) {
    //     alert('SINGLE DATA FOUND!!');
    //     this._mymaxService._componentData = [];
    //     this._mymaxService._componentData[0] = this._singleComponentData;
    //   }
    // }
    this._mymaxService._componentData = [];
    this._mymaxService._componentData.push(this._singleComponentData);
    this._componentData = this._mymaxService._componentData;
  }

  componentViewHandler = function (i, componentData) {
    // take out for testing purposes
    this._loaderService.initLoader(true);
    this._componentData = [];
    this._currentComponent = i;
    this._currentComponentUID = componentData.MymaxTemplateMenuComponentUID;
    // update local filter
    this._myMaxFilter.currentViewSection = componentData.currentViewSection;
    // update service filter
    this._mymaxService._myMaxFilter = this._myMaxFilter;
    // set prefix
    this._mymaxService.updateFilterPrefix();
    // update local after prefix update
    this._myMaxFilter = this._mymaxService._myMaxFilter;
    this._mymaxService._selectedMymaxTemplateMenuComponentUID = componentData.MymaxTemplateMenuComponentUID;
    // set your filename
    this._mymaxService.setJsonFileName();

    if (componentData.currentViewSection === 'summary') {
      this.getComponentDataForMenuItem();
    } else {
      this.getComponentData(componentData.MymaxTemplateMenuComponentUID);
    }

    // Lens Distribution Hide Month Filter
    if ((this._mymaxService._myMaxFilter['ss_bHideMonthFilter'] === 'YES' ||
      (this._mymaxService._myMaxFilter['ss_bHideMonthFilter']).toString() === 'true') ||
      (this._mymaxService._myMaxFilter['sd_bHideMonthFilter'] === 'YES' ||
        (this._mymaxService._myMaxFilter['sd_bHideMonthFilter']).toString() === 'true') ||
      (this._mymaxService._myMaxFilter['ts_bHideMonthFilter'] === 'YES' ||
        (this._mymaxService._myMaxFilter['ts_bHideMonthFilter']).toString() === 'true') ||
      (this._mymaxService._myMaxFilter['td_bHideMonthFilter'] === 'YES' ||
        (this._mymaxService._myMaxFilter['td_bHideMonthFilter']).toString() === 'true')) {
      this._mymaxService.hideMonthFilter();
    }

  };

  setPrinterFilter() {

    if (this._myMaxFilter['sFilterType'] === 'Filter Parent') {
      this._printerFilter = this._myMaxFilter['filter1Name'];
    } else {
      const months = [
        'January', 'February', 'March', 'April', 'May',
        'June', 'July', 'August', 'September',
        'October', 'November', 'December'
      ];

      // same month
      if (this._myMaxFilter['iFromMonth'] === this._myMaxFilter['iToMonth']) {
        this._printerFilter = months[Number(this._myMaxFilter['iToMonth']) - 1];

        // and same year
        if (this._myMaxFilter['iFromYear'] === this._myMaxFilter['iToYear']) {
          this._printerFilter = this._printerFilter + ' - ' + this._myMaxFilter['iToYear'];
        } else {
          this._printerFilter = months[Number(this._myMaxFilter['iFromMonth']) - 1] + ' - ' + this._myMaxFilter['iFromYear'];
          // eslint-disable-next-line max-len
          this._printerFilter = this._printerFilter + ' to ' + months[Number(this._myMaxFilter['iToMonth']) - 1] + ' - ' + this._myMaxFilter['iToYear'];
        }

      } else {
        this._printerFilter = months[Number(this._myMaxFilter['iFromMonth']) - 1] + ' - ' + this._myMaxFilter['iFromYear'];
        // eslint-disable-next-line max-len
        this._printerFilter = this._printerFilter + ' to ' + months[Number(this._myMaxFilter['iToMonth']) - 1] + ' - ' + this._myMaxFilter['iToYear'];
      }

      // set filter
      if (this._myMaxFilter['businessLabel']) {
        this._printerFilter = this._printerFilter + ' | ' + this._myMaxFilter['businessLabel'];
      } else {
        this._printerFilter = this._printerFilter + ' | All';
      }
    }
  }

  downloadImage() {
    this._downloadingImage = true;
    this._loaderService.initLoader(true);

    this._selectedNode = this._mymaxService._selectedNode;

    this._downloadingImageItem = this._mymaxService['_myMaxDownloadItem'];

    let compCount = 0;
    let compTotal = 1;
    let lastTitle = '';
    // SINGLE SECTION //
    if (!this._selectedNode['bSectionHeading']) {
      this._componentData.forEach(comp => {
        if (!this._downloadingImageItem.length || (this._downloadingImageItem.length && this._downloadingImageItem === comp['MymaxTemplateMenuComponentUID'])) {
          lastTitle = comp['visualSettings'][this._myMaxFilter['viewPrefix'] + 'sHeading'];
          compCount++;
        } else {

        }
        compTotal++;
      });
    } else {
      this._componentData.forEach(section => {
        section['components'].forEach(comp => {
          if (!this._downloadingImageItem.length || (this._downloadingImageItem.length && this._downloadingImageItem === comp['MymaxTemplateMenuComponentUID'])) {
            lastTitle = comp['visualSettings'][this._myMaxFilter['viewPrefix'] + 'sHeading'];
            compCount++;
          }
          compTotal++;
        });
      });
    }

    let compTime = compTotal * 1500;
    if (this._myMaxFilter && this._myMaxFilter.currentViewSection === 'detailed') {
      compTime = 3500;
    }

    // File Name
    const today = new Date();
    const d = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let bwTitle = document.getElementById("breadcrumb-wrapper-title").textContent;

    bwTitle = bwTitle.trim();
    bwTitle = bwTitle.replace("MyMax Reporting", "MyMaxReporting");
    bwTitle = bwTitle.replace(" -  ", "-");
    bwTitle = bwTitle.replace(" -  ", "-");
    bwTitle = bwTitle.replace("_", "");
    bwTitle = bwTitle.trim();

    if (compCount === 0) {
      compCount = 1;
    }
    if (compCount === 1) {
      bwTitle = bwTitle + ' - ' + lastTitle;
    }
    const fileName = d + ' - ' + bwTitle;

    let that = this;
    setTimeout(function () {

      document.getElementById("breadcrumb-print-wrapper").innerHTML = document.getElementById("breadcrumb-wrapper").innerHTML;

      // let node = document.getElementById('mymax-print-wrapper');
      // console.log('_downloadingImageItem:: ', that._downloadingImageItem);
      let node = document.getElementById('print-iud-' + that._downloadingImageItem);
      // console.log('node:: ', node);

      domtoimage.toPng(node).then(function (dataUrl) {
        that.sendURI(dataUrl, fileName);

        // let img = new Image();
        // img.src = dataUrl;
        // document.getElementById('canvasTestHolder').appendChild(img);


      }).catch(function (error) {
        console.error('oops, something went wrong!', error);
      });

    }, compTime);
  }

  sendURI(htmlURI, fileName) {
    const link = document.createElement("a");

    link.download = fileName;
    link.href = htmlURI;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this._downloadingImage = false;
    this._loaderService.exitLoader();
  }

  goBack() {
    if (this._myMaxFilter.currentViewSection === 'detailed' && this._myMaxFilter.detailed_stepThroughValue === '' || this._mymaxService['_sCurrentView'] === 'ss_' && this._myMaxFilter.detailed_stepThroughValue !== '') {
      this._mymaxService.triggerMyMaxSummaryView();
    } else if (this._myMaxFilter.detailed_stepThroughValue !== '' && this._mymaxService['_sCurrentView'] === 'sd_') {
      this._mymaxService.triggerMyMaxDetailedView();
    } else {
      this._router.navigate([this._authService._previousAppTab], { replaceUrl: true });
    }
  }
}
