import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {
  AppSettings, MyMaxTemplateMenu, MyMaxFilter, PortalTemplate
} from '../_models/index';
import { AuthService } from '../_services/auth.service';
import { PostService } from './post.service';
import { MessengerService } from '../_services/messengerservice.service';
import { MyMaxTemplate } from '../_models/mymax-template';
import { SessionUser } from '../_models/index';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable()
export class MyMax7Service implements OnDestroy {
  private AUTHSubscription: Subscription;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  _myMaxReportingTemplateViews: MyMaxTemplateMenu[] = [];

  _myMaxReportingData = {};
  _componentData = [];

  _myMaxFilter: MyMaxFilter = new MyMaxFilter();
  _templates: MyMaxTemplate[] = [];
  _selectedNode: MyMaxTemplateMenu;
  _sessionUser: SessionUser;
  _bShowFilter = false;
  _printerFilter = '';
  _filter2Data = [];
  _selectedMymaxTemplateMenuComponentUID = '';
  _singleComponentData = {};
  _curBusiness = [];
  _bResetFilter = false;
  _curBusinessLabel = [];

  _sCurrentView = '';

  _myMaxMenuChanged = new EventEmitter();
  _componentDataChanged = new EventEmitter();

  _myMaxDownloadItem: string;
  _myMaxDownloadTrigger = new EventEmitter();
  _myMaxSummaryTrigger = new EventEmitter();
  _myMaxDetailedTrigger = new EventEmitter();

