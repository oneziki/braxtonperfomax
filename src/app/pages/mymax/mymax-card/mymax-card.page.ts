import {
  Component, OnInit, OnDestroy, AfterViewInit,
  Input, Output, EventEmitter,
  ElementRef, ViewChild, ViewEncapsulation
} from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AuthService, MyMax7Service, LoaderService } from '../../../_services/index';
import { MyMaxFilter, MyMaxTemplateMenu } from '../../../_models';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import html2canvas from 'html2canvas';
import { MyMaxPopComponent } from "../../../components/popovers/mymax-pop/mymax-pop.component";

@Component({
  selector: 'app-mymax-card',
  templateUrl: './mymax-card.page.html',
  styleUrls: ['./mymax-card.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MyMaxCardPage implements AfterViewInit, OnInit, OnDestroy {
  private ngUnsubscribe: Subject<any> = new Subject<any>();
  private themeSubscription: Subscription;
  private subscriptionPrinter: Subscription;
  private subscriptionToggle: Subscription;
  private summaryTrigger: Subscription;
  private detailedTrigger: Subscription;

  _envTheme: object;

  @ViewChild('graphCard') graphCard: ElementRef;

  _graphCardHeight = 0;
  _graphCardWidth = 0;
  _graphType: string;
  _showLegend = false;
  _showInfo = false;
  _bShowInfoButton = false;
  _hoverInfo = false;
  _trendInfo = [];
  _bShowLegend = true;
  _flSelect = 'All';
  _listGraphs = ['RadialList', 'pieList'];

  _downloadingImage = false;
  _downloadingImageItem: string;
  _selectedNode: MyMaxTemplateMenu;
  _myMaxFilter: MyMaxFilter;
  _componentData = [];

  @Input() _loaderTimer;
  @Input() forColPrint;
  @Input() forPrint;
  @Input() forModal;
  @Input() printData;
  @Input() data;
  @Input() filter: MyMaxFilter;
  @Output() componentViewHandler: EventEmitter<any> = new EventEmitter<any>();
  @Output() componentModalHandler: EventEmitter<any> = new EventEmitter<any>();

  legendEmitter = new EventEmitter();
  downloadEmitter = new EventEmitter();

  constructor (
    public _authService: AuthService,
    private _mymaxService: MyMax7Service,
    private popover: PopoverController,
    private _loaderService: LoaderService) {
    this.legendEmitter.subscribe(info => { this._bShowLegend = info['_bShowLegend']; this._showLegend = info['_showLegend']; });
    this.downloadEmitter.subscribe(data => { this.triggelMyMaxPodImage(data); });
    this.summaryTrigger = this._mymaxService._myMaxSummaryTrigger.subscribe(value => this.showSummary());
    this.detailedTrigger = this._mymaxService._myMaxDetailedTrigger.subscribe(value => this.reverseStepThrough());
  }

  ngOnInit() {
    this._envTheme = this._authService['_envTheme'];

    if (this.data['visualSettings'][this.filter['viewPrefix'] + 'sGraphTypes'] === 'PieList') {
      this.data['visualSettings'][this.filter['viewPrefix'] + 'sGraphTypes'] = 'pieList'
    }

    this._graphType = this.data['visualSettings'][this.filter['viewPrefix'] + 'sGraphTypes'];

    // legend visibility
    const that = this;
    setTimeout(() => {
      Object.keys(that.data['visualSettings']).forEach(function (item) {
        if (that.data['visualSettings'][item] === 'YES' || that.data['visualSettings'][item] === true) {
          that.data['visualSettings'][item] = 'true';
          that.data['visualSettings'][item] = JSON.parse(that.data['visualSettings'][item]);
        }
        if (that.data['visualSettings'][item] === 'NO' || that.data['visualSettings'][item] === false) {
          that.data['visualSettings'][item] = 'false';
          that.data['visualSettings'][item] = JSON.parse(that.data['visualSettings'][item]);
        }
        if (that.data['visualSettings'][that.filter['viewPrefix'] + 'bShowLegend'] !== '') {
          if (item === that.filter['viewPrefix'] + 'bShowLegend') {
            that._bShowLegend = that.data['visualSettings'][item];
          }
        }
        if (item === that.filter['viewPrefix'] + 'bShowInfoButton') {
          that._bShowInfoButton = that.data['visualSettings'][item];
        }
      });

      const basicData = JSON.parse(JSON.stringify(that.data['data']));
      that.data['besicData'] = JSON.parse(JSON.stringify(basicData));

    }, 1);
  }

  ngAfterViewInit() {
    if (this.data['data'].length && this.filter['viewPrefix'][0] === 't') {

      let i = 0;
      let ii = 0;

      if (this.data['data'][0].length !== undefined) {
        this.data['data'][0].forEach(item => {
          if (i > 0 && (typeof item === 'string' || item instanceof String)) {
            this._trendInfo.push({ label: item });
          }
          if (item['role'] && item['role'] === 'certainty' && this.data['data'][1] && this.data['data'][1][i]) {
            this._trendInfo[ii]['certainty'] = this.data['data'][1][i];
            ii++;
          }
          i++;

        });
      }
    }

    this.onResize();
  }

  ngOnDestroy() {
    // this.ngUnsubscribe.next();
    // this.ngUnsubscribe.complete();
    // this.themeSubscription.unsubscribe();
    // this.subscriptionToggle.unsubscribe();
    // this.subscriptionPrinter.unsubscribe();
    this.summaryTrigger.unsubscribe();
    this.detailedTrigger.unsubscribe();
  }

  async CreatePopover(ev: any) {
    let popoverInfo = {
      _showLegend: this._showLegend,
      _bShowLegend: this._bShowLegend,
      _showInfo: this._showInfo,
      _bShowInfoButton: this._bShowInfoButton,
      _hoverInfo: this._hoverInfo,
      _graphCardHeight: this._graphCardHeight
    };

    const pop = await this.popover.create({
      component: MyMaxPopComponent,
      cssClass: 'my-custom-class',
      showBackdrop: false,
      backdropDismiss: true,
      event: ev,
      componentProps: {
        'data': this.data,
        'filter': this.filter,
        'popoverInfo': popoverInfo,
        'legendEmitter': this.legendEmitter,
        'downloadEmitter': this.downloadEmitter,
        'componentViewHandler': this.componentViewHandler
      }
    });
    return await pop.present();
  }

  setEnvTheme() {
    this._envTheme = this._authService['_envTheme'];
  }

  onResize() {
    setTimeout(() => {
      if (this.graphCard && this.graphCard.nativeElement) {
        this._graphCardHeight = this.graphCard.nativeElement.offsetHeight;
      } else {
        this._graphCardHeight = 200;
      }
      this._graphCardWidth = this.graphCard.nativeElement.offsetWidth;
    }, 1000);
  }

  showDetailed() {
    const componentData = { 'currentViewSection': 'detailed', 'MymaxTemplateMenuComponentUID': this.data.MymaxTemplateMenuComponentUID };
    this.componentViewHandler.emit(componentData);
  }

  showSummary() {
    this.filter.currentViewSection = 'summary';
    this.filter.detailed_stepThroughValue = '';
    this.filter.summary_stepThroughValue = '';
    const componentData = { 'currentViewSection': 'summary', 'MymaxTemplateMenuComponentUID': this.data.MymaxTemplateMenuComponentUID };
    // this._mymaxService.dataTableFilterChanged(this.filter);
    this.componentViewHandler.emit(componentData);
  }

  reverseStepThrough() {
    this.filter.detailed_stepThroughValue = '';
    this.filter.viewPrefix = 'sd_';

    const componentData = { 'currentViewSection': 'detailed', 'MymaxTemplateMenuComponentUID': this.data.MymaxTemplateMenuComponentUID };
    this.componentViewHandler.emit(componentData);
  }

  triggelMyMaxPodImage(data) {
    this._mymaxService.triggerMyMaxPodDownload(data['MymaxTemplateMenuComponentUID']);
  }

  mymaxHandler(componentData) {
    this.componentViewHandler.emit(componentData);
  }

  showModal(event) {
    this.componentModalHandler.emit();
  }



}
