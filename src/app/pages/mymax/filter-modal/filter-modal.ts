import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { MyMaxFilter } from '../../../_models';
import { SessionUser } from '../../../_models/index';
import { MyMax7Service, LoaderService, AuthService } from '../../../_services';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';


@Component({
  selector: 'filter-modal-page',
  styleUrls: ['../mymax.page.scss'],
  templateUrl: './filter-modal.page.html',
})


export class FilterModalPage implements OnInit, OnDestroy {
  private readonly onDestroy = new Subject<void>();
  private ngUnsubscribe: Subject<any> = new Subject<any>();

  // _view = 'Members';
  // _myMaxFilter: MyMaxFilter;
  // _sessionUser: SessionUser;
  _curFilter: any
  _bShowFilter = true;
  _toDates = [];
  _curBusiness = [];
  _curBusinessLabel = [];

  _bHideMonthFilterSW = false;
  _bHideMonthFilterTW = false;
  _bResetFilter = false;
  _bDisableSubmitButton = false;

  @Input() myMaxFilter: MyMaxFilter;
  @Input() sessionUser: SessionUser;


  constructor (private modalController: ModalController,
    private _mymaxService: MyMax7Service,
    private _loaderService: LoaderService,
    public _authService: AuthService
  ) {
    // this._view = 'Members'
  }

  ngOnInit() {
    // this._myMaxFilter = this._mymaxService._myMaxFilter;
    // this._sessionUser = this._authService._sessionUser;
    this._curFilter = JSON.parse(JSON.stringify(this.myMaxFilter));
    this.myMaxFilterChanged();
    this.hideMonthFilter();

    const busObjec = {
      filterLabel: this._curFilter['businessLabel'],
      filterID: this._curFilter['businessId']
    }
    this.filterNav(false, false, busObjec);

  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true,
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.onDestroy.next();
  }

  // saveNewHeading() {
  //   this.modalController.dismiss(this.subjectHeadingEdit);
  // }

  fromYearChanged(iYear) {
    this._bResetFilter = true;
    this.filterReset(this._bResetFilter);
    const selectedYear = this._curFilter['from_dates'].filter(item => item.iYear.toString() === iYear.toString())[0];
    // set from months
    this._curFilter['from_months'] = JSON.parse(JSON.stringify(selectedYear.months));
    // set selected month
    this._curFilter['iFromMonth'] = this._curFilter['from_months'][0]['iMonth'];
    // format to dates
    this.manageToDates(iYear.toString());

    this._curFilter['from_dates'].forEach(fromDates => {
      if (this._curFilter['iFromYear'].toString() === fromDates.iYear.toString()) {
        fromDates.months.forEach(filterMonth => {
          if (this._curFilter['iFromMonth'].toString() === filterMonth.iMonth.toString() && filterMonth.businessids) {
            this._curFilter['businessids'] = filterMonth.businessids;
          }
        });
      }
    });
  }

  fromMonthChange() {
    this._bResetFilter = true;
    this.filterReset(this._bResetFilter);
    // mange 'to months' when both years are the same
    if (this._curFilter['iFromYear'].toString() === this._curFilter['iToYear'].toString()) {
      const original_to_dates = JSON.parse(JSON.stringify(this._curFilter['to_dates']));
      const selectedYear = original_to_dates.filter(item => item.iYear.toString() === this._curFilter['iToYear'].toString())[0];
      const mIndex = selectedYear.months.findIndex(item => item.iMonth.toString() === this._curFilter['iFromMonth'].toString());
      selectedYear.months.splice(mIndex, 1);
      this._curFilter['to_months'] = selectedYear.months;

      this._curFilter.to_months.sort((a, b) => (a.iMonth > b.iMonth ? -1 : 1));

      this._curFilter['from_dates'].forEach(fromDates => {
        if (this._curFilter['iFromYear'].toString() === fromDates.iYear.toString()) {
          fromDates.months.forEach(filterMonth => {
            if (this._curFilter['iFromMonth'].toString() === filterMonth.iMonth.toString() && filterMonth.businessids) {
              this._curFilter['businessids'] = filterMonth.businessids;
            }
          });
        }
      });
    }
    if (this._curFilter['sMonthRange'] === 'Single Month') {
      this._curFilter['iToMonth'] = this._curFilter['iFromMonth'];
    }

  }

  toYearChanged(iYear) {
    // this._curFilter['businessId'] = '';
    // this._curBusinessLabel = null;
    const selectedYear = this._toDates.filter(item => item.iYear.toString() === iYear.toString())[0];
    this._curFilter['to_months'] = JSON.parse(JSON.stringify(selectedYear.months));
    this._curFilter['iToMonth'] = this._curFilter['to_months'][0].iMonth;
  }