  constructor (private _mService: MessengerService,
    private _http: HttpClient,
    public _authService: AuthService,
    private _pService: PostService
  ) { }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getIndivReportingMenuStructureForUserUID(P6_userUID, P6CompanyUID) {
    const bodyString = JSON.stringify({
      peformaxToken: AppSettings.PEFORMAX_TOKEN,
      P6_userUID,
      P6CompanyUID,
      sModule: 'login',
      sFunction: 'getIndivReportingMenuStructureForUserUID'
    });
    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._myMaxReportingData = JSON.parse(JSON.stringify(result[0]));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getIndivReportingMenuStructureForUserUID', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getIndivReportingMenuStructureForUserUID'))
    );
  }

  getHomeTabData(P6_userUID) {
    const bodyString = JSON.stringify({
      peformaxToken: AppSettings.PEFORMAX_TOKEN,
      sModule: 'MyMaxReportingP7',
      P6_userUID: P6_userUID,
      sFunction: 'getHomeTabData'
    });
    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        const results = JSON.parse(JSON.stringify(result));
        return results;
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getResources', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getResources'))
    );
  }

  getTabData(P6_userUID, tab) {
    const bodyString = JSON.stringify({
      peformaxToken: AppSettings.PEFORMAX_TOKEN,
      sModule: 'MyMaxReportingP7',
      P6_userUID: P6_userUID,
      sFunction: 'getTabData',
      tab
    });
    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        const results = JSON.parse(JSON.stringify(result));
        return results;
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getResources', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getResources'))
    );
  }

  getMyMaxReportingTemplateViews(portalTemplateTileUID, sPortalView, P6_userUID) {
    const bodyString = JSON.stringify({
      peformaxToken: AppSettings.PEFORMAX_TOKEN,
      sModule: 'MyMaxReportingP7',
      portalTemplateTileUID: portalTemplateTileUID,
      sPortalView: sPortalView,
      P6_userUID: P6_userUID,
      sFunction: 'getMyMaxReportingTemplateViews'

    });
    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        const results = JSON.parse(JSON.stringify(result));
        this._myMaxReportingTemplateViews = results;
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getMyMaxReportingTemplateViews', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getMyMaxReportingTemplateViews'))
    );
  }

  getComponentDataForMenuItem(myMaxFilter, P6_userUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'MyMaxReporting',
      'myMaxFilter': myMaxFilter,
      'P6_userUID': P6_userUID,
      'sFunction': 'getComponentDataForMenuItem'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._componentData = JSON.parse(JSON.stringify(result));
        // this._componentDataChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getComponentDataForMenuItem', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getComponentDataForMenuItem'))
    );
  }

  getFilterDataForMenuItem(myMaxFilter, P6_userUID) {

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'MyMaxReporting',
      'myMaxFilter': myMaxFilter,
      'P6_userUID': P6_userUID,
      'sFunction': 'getFilterDataForMenuItem'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._myMaxFilter = JSON.parse(JSON.stringify(result));
        this.myMaxFilterChanged();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getFilterDataForMenuItem', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getFilterDataForMenuItem'))
    );
  }

  getMyMaxTemplates(Company_fkCompanyUID) {

    this._templates = [];
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'MymaxTemplate',
      'Company_fkCompanyUID': Company_fkCompanyUID,
      'sFunction': 'getMyMaxTemplates'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._templates = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getMyMaxTemplates', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getMyMaxTemplates'))
    );
  }

  getLinkedFilter2Data(filter1ID, MymaxTemplateMenuUID, myMaxFilter, P6_userUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'MyMaxReporting',
      'filter1ID': filter1ID,
      'MymaxTemplateMenuUID': MymaxTemplateMenuUID,
      'myMaxFilter': myMaxFilter,
      'P6_userUID': P6_userUID,
      'sFunction': 'getLinkedFilter2Data'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._filter2Data = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getLinkedFilter2Data', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getLinkedFilter2Data'))
    );
  }

  getComponentData(myMaxFilter, P6_userUID, MymaxTemplateMenuComponentUID) {

    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'MyMaxReporting',
      'myMaxFilter': myMaxFilter,
      'P6_userUID': P6_userUID,
      'MymaxTemplateMenuComponentUID': MymaxTemplateMenuComponentUID,
      'sFunction': 'getComponentData'
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._singleComponentData = JSON.parse(JSON.stringify(result));
        // this._singleComponentDataChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getComponentData', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getComponentData'))
    );
  }

  // getComponentData(myMaxFilter, P6_userUID, MymaxTemplateMenuComponentUID) {

  //   const bodyString = JSON.stringify({
  //     'peformaxToken': AppSettings.PEFORMAX_TOKEN,
  //     'sModule': 'MyMaxReporting',
  //     'myMaxFilter': myMaxFilter,
  //     'P6_userUID': P6_userUID,
  //     'MymaxTemplateMenuComponentUID': MymaxTemplateMenuComponentUID,
  //     'sFunction': 'getComponentData'
  //   });

  //   return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
  //     map((result: any) => {
  //       this._singleComponentData = JSON.parse(JSON.stringify(result));
  //     }),
  //     tap(_ => this._mService.handleTap(this.constructor.name, 'getComponentData', bodyString)),
  //     catchError(this._mService.handleError<any>(this.constructor.name, 'getComponentData'))
  //   );
  // }

  // createJsonReportFiles(P6_userUID) {

  //   const bodyString = JSON.stringify({
  //     'peformaxToken': AppSettings.PEFORMAX_TOKEN,
  //     'sModule': 'MyMaxReporting',
  //     'P6_userUID': P6_userUID,
  //     'sFunction': 'createJsonReportFiles'
  //   });

  //   return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
  //     map((result: any) => {
  //     }),
  //     tap(_ => this._mService.handleTap(this.constructor.name, 'createJsonReportFiles', bodyString)),
  //     catchError(this._mService.handleError<any>(this.constructor.name, 'createJsonReportFiles'))
  //   );
  // }

  formatJsonStepThroughName(sName: string) {
    // if you add or change values here, please update same function in back-end commonControls - exclude escape slashes for CF
    if (sName !== '') {
      sName.replace(new RegExp('/', 'g'), '');
      sName.replace(new RegExp('\\\\', 'g'), '');
      sName.replace(new RegExp('&', 'g'), '');
      sName.replace(new RegExp('-', 'g'), '');
      sName.replace(new RegExp(' ', 'g'), '');
      sName.replace(new RegExp('\\?', 'g'), '');
      sName.replace(new RegExp(':', 'g'), '');
      sName.replace(new RegExp('>', 'g'), '');
      sName.replace(new RegExp('<', 'g'), '');
      sName.replace(new RegExp('%', 'g'), '');
      sName.replace(new RegExp('\\*', 'g'), '');
    }
    return sName;
  }

  setJsonFileName() {

    let sValue = '';
    const iFromMonth = this._myMaxFilter.iFromMonth;
    const iFromYear = this._myMaxFilter.iFromYear;
    const iToMonth = this._myMaxFilter.iToMonth;
    const iToYear = this._myMaxFilter.iToYear;
    const sum_stepThroughValue = this.formatJsonStepThroughName(this._myMaxFilter.summary_stepThroughValue);
    const det_stepThroughValue = this.formatJsonStepThroughName(this._myMaxFilter.detailed_stepThroughValue);
    const businessId = this._myMaxFilter.businessId;
    const filter1Id = this._myMaxFilter.filter1Id;
    const filter2Id = this._myMaxFilter.filter2Id;
    const filter3Id = this._myMaxFilter.filter3Id;
    const filter4Id = this._myMaxFilter.filter4Id;
    const filter5Id = this._myMaxFilter.filter5Id;

    if (this._myMaxFilter.currentView === 'Single View') {
      if (this._myMaxFilter.currentViewSection === 'summary') {
        sValue = sValue + 'SS' + '_';
      } else {
        if (det_stepThroughValue !== '' && sum_stepThroughValue === '') {
          sValue = sValue + 'SDS_' + det_stepThroughValue + '_';
        } else if (det_stepThroughValue !== '' && sum_stepThroughValue !== '') {
          sValue = sValue + 'SDS_' + sum_stepThroughValue + '_' + det_stepThroughValue + '_';
        } else if (det_stepThroughValue === '' && sum_stepThroughValue !== '') {
          sValue = sValue + 'SDS_' + sum_stepThroughValue + '_';
        } else {
          sValue = sValue + 'SD' + '_';
        }
      }
      sValue = sValue + iFromMonth + '_' + iFromYear + '_';
    } else {
      if (this._myMaxFilter.currentViewSection === 'summary') {
        sValue = sValue + 'TS' + '_';
      } else {
        if (det_stepThroughValue !== '' && sum_stepThroughValue === '') {
          sValue = sValue + 'TDS_' + det_stepThroughValue + '_';
        } else if (det_stepThroughValue !== '' && sum_stepThroughValue !== '') {
          sValue = sValue + 'TDS_' + sum_stepThroughValue + '_' + det_stepThroughValue + '_';
        } else if (det_stepThroughValue === '' && sum_stepThroughValue !== '') {
          sValue = sValue + 'TDS_' + sum_stepThroughValue + '_';
        } else {
          sValue = sValue + 'TD' + '_';
        }
      }
      sValue = sValue + iFromMonth + '_' + iFromYear + '_' + iToMonth + '_' + iToYear + '_';
    }

    sValue = sValue + businessId;

    if (filter1Id !== '') {
      sValue = sValue + '_' + filter1Id;
    }
    if (filter2Id !== '') {
      sValue = sValue + '_' + filter2Id;
    }
    if (filter3Id !== '') {
      sValue = sValue + '_' + filter3Id;
    }
    if (filter4Id !== '') {
      sValue = sValue + '_' + filter4Id;
    }
    if (filter5Id !== '') {
      sValue = sValue + '_' + filter5Id;
    }

    // this._sOfflineFileName = sValue;
  }

  updateFilterPrefix() {
    let preFixA: string;
    let preFixB: string;
    let preFixC = '';

    if (this._myMaxFilter['currentView'] === 'Single View') {
      preFixA = 's';
    }
    if (this._myMaxFilter['currentView'] === 'Comparative View') {
      preFixA = 't';
    }
    if (this._myMaxFilter['currentViewSection'] === 'summary') {
      preFixB = 's';
    }
    if (this._myMaxFilter['currentViewSection'] === 'detailed') {
      preFixB = 'd';
    }
    if (this._myMaxFilter.detailed_stepThroughValue !== '') {
      preFixC = 's';
    }

    this._myMaxFilter.viewPrefix = preFixA + preFixB + preFixC + '_';
  }


  triggerMyMaxPodDownload(uid) {
    this._myMaxDownloadItem = uid;
    this._myMaxDownloadTrigger.emit();
  }

  triggerMyMaxSummaryView() {
    this._myMaxSummaryTrigger.emit();
  }

  triggerMyMaxDetailedView() {
    this._myMaxDetailedTrigger.emit();
  }

  updateFilter(sHeading, myMaxChildren) {
    // reset component data
    const MymaxFilter = new MyMaxFilter();
    this._componentData = [];

    // set Children
    this._selectedNode = myMaxChildren;
    if (myMaxChildren && myMaxChildren.bShowSingleViewFilters === 0) {
      this._bShowFilter = false;
    } else {
      this._bShowFilter = true;
    }

    if (myMaxChildren) {
      MymaxFilter.node_bShowDateFilters = myMaxChildren.bShowDateFilters;
      MymaxFilter.node_bShowBusinessFilters = myMaxChildren.bShowBusinessFilters;
      MymaxFilter.node_bShowOnlyTrendView = myMaxChildren.bShowOnlyTrendView;
      MymaxFilter.node_bShowSingleViewFilters = myMaxChildren.bShowSingleViewFilters;
      MymaxFilter.node_bShowTrendViewFilters = myMaxChildren.bShowTrendViewFilters;
      MymaxFilter.node_bShowMonthRangeFilters = myMaxChildren.bShowMonthRangeFilters;
      MymaxFilter.node_uuid = myMaxChildren.uuid;
      MymaxFilter.node_templateUID = myMaxChildren.mymaxTemplateUID;
      MymaxFilter.sFilterType = myMaxChildren.sFilterType;
      MymaxFilter.sFilterDateNameType = myMaxChildren.sFilterDateNameType;
      MymaxFilter.bManualDate = myMaxChildren.bManualDate;
      MymaxFilter.sManualDate = myMaxChildren.sManualDate;
      MymaxFilter.bSectionHeading = myMaxChildren.bSectionHeading;
      MymaxFilter.sHeading = sHeading;
      MymaxFilter.sSubHeading = myMaxChildren.name;
    }
    this._myMaxFilter = MymaxFilter
    return this._myMaxFilter;
  }

  myMaxFilterChanged() {

    // this._bShowFilter = this._mymaxService._bShowFilter;
    // this._myMaxFilter = this._mymaxService._myMaxFilter;
    // this._myMaxFilter = JSON.parse(JSON.stringify(this._mymaxService._myMaxFilter));
    //
    let _keepGoing = true;

    this._myMaxFilter['businessids'].forEach(bisA => {
      if (bisA['filterID'] === this._myMaxFilter['businessId']) {
        this._myMaxFilter['businessLabel'] = bisA['filterLabel'];
        _keepGoing = false;
      } else if (_keepGoing) {
        bisA['children'].forEach(bisB => {
          if (bisB['filterID'] === this._myMaxFilter['businessId']) {
            this._myMaxFilter['businessLabel'] = bisB['filterLabel'];
            _keepGoing = false;
          } else if (_keepGoing) {
            bisB['children'].forEach(bisC => {
              if (bisC['filterID'] === this._myMaxFilter['businessId']) {
                this._myMaxFilter['businessLabel'] = bisC['filterLabel'];
                _keepGoing = false;
              } else if (_keepGoing) {
                bisC['children'].forEach(bisD => {
                  if (bisD['filterID'] === this._myMaxFilter['businessId']) {
                    this._myMaxFilter['businessLabel'] = bisD['filterLabel'];
                    _keepGoing = false;
                  } else if (_keepGoing) {
                    bisC['children'].forEach(bisE => {
                      if (bisD['filterID'] === this._myMaxFilter['businessId']) {
                        this._myMaxFilter['businessLabel'] = bisE['filterLabel'];
                        _keepGoing = false;
                      } else if (_keepGoing) {
                        bisC['children'].forEach(bisF => {
                          if (bisD['filterID'] === this._myMaxFilter['businessId']) {
                            this._myMaxFilter['businessLabel'] = bisF['filterLabel'];
                            _keepGoing = false;
                          } else if (_keepGoing) {
                            bisC['children'].forEach(bisG => {
                              if (bisD['filterID'] === this._myMaxFilter['businessId']) {
                                this._myMaxFilter['businessLabel'] = bisG['filterLabel'];
                                _keepGoing = false;
                              }
                            });
                          }
                        });
                      }
                    });

                  }
                });
              }
            });
          }
        });
      }
    });
    //
    this._bResetFilter = false;
    this.filterReset(this._bResetFilter);

    this._curBusiness = [];
    this._curBusiness.push(this._myMaxFilter['businessId']);

    // Single/Comparative
    if (this._myMaxFilter['node_bShowDateFilters']) {
      // set from months
      if (this._myMaxFilter['from_dates'].length !== 0) {
        this.fromYearChanged(this._myMaxFilter['iFromYear']);
      }
    }

    // Story Board
    if (this._myMaxFilter['node_bShowOnlyTrendView']) {
      this._myMaxFilter['currentView'] = 'Comparative View';
    }

    // this.search();
  }

  filterReset(bResetFilter) {
    if (this._myMaxFilter['businessids'].length > 0 && !bResetFilter) {
      let i = 0;
      let j = 0;
      let children = [];

      for (i = 0; i < this._myMaxFilter['businessids'].length; i++) {

        if (i === 0 && this._myMaxFilter['businessids'][i]['bDisabled'] === 0) {
          this._myMaxFilter['businessId'] = this._myMaxFilter['businessids'][i]['filterID'];
          this._curBusinessLabel = this._myMaxFilter['businessids'][i]['filterLabel'];
          // this._bDisableSubmitButton = this._myMaxFilter['businessids'][i]['bDisabled'] === 1 ? true : false;
          break;
        }
        if (i === 0 && this._myMaxFilter['businessids'][i]['bDisabled'] === 1) {
          this._curBusiness.push(this._myMaxFilter['businessids'][i]['filterID']);
        }
        if (this._myMaxFilter['businessids'][i] && this._myMaxFilter['businessids'][i]['children']) {
          children = this._myMaxFilter['businessids'][i]['children'];
          for (j = 0; j < children.length; j++) {
            if (children[j]['bDisabled'] === 0) {
              this._myMaxFilter['businessId'] = children[j]['filterID'];
              this._curBusinessLabel = children[j]['filterLabel'];
              // this._bDisableSubmitButton = children[j]['bDisabled'] === 1 ? true : false;
              this._curBusiness.push(this._myMaxFilter['businessId']);
              break;
            }
          }
        }
        this._myMaxFilter['businessId'] = this._authService._sessionUser['organisationTiersUUID'];
        this._myMaxFilter['businessLabel'] = this._authService._sessionUser['sOrganisationTierName'];
      }
    }

    // default value
    if (this._myMaxFilter['sMonthRange'] === '' || !this._myMaxFilter['sMonthRange']) {
      this._myMaxFilter['sMonthRange'] = 'Single Month';
    }

  }

  fromYearChanged(iYear) {
    this._bResetFilter = true;

    this.filterReset(this._bResetFilter);
    const selectedYear = this._myMaxFilter['from_dates'].filter(item => item.iYear.toString() === iYear.toString())[0];
    // set from months
    this._myMaxFilter['from_months'] = JSON.parse(JSON.stringify(selectedYear.months));
    // set selected month
    this._myMaxFilter['iFromMonth'] = this._myMaxFilter['from_months'][0]['iMonth'];
    // format to dates
    // this.manageToDates(iYear.toString());

    this._myMaxFilter['from_dates'].forEach(fromDates => {
      if (this._myMaxFilter['iFromYear'].toString() === fromDates.iYear.toString()) {
        fromDates.months.forEach(filterMonth => {
          if (this._myMaxFilter['iFromMonth'].toString() === filterMonth.iMonth.toString() && filterMonth.businessids) {
            this._myMaxFilter['businessids'] = filterMonth.businessids;
          }
        });
      }
    });
  }

  search() {
    // this._loaderService.initLoader(true);

    // update mymax filter on service
    // this._myMaxFilter = JSON.parse(JSON.stringify(this._myMaxFilter));
    // this._mymaxService._myMaxFilter = this._myMaxFilter;
    // this._mymaxService.updateFilterPrefix();

    // this._mymaxService._myMaxFilterSearchChanged.emit();
    // close mobile nav
    // this._authService._closeFilter.emit();

    // this.hideMonthFilter();
  }

  // Hide Month Filter
  // hideMonthFilter() {
  //   this._bHideMonthFilterSW = false;
  //   this._bHideMonthFilterTW = false;

  //   if (this._mymaxService._myMaxFilter['currentViewSection'] === 'summary') {
  //     if (this._mymaxService._myMaxFilter['ss_bHideMonthFilter'] === true ||
  //       (this._mymaxService._myMaxFilter['ss_bHideMonthFilter']).toString() === 'YES') {
  //       this._bHideMonthFilterSW = true;
  //       this._mymaxService._myMaxFilter['sFromMonth'] = '';
  //     }
  //   } else if (this._mymaxService._myMaxFilter['currentViewSection'] === 'detailed') {
  //     if (this._mymaxService._myMaxFilter['sd_bHideMonthFilter'] === true ||
  //       (this._mymaxService._myMaxFilter['sd_bHideMonthFilter']).toString() === 'YES') {
  //       this._bHideMonthFilterSW = true;
  //     }
  //   }

  //   if (this._mymaxService._myMaxFilter['currentViewSection'] === 'summary') {
  //     if (this._mymaxService._myMaxFilter['ts_bHideMonthFilter'] === true ||
  //       (this._mymaxService._myMaxFilter['ts_bHideMonthFilter']).toString() === 'YES') {
  //       this._bHideMonthFilterTW = true;
  //       this._mymaxService._myMaxFilter['sToMonth'] = '';
  //     }
  //   } else if (this._mymaxService._myMaxFilter['currentViewSection'] === 'detailed') {
  //     if (this._mymaxService._myMaxFilter['td_bHideMonthFilter'] === true ||
  //       (this._mymaxService._myMaxFilter['td_bHideMonthFilter']).toString() === 'YES'
  //     ) {
  //       this._bHideMonthFilterTW = true;
  //     }
  //   }


  // }



}
