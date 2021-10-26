import {
  Component, ViewEncapsulation,
  OnInit, AfterViewInit, Input, Output, EventEmitter,
  ElementRef, ViewChild, ViewChildren, QueryList, OnDestroy
} from '@angular/core';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { AuthService, MyMax7Service } from '../../../../_services/index';
import { MyMaxFilter } from '../../../../_models';

import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
// '../../../../../assets/icon/icofont/css/icofont.scss'
export class ActionTableComponent implements OnInit, AfterViewInit, OnDestroy {
  private ngUnsubscribe: Subject<any> = new Subject<any>();
  private themeSubscription: Subscription;
  private subscriptionToggle: Subscription;
  private subscriptionPrinter: Subscription;

  _envTheme: object;
  rowGroup: any;

  @ViewChildren(DataTableDirective)
  dtElements: QueryList<any>;

  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;

  @ViewChild('tableWrapper') tableWrapper: ElementRef;
  @ViewChild('tableUno') tableUno: ElementRef;

  @Input() forPrint;
  @Input() data;
  @Input() filter: MyMaxFilter;
  @Output() graphClickHandler: EventEmitter<any> = new EventEmitter<any>();
  @Output() dtTableFilterChanged: EventEmitter<any> = new EventEmitter<any>();

  _wrapperWidth: number;
  _tableWidth: number;

  _dtOptionsA: DataTables.Settings = {};
  _dtOptionsB: DataTables.Settings = {};

  _currentSort = [];
  _tmpData = [];
  _daulTable = false;
  _tableBuilt = false;

  constructor (public _authService: AuthService, private _mymaxService: MyMax7Service) {
    this.themeSubscription = this._authService._envThemeChanged.subscribe(value => this.setEnvTheme());
    // this.subscriptionToggle = this._authService._defaultMenuToggle.subscribe(value => this.onResize());
    // this.subscriptionPrinter = this._mymaxService._myMaxPrinterChanged.subscribe(value => this.onResize());
  }

  ngOnInit() {
    this._envTheme = this._authService['_envTheme'];
    this.setTableData();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.themeSubscription.unsubscribe();
    // this.subscriptionToggle.unsubscribe();
  }

  ngAfterViewInit(): void {

    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {

      dtElement.dtOptions['paging'] = false;

      dtElement.dtInstance.then((dtInstance: any) => {
        const that = this;
        if (this._daulTable === true) {
          $('.table-uno th').on('click', function () {

            if (index === 0) {
              that._dtOptionsA['order'] = dtInstance.table().order();
            }
            if (index === 1) {
              that._dtOptionsB['order'] = that._dtOptionsA['order'];
              dtInstance.order(that._dtOptionsA['order']).draw();
            }

          });
        }

        let those = this;
        $('.podTable tr th').each(function (index) {
          if (those._dtOptionsA['orderFixed'] && those._dtOptionsA['orderFixed'][0] === index) {
            // No sorting
          } else {
            $(this).html("<span class='arrowFinder'>" + $(this).text() + "</strong>");
          }

        });

        $('.table-uno tr').each(function (index) {
          // COLUMN ONE
          if ($(this).find('td').eq(0).text() === 'Overall Result' || $(this).find('td').eq(0).text() === 'Average') {
            $(this).find('td').eq(0).html("<strong>" + $(this).find('td').eq(0).html() + "</strong>");
          }
          // COLUMN TWO
          if ($(this).find('td').eq(1).text() === 'Overall Result' || $(this).find('td').eq(1).text() === 'Average') {
            $(this).find('td').eq(1).html("<strong>" + $(this).find('td').eq(1).html() + "</strong>");
          }
        });

        // On redraw set Column Widths
        dtInstance.on('draw.dt', function () {
          if (dtInstance.rowsgroup) {
            dtInstance.rowsgroup.update();
          }
          that.getDOMSize();
        });

        this.getDOMSize();
      });
    });