  // the to_dates array must no contain the selected from year and from month
  manageToDates(from_iYear) {
    // clear this._toDates
    this._toDates = [];
    // assign original to_dates to variable and remove references
    const original_to_dates = JSON.parse(JSON.stringify(this._curFilter['to_dates']));
    let i = 0;
    for (i = 0; i < original_to_dates.length; i++) {
      // only work with years that has comparison
      if (original_to_dates[i].hasComparison === 1) {
        if (original_to_dates[i].iYear.toString() === from_iYear && original_to_dates[i].months.length === 1) {
          continue;
        } else {
          if (original_to_dates[i].iYear.toString() === from_iYear) {
            // remove 'from month' from 'to months'
            // eslint-disable-next-line max-len
            const mIndex = original_to_dates[i].months.findIndex(item => item.iMonth.toString() === this._curFilter['iFromMonth'].toString());
            original_to_dates[i].months.splice(mIndex, 1);
          }
          this._toDates.push(original_to_dates[i]);
        }
      }
    }
    if (this._toDates.length !== 0) {
      this._curFilter['iToYear'] = this._toDates[0].iYear;
      this._curFilter['iToMonth'] = this._toDates[0].months[0].iMonth.toString();
      this._curFilter['to_months'] = this._toDates[0].months;
    }

    if (this._toDates.length === 0) {
      this._toDates = this._curFilter['from_dates'];
      this._curFilter['iToYear'] = this._toDates[0].iYear;
      this._curFilter['iToMonth'] = this._toDates[0].months[0].iMonth.toString();
      this._curFilter['to_months'] = this._toDates[0].months;
    }
  }

  orderDates(sType: string) {

    if (sType === 'YTD') {
      this._curFilter.from_months.sort((a, b) => (a.iMonth < b.iMonth ? -1 : 1));
      this._curFilter.iFromMonth = this._curFilter.from_months[0].iMonth;
      this.fromMonthChange();
      this._curFilter['iToMonth'] = this._curFilter['to_months'][0].iMonth;
    } else {
      this._curFilter.from_months.sort((a, b) => (a.iMonth > b.iMonth ? -1 : 1));
      this._curFilter.iFromMonth = this._curFilter.from_months[0].iMonth;
      this.fromMonthChange();
    }
  }

  //
  // Business IDs Handler
  //
  filterReset(bResetFilter) {
    if (this._curFilter['businessids'].length > 0 && !bResetFilter) {
      let i = 0;
      let j = 0;
      let children = [];

      for (i = 0; i < this._curFilter['businessids'].length; i++) {

        if (i === 0 && this._curFilter['businessids'][i]['bDisabled'] === 0) {
          this._curFilter['businessId'] = this._curFilter['businessids'][i]['filterID'];
          this._curBusinessLabel = this._curFilter['businessids'][i]['filterLabel'];
          // this._bDisableSubmitButton = this._curFilter['businessids'][i]['bDisabled'] === 1 ? true : false;
          break;
        }
        if (i === 0 && this._curFilter['businessids'][i]['bDisabled'] === 1) {
          this._curBusiness.push(this._curFilter['businessids'][i]['filterID']);
        }
        if (this._curFilter['businessids'][i] && this._curFilter['businessids'][i]['children']) {
          children = this._curFilter['businessids'][i]['children'];
          for (j = 0; j < children.length; j++) {
            if (children[j]['bDisabled'] === 0) {
              this._curFilter['businessId'] = children[j]['filterID'];
              this._curBusinessLabel = children[j]['filterLabel'];
              // this._bDisableSubmitButton = children[j]['bDisabled'] === 1 ? true : false;
              this._curBusiness.push(this._curFilter['businessId']);
              break;
            }
          }
        }
        this._curFilter['businessId'] = this.sessionUser['organisationTiersUUID'];
        this._curFilter['businessLabel'] = this.sessionUser['sOrganisationTierName'];
      }
    }

    // default value
    if (this._curFilter['sMonthRange'] === '' || !this._curFilter['sMonthRange']) {
      this._curFilter['sMonthRange'] = 'Single Month';
    }

  }

