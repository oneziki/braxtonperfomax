import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { AuthService, PersonalPortfolioService, LoaderService } from '../../../../_services';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PrintToolContent } from '../../print-tool';

@Component({
  selector: 'app-pt-layout-personal-portfolio',
  templateUrl: './pt-layout-personal-portfolio.component.html',
  styleUrls: ['./pt-layout-personal-portfolio.component.scss']
})
export class LayoutPersonalPortfolioComponent implements OnInit, OnDestroy {

  @Input() _coverData = {};
  @Input() _contentData: PrintToolContent;
  @Output() backHandler: EventEmitter<any> = new EventEmitter<any>();

  _navStatus = '';
  iMaxValue = 4;
  progressCols = [1, 2, 3, 4];

  _monthlyChart = '';
  _sectionChart = '';
  _sectionCrewChart = '';
  _siteChart = '';
  _classificationChart = '';
  _agencyChart = '';
  _companyChart = '';

  sectionA = 1;
  sectionB = 2;
  sectionC = 3;
  sectionD = 4;
  sectionE = 5;

  _options = {
    legend: { position: 'none' },
    vAxis: {
      viewWindow: {
        min: 0,
        max: 10
      }
    },
    hAxis: {
      textStyle: {
        fontSize: 10,
        color: '#4d5154'
      },
      maxTextLines: 4, // maximum number of lines to wrap to
      maxAlternation: 1, // maximum layers of labels (setting this higher than 1 allows labels to stack over/under each other)
      minTextSpacing: 1 // minimum space in pixels between adjacent labels
    },
    chartArea: {
      left: 25,
      right: 25
    },
    bar: { groupWidth: '40' },
    seriesType: 'bars',
    series: {
      0: {
        type: 'line',
        color: 'grey'
      }
    }
  };

  public monthlyChart: any = {
    chartType: 'ColumnChart',
    dataTable: [],
    options: this._options
  };
  private readonly onDestroy = new Subject<void>();

  constructor (
    public _authService: AuthService,
    public _personalPortfolioService: PersonalPortfolioService,
    private _loaderService: LoaderService
  ) {
  }

  ngOnInit() {
    this._navStatus = this._authService['_verticalNavType'];

    if (this._contentData['OverallData']['monthlyScoreCardData'] && this._contentData['OverallData']['monthlyScoreCardData']['iMaxScore']) {
      this._options['vAxis']['viewWindow']['max'] = this._contentData['OverallData']['monthlyScoreCardData']['iMaxScore'];
    }

    this.monthlyChart['dataTable'] = this._contentData['OverallData']['monthlyScoreCard'];

    if (this._contentData['PerformanceData']['kraOverall'].length === 0
      && this._contentData['OverallData']['monthlyScoreCard'].length === 0) {
      this.sectionB = this.sectionB - 1;
      this.sectionC = this.sectionC - 1;
      this.sectionD = this.sectionD - 1;
      this.sectionE = this.sectionE - 1;
    }

    if (this._contentData['CompetencyData']['competencyOverall'].length === 0
      && this._contentData['ExpertiseData']['expertiseOverall'].length === 0
      && this._contentData['CareerAsipirationsData'].length === 0) {
      this.sectionC = this.sectionC - 1;
      this.sectionD = this.sectionD - 1;
      this.sectionE = this.sectionE - 1;
    }


    if (this._contentData['MotivationData'].length === 0) {
      this.sectionD = this.sectionD - 1;
      this.sectionE = this.sectionE - 1;
    }

    if (this._contentData['PerformanceFeedbackData'].length === 0) {
      this.sectionE = this.sectionE - 1;
    }
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  goBack(): void {
    this.backHandler.emit();
  }


  printPDFReport(): void {
    this._loaderService.initLoader(true);
    this._personalPortfolioService.printPersonalPortfolio(this._contentData['UserData']['userUUID'])
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._loaderService.exitLoader();
      });
  }
}