    setTimeout(() => {
      let i = 0;
      // console.log('_dtOptionsA:: ', this._dtOptionsA);
      if (this._dtOptionsA && this._dtOptionsA['columns']) {
        this._dtOptionsA['columns'].forEach(col => {
          if (col['detectCentered']) {
            $('.' + this.data['MymaxTemplateMenuComponentUID'] + '-A').each(function (index) {
              $(this).find('thead tr th:eq(' + i + ')').addClass('text-center');
            });
          }
          i++;
        });
      }
    }, 400);
  }

  setEnvTheme() {
    this._envTheme = this._authService['_envTheme'];
  }

  onResize() {
    this._tableBuilt = false;
    this.setTableData();
    setTimeout(() => {
      this.getDOMSize();
    }, 150);
  }

  getDOMSize() {
    this._wrapperWidth = this.tableWrapper.nativeElement.offsetWidth;
    setTimeout(() => {
      this.setColumnWidths();
      setTimeout(() => {
        this.setColumnWidths();
      }, 150);
    }, 150);
  }

  setTableData() {
    this._tableBuilt = false;

    if (this.data['fixedRow'] && this.data['fixedRow'].length) {
      this._daulTable = true;

      this._dtOptionsA = this.getTableData(true);
      this._dtOptionsB = this.getTableData(false);
    } else {
      this._dtOptionsA = this.getTableData(false);
    }

    this._tableBuilt = true;
  }

  getTableData(isHeaderRow) {

    let tableData = {};
    tableData = JSON.parse(JSON.stringify(this.data));

    if (isHeaderRow) {
      tableData['data'] = this.data.fixedRow;
      tableData['columns'].forEach(col => {
        col['bStepThrough'] = false;
      });
    }

    if (this.filter['currentViewSection'] === 'detailed') {
      tableData['lengthMenu'] = [
        [-1, 100, 50, 25, 10],
        ['All Rows', '100 Rows', '50 Rows', '25 Rows', '10 Rows']
      ];
    } else {
      tableData['lengthMenu'] = [
        [10, 25, 50, 100, -1],
        ['10 Rows', '25 Rows', '50 Rows', '100 Rows', 'All Rows']
      ];
    }

    const i = 0;
    let iCol = 0;
    const colorType = this.data['visualSettings'][this.filter['viewPrefix'] + 'sGraphTypes'];
    const that = this;

    tableData['columns'].forEach(item => {

      item['detectCentered'] = false;

      if (item['bBold'] === true) {
        item['detectCentered'] = true;
        item['bCentered'] = false;
        item['render'] = function (data, type, row) {
          return '<strong class="bBold">' + data + '</strong>';
        };
      }

      if (item['bStepThrough'] === true) {
        item['render'] = function (data, type, row) {
          return '<a href="javascript:;" class="link-through mobile-view"><i class="icofont icofont-caret-right text-primary"></i>' + data + '</a>';
        };
      }

      if (item['bCentered'] === true) {
        item['detectCentered'] = true;
        item['render'] = function (data, type, row) {
          return '<p class="text-center">' + data + '</p>';
        };
      }

      if (item['bBlank'] === true) {
        item['detectCentered'] = true;
        item['render'] = function (data, type, row) {
          return '<p class="text-transparent-impo">' + data + '</p>';
        };
      }

      if (item['bDisplayColour'] && tableData['data'][i][item['data']] && tableData['data'][i][item['data']]['color']) {
        item['render'] = function (data, type, row) {
          if (colorType === 'DatagridBar') {
            if (iCol === 0 || that.filter['currentViewSection'] !== 'detailed') {
              const barEl = '<div class="progressWrapper">' +
                '<span class="progressScore d-inline-block m-r-5">' + data.label + '</span>' +
                '<div class="progress d-inline-block">' +
                '<div aria-valuemax="100" aria-valuemin="0" class="progress-bar bg-c-blue" role="progressbar" style="width:' + data.label + ';background: ' + data.color + ';">' +
                '</div>' +
                '</div>' +
                '</div>';
              return barEl;
            } else {
              item['detectCentered'] = true;
              return '<p class="text-center">' + data.label + '</p>';
            }
          }
          if (colorType === 'DatagridColorDotLabel') {
            item['detectCentered'] = false;
            return '<span class="color-dot" style="background: ' + data.color + ';"></span>' + data.label;
          } else {
            if (data.color === '#00FFFF00') {
              item['detectCentered'] = true;
              return '<p class="text-center">' + data.label + '</p>';
            }

            if (that._envTheme['skin'] === 'BarOne') {
              item['detectCentered'] = true;
              return '<strong class="d-block fs-16 fw-600 text-center" style="color: ' + data.color + ';">' + data.label + '</strong>';
            } else {
              item['detectCentered'] = true;
              return '<label class="label" style="background: ' + data.color + ';">' + data.label + '</label>';
            }
          }
        };
      }

      if (item['bDisplayIcon'] === true) {
        item['render'] = function (data, type, row) {
          if (data['label'].length) {
            return '<strong>' + data['label'] + '<br><i class="icofont ' + data['sIconLabel']['icon'] + ' fs-14 m-r-5"></i><span class="fw-400 p-l-10">' + data['sIconLabel']['text'] + '</span></strong>';
          } else {
            return data['sIconLabel']['text'] + ' <i class="icofont ' + data['sIconLabel']['icon'] + ' arrowColor fs-14 m-r-5"></i> ';
          }
        };
      }

      iCol++;
    });

    let orderCol = 0;
    const orderType = tableData['visualSettings'][this.filter['viewPrefix'] + 'sOrderingType'];

    if (this.forPrint) {
      tableData['rowsGroup'] = [];
    }

    if (tableData['rowsGroup'] && tableData['rowsGroup'].length) {
      if (orderType === 'High to Low' || orderType === 'Low to High') {
        for (let iDataCol = 0; iDataCol < tableData['columns'].length; iDataCol++) {
          if (tableData['columns'][iDataCol]['data'] === 'fScore1') {
            orderCol = iDataCol;
            break;
          }
        }
      } else if (orderType === 'Alphabetical') {
        for (let iDataCol = 0; iDataCol < tableData['columns'].length; iDataCol++) {
          if (tableData['columns'][iDataCol]['data'] === 'sLabel1') {
            orderCol = iDataCol;
            break;
          }
        }
      }
    }

    let blockOrderFixed = false;
    if (tableData['columns'][orderCol]['bSort']) {
      blockOrderFixed = true;
    }

    tableData['autoWidth'] = false;
    tableData['order'] = [];

    if (isHeaderRow || this.filter.currentViewSection === 'summary') {
      tableData['searching'] = false;
      tableData['paging'] = false;
      tableData['ordering'] = false;
      tableData['info'] = false;
    }
    if (!isHeaderRow && this.filter.currentViewSection === 'detailed') {
      tableData['searching'] = true;
      tableData['paging'] = true;
      tableData['ordering'] = true;
      tableData['info'] = true;
      if (!blockOrderFixed && tableData['rowsGroup'] && tableData['rowsGroup'].length) {
        if (orderType === 'High to Low') {
          tableData['orderFixed'] = [orderCol, 'desc'];
        }
        if (orderType === 'Low to High') {
          tableData['orderFixed'] = [orderCol, 'asc'];
        }
      }
    }
    if (isHeaderRow && this.filter.currentViewSection === 'detailed') {
      tableData['ordering'] = true;
    }

    tableData['rowCallback'] = (row: Node, data: any[] | Object, index: number) => {
      const self = this;
      if (this.getStepThroughStatus(data)) {
        // Unbind first in order to avoid any duplicate handler
        $('a.link-through', row).unbind('click');
        $('a.link-through', row).bind('click', () => {
          self.goClickThrough(data);
        });
      }
      return row;
    };

    // console.log('getTableData:: ', isHeaderRow, tableData);
    return tableData;
  }

  setColumnWidths() {
    const _debug = false;

    if (this._daulTable === true) {
      this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
        dtElement.dtInstance.then((dtInstance: any) => {
          const that = this;
          if (_debug) { console.log('setColumnWidths:: ', this.data['MymaxTemplateMenuComponentUID']); }
          $('.forDash .' + this.data['MymaxTemplateMenuComponentUID'] + '-B th').each(function (i, val) {

            const colA = $('.forDash .' + that.data['MymaxTemplateMenuComponentUID'] + '-A th')[i];
            const colB = $('.forDash .' + that.data['MymaxTemplateMenuComponentUID'] + '-B th')[i];
            let widthA = colA.offsetWidth;
            let widthB = colB.offsetWidth;

            if (_debug) {
              console.log(index, 'widthA:: ', widthA, 'widthB:: ', widthB);
              console.log(index, 'widthA:: ', colA);
              console.log(index, 'widthB:: ', colB);
            }


            if (_debug) { console.log('attr colspan:: ', $(colA).attr('colspan')); }
            if ($(colA).attr('colspan') === '1') {
              if (widthA >= widthB) {
                val.style.width = widthA + 'px';
                val.style.minWidth = widthA + 'px';
                colA.style.width = widthA + 'px';
                colA.style.minWidth = widthA + 'px';

                if (_debug) {
                  widthA = colA.offsetWidth;
                  widthB = colB.offsetWidth;
                  console.log(index, 'set A:: ', widthA, 'widthB:: ', widthB);
                  console.log(index, 'widthA:: ', colA);
                  console.log(index, 'widthB:: ', colB);
                }
              } else {
                val.style.width = widthB + 'px';
                val.style.minWidth = widthB + 'px';
                colA.style.width = widthB + 'px';
                colA.style.minWidth = widthB + 'px';

                if (_debug) {
                  widthA = colA.offsetWidth;
                  widthB = colB.offsetWidth;
                  console.log(index, 'widthA:: ', widthA, 'set B:: ', widthB);
                  console.log(index, 'widthA:: ', colA);
                  console.log(index, 'widthB:: ', colB);
                }
              }
            }

          });
        });
      });
    }

    this._tableWidth = this.tableUno.nativeElement.offsetWidth;
  }

  getStepThroughStatus(rowData) {
    let i = 0;
    let bStepThrough = false;
    let colName = '';

    for (i = 0; i < this.data['columns'].length; i++) {
      colName = this.data['columns'][i]['data'];
      if (rowData.hasOwnProperty(colName) && this.data['columns'][i]['bStepThrough']) {
        bStepThrough = true;
        break;
      }
    }
    return bStepThrough;
  }

  goClickThrough(data) {
    let i = 0;
    let colName = '';
    let stepThroughValue = '';
    for (i = 0; i < this.data['columns'].length; i++) {
      colName = this.data['columns'][i]['data'];
      if (data.hasOwnProperty(colName) && this.data['columns'][i]['bStepThrough']) {
        stepThroughValue = data[colName];
        if (this.data.visualSettings.sds_sLayout && (this.data.visualSettings.sds_sLayout === 'Custom Layout' || this.data.visualSettings.sds_sLayout === 'Combined Layout')) {
          this.filter['sEmployeeNumber'] = data['sLabel3'];
        }
        break;
      }
    }

    if (this.filter.currentViewSection === 'summary') {

      if (this.data.visualSettings.ss_bSkipDetailedView || this.data.visualSettings.ts_bSkipDetailedView) {
        this.filter.detailed_stepThroughValue = stepThroughValue;
        this.filter.summary_stepThroughValue = ''; // ensure this value is empty for the graph click through

      } else {
        this.filter.detailed_stepThroughValue = ''; // ensure this value is empty for the graph click through
        this.filter.summary_stepThroughValue = stepThroughValue;
      }

    } else if (this.filter.currentViewSection === 'detailed') {
      this.filter.detailed_stepThroughValue = stepThroughValue;
    }

    this._mymaxService['_sCurrentView'] = this.filter['viewPrefix']

    const componentData = { 'currentViewSection': 'detailed', 'MymaxTemplateMenuComponentUID': this.data.MymaxTemplateMenuComponentUID };
    this.graphClickHandler.emit(componentData);
  }
}