  filterNav($event, i, business) {
    // filter users index of in html to check if id exists in _curBusiness to keep open selected tabs
    // this we only push in id's from bottom up where there is a match

    // this._curBusinessLabel = business['filterLabel'];
    this._curFilter['businessLabel'] = business['filterLabel'];
    this._curFilter['businessId'] = business['filterID'];

    // const filterID = business['filterID'];
    // if (this._curBusiness.indexOf(filterID) >= 0) {
    //   this._curBusiness.length = i;
    // } else {
    //   this._curBusiness.length = i;
    //   this._curBusiness.push(filterID);
    // }

    let children = [];
    let childrenA = [];
    let childrenB = [];
    let childrenC = [];
    let childrenD = [];
    let childrenE = [];
    this._curBusiness = [];
    this._curBusiness.push(business['filterID']);

    for (let j = 0; j < this._curFilter['businessids'].length; j++) {
      if (this._curFilter['businessids'][j]['filterID'] === business['filterID']) {
        this._curBusiness.push(this._curFilter['businessids'][j]['filterID']);
        break;
      }
      children = this._curFilter['businessids'][j]['children'];
      for (let k = 0; k < children.length; k++) {
        if (children[k]['filterID'] === business['filterID']) {
          this._curBusiness.push(this._curFilter['businessids'][j]['filterID']);
          this._curBusiness.push(children[k]['filterID']);
          break;
        }
        childrenA = children[k]['children'];
        for (let m = 0; m < childrenA.length; m++) {
          if (childrenA[m]['filterID'] === business['filterID']) {
            this._curBusiness.push(this._curFilter['businessids'][j]['filterID']);
            this._curBusiness.push(children[k]['filterID']);
            this._curBusiness.push(childrenA[m]['filterID']);
            break;
          }
          childrenB = childrenA[m]['children'];
          for (let n = 0; n < childrenB.length; n++) {
            if (childrenB[n]['filterID'] === business['filterID']) {
              this._curBusiness.push(this._curFilter['businessids'][j]['filterID']);
              this._curBusiness.push(children[k]['filterID']);
              this._curBusiness.push(childrenA[m]['filterID']);
              this._curBusiness.push(childrenB[n]['filterID']);
              break;
            }
            childrenC = childrenB[n]['children'];
            for (let o = 0; o < childrenC.length; o++) {
              if (childrenC[o]['filterID'] === business['filterID']) {
                this._curBusiness.push(this._curFilter['businessids'][j]['filterID']);
                this._curBusiness.push(children[k]['filterID']);
                this._curBusiness.push(childrenA[m]['filterID']);
                this._curBusiness.push(childrenB[n]['filterID']);
                this._curBusiness.push(childrenC[o]['filterID']);
                break;
              }
              childrenD = childrenC[o]['children'];
              for (let p = 0; p < childrenD.length; p++) {
                if (childrenD[p]['filterID'] === business['filterID']) {
                  this._curBusiness.push(this._curFilter['businessids'][j]['filterID']);
                  this._curBusiness.push(children[k]['filterID']);
                  this._curBusiness.push(childrenA[m]['filterID']);
                  this._curBusiness.push(childrenB[n]['filterID']);
                  this._curBusiness.push(childrenC[o]['filterID']);
                  this._curBusiness.push(childrenD[p]['filterID']);
                  break;
                }
                childrenE = childrenD[p]['children'];
                for (let q = 0; q < childrenE.length; q++) {
                  if (childrenE[q]['filterID'] === business['filterID']) {
                    this._curBusiness.push(this._curFilter['businessids'][j]['filterID']);
                    this._curBusiness.push(children[k]['filterID']);
                    this._curBusiness.push(childrenA[m]['filterID']);
                    this._curBusiness.push(childrenB[n]['filterID']);
                    this._curBusiness.push(childrenC[o]['filterID']);
                    this._curBusiness.push(childrenD[p]['filterID']);
                    this._curBusiness.push(childrenE[q]['filterID']);
                    break;
                  }
                }
              }
            }
          }
        }
      }
    }

    // this._bDisableSubmitButton = business.bDisabled === 1 ? true : false;
  }

  //
  // Filter 1
  //

  filter1Change(event) {
    const selectedFilterItem = this._curFilter['filter1'].filter(item => item.filterID === event)[0];
    if (selectedFilterItem.hasOwnProperty('bHasDependency') && selectedFilterItem['bHasDependency'] === 1) {

      this._mymaxService.getLinkedFilter2Data(selectedFilterItem.filterID,
        this._curFilter['node_uuid'],
        this._curFilter,
        this.sessionUser.P6_userUID)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          // do nothing
        });

      // this._mymaxService.getLinkedFilter2Data(
      //   selectedFilterItem.filterID,
      //   this._curFilter['node_uuid'],
      //   this._curFilter,
      //   this._authService._sessionUser.P6_userUID
      // ).takeUntil(this.ngUnsubscribe).subscribe();
    }
  }

  filter2DataChanged() {
    this._curFilter['filter2'] = this._mymaxService._filter2Data;
  }

  //
  // Emit Handler
  //

  setSurveyByName(event) {
    const selectedFilterItem = this._curFilter['surveyIds'].filter(item => item.filterID.toString() === event.toString())[0];
    this._curFilter.iFromMonth = selectedFilterItem.iMonth;
    this._curFilter.iFromYear = selectedFilterItem.iYear;
  }

  myMaxFilterChanged() {

    this._bShowFilter = this._mymaxService._bShowFilter;
    // this._myMaxFilter = this._mymaxService._myMaxFilter;
    // this._curFilter = JSON.parse(JSON.stringify(this._mymaxService._myMaxFilter));
    //
    let _keepGoing = true;

    this._curFilter['businessids'].forEach(bisA => {
      if (bisA['filterID'] === this._curFilter['businessId']) {
        this._curFilter['businessLabel'] = bisA['filterLabel'];
        _keepGoing = false;
      } else if (_keepGoing) {
        bisA['children'].forEach(bisB => {
          if (bisB['filterID'] === this._curFilter['businessId']) {
            this._curFilter['businessLabel'] = bisB['filterLabel'];
            _keepGoing = false;
          } else if (_keepGoing) {
            bisB['children'].forEach(bisC => {
              if (bisC['filterID'] === this._curFilter['businessId']) {
                this._curFilter['businessLabel'] = bisC['filterLabel'];
                _keepGoing = false;
              } else if (_keepGoing) {
                bisC['children'].forEach(bisD => {
                  if (bisD['filterID'] === this._curFilter['businessId']) {
                    this._curFilter['businessLabel'] = bisD['filterLabel'];
                    _keepGoing = false;
                  } else if (_keepGoing) {
                    bisC['children'].forEach(bisE => {
                      if (bisD['filterID'] === this._curFilter['businessId']) {
                        this._curFilter['businessLabel'] = bisE['filterLabel'];
                        _keepGoing = false;
                      } else if (_keepGoing) {
                        bisC['children'].forEach(bisF => {
                          if (bisD['filterID'] === this._curFilter['businessId']) {
                            this._curFilter['businessLabel'] = bisF['filterLabel'];
                            _keepGoing = false;
                          } else if (_keepGoing) {
                            bisC['children'].forEach(bisG => {
                              if (bisD['filterID'] === this._curFilter['businessId']) {
                                this._curFilter['businessLabel'] = bisG['filterLabel'];
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
    // this.filterReset(this._bResetFilter);

    this._curBusiness = [];
    this._curBusiness.push(this._curFilter['businessId']);

    // Single/Comparative
    if (this._curFilter['node_bShowDateFilters']) {
      // set from months
      if (this._curFilter['from_dates'].length !== 0) {
        this.fromYearChanged(this._curFilter['iFromYear']);
      }
    }

    // Story Board
    if (this._curFilter['node_bShowOnlyTrendView']) {
      this._curFilter['currentView'] = 'Comparative View';
    }

    // this.search();
  }

  search() {
    this._loaderService.initLoader(true);

    // update mymax filter on service
    // this._myMaxFilter = JSON.parse(JSON.stringify(this._curFilter));
    // this._mymaxService._myMaxFilter = this._curFilter;
    this._mymaxService.updateFilterPrefix();

    // this._mymaxService._myMaxFilterSearchChanged.emit();
    // close mobile nav
    // this._authService._closeFilter.emit();
    this.modalController.dismiss(this._curFilter);

    this.hideMonthFilter();
  }

  // Hide Month Filter
  hideMonthFilter() {
    this._bHideMonthFilterSW = false;
    this._bHideMonthFilterTW = false;

    if (this._mymaxService._myMaxFilter['currentViewSection'] === 'summary') {
      if (this._mymaxService._myMaxFilter['ss_bHideMonthFilter'] === true ||
        (this._mymaxService._myMaxFilter['ss_bHideMonthFilter']).toString() === 'YES') {
        this._bHideMonthFilterSW = true;
        this._mymaxService._myMaxFilter['sFromMonth'] = '';
      }
    } else if (this._mymaxService._myMaxFilter['currentViewSection'] === 'detailed') {
      if (this._mymaxService._myMaxFilter['sd_bHideMonthFilter'] === true ||
        (this._mymaxService._myMaxFilter['sd_bHideMonthFilter']).toString() === 'YES') {
        this._bHideMonthFilterSW = true;
      }
    }

    if (this._mymaxService._myMaxFilter['currentViewSection'] === 'summary') {
      if (this._mymaxService._myMaxFilter['ts_bHideMonthFilter'] === true ||
        (this._mymaxService._myMaxFilter['ts_bHideMonthFilter']).toString() === 'YES') {
        this._bHideMonthFilterTW = true;
        this._mymaxService._myMaxFilter['sToMonth'] = '';
      }
    } else if (this._mymaxService._myMaxFilter['currentViewSection'] === 'detailed') {
      if (this._mymaxService._myMaxFilter['td_bHideMonthFilter'] === true ||
        (this._mymaxService._myMaxFilter['td_bHideMonthFilter']).toString() === 'YES'
      ) {
        this._bHideMonthFilterTW = true;
      }
    }


  }


}