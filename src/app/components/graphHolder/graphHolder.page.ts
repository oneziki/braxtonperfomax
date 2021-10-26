import {
  OnInit,
  Component,
  Output,
  EventEmitter,
  Input,
  AfterViewInit
} from '@angular/core';
import { MyMaxFilter } from '../../_models';
import * as apexChart from 'apexcharts';

@Component({
  selector: 'app-graphHolder',
  templateUrl: './graphHolder.page.html',
  styleUrls: ['./graphHolder.page.scss'],
})
export class GraphHolderPage implements OnInit, AfterViewInit {

  @Input() type: any;
  @Input() data: any;
  @Input() data2: any;
  @Input() options: any;

  @Input() graphData;
  @Input() filter: MyMaxFilter;

  @Input() graphHeight = 0;
  @Input() graphWidth = 0;
  @Output() podHolderHandler: EventEmitter<any> = new EventEmitter<any>();



  _debug = false;
  _isApex = false;
  _currentWindowHeight = 0;
  _currentWindowWidth = 0;

  _graphMessage = '';

  chartOptions = {
    series: [],
    colors: [],
    labels: [],
    noData: {
      text: '*No data to display..',
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: 0,
      style: {
        color: 'var(--lite-grey)',
        fontSize: '14px',
        fontFamily: undefined
      }
    },
    chart: {
      height: 250,
      type: '',
    },
    plotOptions: {
      polarArea: {
        rings: {
          strokeWidth: 0
        },
        spokes: {
          strokeWidth: 0
        },
      },
      pie: {
        dataLabels: {
          offset: -5,
        },
        donut: {
          // size: '55%',
          labels: {
            show: false
          }
        }
      },
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 360,
        hollow: {
          margin: 5,
          size: "30%",
          background: "transparent"
        },
        dataLabels: {
          name: {
            show: true,
            offsetY: 5
          },
          value: {
            show: false
          }
        }
      },
    },
    dataLabels: {
      enabled: true
    },
    fill: {
      opacity: 1
    },
    legend: {
      show: false,
      floating: false,
      fontSize: '14px',
      offsetX: 50,
      offsetY: 10,
      labels: {
        useSeriesColors: true,
      },
      horizontalAlign: 'center',
      itemMargin: {
        // horizontal: 15,
        vertical: 10
      },
      markers: {
        width: 8,
        height: 8
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            show: false,
          },
        },
      },
    ],
    tooltip: {
      enabled: false,
      y: {
        title: {
          formatter: (seriesName) => seriesName,
        },
      },
    }
  };


  constructor () { }

  ngOnInit() {
    if (this.data) {
      this.data['id'] = Math.floor((Math.random() * 100000) + 1);
    }

    if (this.data['series'] && this.data['series'].length === 0 && this.data['labels'].length === 0 && this.type !== 'apex' || this.data.constructor === Array && this.data['series'] === undefined) {
      this._graphMessage = '*No data to display...';
    }

    this._currentWindowHeight = window.innerHeight;
    this._currentWindowWidth = window.innerWidth;

    this.type === 'Radial' ? this.type = 'radialbar' : '';

    // const arrGoogles = ['Radial', 'Bar', 'BarStacked', 'Scatter', 'Column', 'ColumnStacked', 'Combo', 'ComboStacked', 'Line', 'LineArea', 'AreaStacked', 'AreaStackedFilter', 'Pie', 'PieList', 'Donut', 'HalfDonut', 'ColumnDiff', ];
    const arrGoogles = ['apex', 'radial', 'radialbar', 'circle', 'bar', 'barstacked', 'scatter', 'column', 'columnstacked', 'combo', 'combostacked', 'line', 'linearea', 'areastacked', 'areastackedfilter', 'pie', 'pielist', 'donut', 'halfdonut', 'columndiff',];

    if (arrGoogles.indexOf(this.type.toLowerCase()) > -1) {
      this._isApex = true;
    }

    this._debug ? console.log('GraphHolderPage data:: ', this.data) : '';
  }

  ngAfterViewInit() {
    this._debug ? console.log('ngAfterViewInit:I: ', this.data['id'], this.type, this._isApex, this.data) : '';

    // 
    // MyMax Charts
    // 
    if ((this.data['apexData'] && this.type) && this._isApex) {
      this._debug ? console.log('MyMaxCharts:I: ', this.type, this.chartOptions) : '';

      if (this.data['apexData']['chartType'].toLowerCase() === 'circle' || this.data['apexData']['chartType'].toLowerCase() === 'polararea') {
        this.chartOptions['chart']['type'] = 'radialBar';
      } else if (this.data['apexData']['chartType'] === 'Radial' || this.data['apexData']['chartType'].toLowerCase() === 'radialbar') {
        this.chartOptions['chart']['type'] = 'radialBar';
      } else if (this.data['apexData']['chartType'] === 'combo') {
        this.chartOptions['chart']['type'] = 'line';
        this.chartOptions['stroke'] = {
          width: [0, 2],
          curve: 'smooth'
        }

        this.chartOptions.dataLabels.enabled = false;
        this.chartOptions.dataLabels['enabledOnSeries'] = [1];
        this.chartOptions.chart['toolbar'] = false;
        this.chartOptions['yaxis'] = { min: 0 };
        this.chartOptions['markers'] = 1;


      } else if (this.data['apexData']['chartType'].toLowerCase() === 'line') {
        this.chartOptions['chart']['type'] = 'line';
        this.chartOptions['dataLabels'] = { enabled: false };
        this.chartOptions['markers'] = { size: 0 };
        this.chartOptions['stroke'] = {
          show: true,
          curve: "smooth",
          width: 2
        };
        this.chartOptions.chart['toolbar'] = false;
        this.chartOptions['xaxis'] = {
          categories: this.data['apexData']['xaxis']['categories'],
          title: { text: "" },
          max: 12
        };
        this.chartOptions['yaxis'] = {
          title: { text: "" },
          min: 0,
          max: 5,
          tickAmount: 5
        };
        this.chartOptions['legend']['show'] = true;
        this.chartOptions['legend']['fontSize'] = '10px';
        if (this.graphHeight && this.graphHeight > 0) {
          this.chartOptions['chart']['height'] = this.graphHeight
        }

      } else {
        this.chartOptions['chart']['type'] = this.data['apexData']['chartType'].toLowerCase()
      }

      if (this.graphHeight && this.graphHeight > 50 && this.data['apexData']['chartType'].toLowerCase() !== 'line') {
        this.chartOptions['chart']['height'] = this.graphHeight
      }

      this.chartOptions['series'] = this.data['apexData']['series'];
      this.chartOptions['labels'] = this.data['apexData']['labels'];
      this.chartOptions['colors'] = this.data['apexData']['colors'];

      if (this.chartOptions['chart']['type'] === 'donut') {
        this.chartOptions['plotOptions']['pie']['donut']['labels']['show'] = true;
        this.chartOptions['dataLabels']['enabled'] = false;
        this.chartOptions['legend']['fontSize'] = '10px';
        if (this.data['series'].length !== 1) {
          this.chartOptions['plotOptions']['pie']['donut']['size'] = '55%';
          this.chartOptions['plotOptions']['pie']['customScale'] = 0.8;
        }
      }

      if (this.chartOptions['chart']['type'] === 'radialBar') {
        if (this.data['visualSettings'][this.filter['viewPrefix'] + 'sDataValue'] === 'Actual' && this.data['apexData']['series'].length === 1) {
          // Percentage= (Value/Total Value)×100
          let i = 0;
          this.chartOptions['series'].forEach(s => {
            this.chartOptions['series'][i] = (parseInt(s) / this.getMaxVal()) * 100;
            i++;
          });
        }

        if (this.data['apexData']['series'].length === 1) {
          this.chartOptions['plotOptions']['radialBar']['hollow']['size'] = '50%';
        }

        if (this.data['apexData']['series'].length > 1) {
          if (this.graphHeight && this.graphHeight < 190 || this._currentWindowWidth && this._currentWindowWidth < 190) {
            this.graphHeight = 210;
          }
          
          this.chartOptions['chart']['height'] = this.graphHeight;
          this.chartOptions['legend']['show'] = true;
          this.chartOptions['legend']['position'] = 'bottom';
          this.chartOptions['legend']['fontSize'] = '11rem';
          this.chartOptions['legend']['formatter'] = function (seriesName, opts) {
            return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
          },
          this.chartOptions['legend']['offsetX'] = 0;
          this.chartOptions['legend']['offsetY'] = -15;
          this.chartOptions['legend']['itemMargin']['vertical'] = 0;
          this.chartOptions['plotOptions']['radialBar']['endAngle'] = 270;
          this.chartOptions['plotOptions']['radialBar']['offsetY'] = 0;
          this.chartOptions['plotOptions']['radialBar']['offsetX'] = 0;
          this.chartOptions['plotOptions']['radialBar']['dataLabels']['value']['show'] = false;
          this.chartOptions['plotOptions']['radialBar']['dataLabels']['name']['show'] = false;
          this.chartOptions['plotOptions']['radialBar']['hollow']['size'] = '0%';
          this.chartOptions['tooltip']['enabled'] = true;
          this.chartOptions['tooltip']['fillSeriesColor'] = false;
        }
      }

      const ApexCharts = apexChart['default'];
      const chartElement = document.querySelector('#chart-' + this.data['id']);
      const chart = new ApexCharts(chartElement, this.chartOptions);
      chart.render();
      this._debug ? console.log('MyMaxCharts:IIA: ', this.data['id'], this.data['apexData']['chartType'], this.chartOptions) : '';

    } else if (this._isApex && this.data['chartType'] === 'pieList') {
      this.chartOptions['chart']['type'] = 'pie';
      this.chartOptions['chart']['height'] = 130;
      this.chartOptions['chart']['width'] = 100;
      this.chartOptions['tooltip']['enabled'] = true;
      this.chartOptions['tooltip']['y']['formatter'] = function (seriesName) { return seriesName + "%"; };
      this.chartOptions['dataLabels']['fontSize'] = '10px';
      this.chartOptions['dataLabels']['enabled'] = false;

      if (this.graphHeight && this.graphHeight > 0) {
        this.chartOptions['chart']['height'] = this.graphHeight
      }

      if (this.graphWidth && this.graphWidth > 0) {
        this.chartOptions['chart']['width'] = this.graphWidth
      }

      this.chartOptions['series'] = this.data['series'];
      this.chartOptions['labels'] = this.data['labels'];
      this.chartOptions['colors'] = this.data['colors'];
      const ApexCharts = apexChart['default'];
      const chartElement = document.querySelector('#chart-' + this.data['id']);
      const chart = new ApexCharts(chartElement, this.chartOptions);
      chart.render();
      this._debug ? console.log('MyMaxCharts:IIB: ', this.data['id'], this.type, this.chartOptions) : '';
    } else {
      this._debug ? console.log('MyMaxCharts:IIC: ', this.data['id'], this.type, this.data) : '';
    }

    // 
    // HOME CHARTS
    // 
    if ((this.data['series'] && this.type) && (this.type === 'apex')) {
      this._debug ? console.log('HomeChart:I: ', this.chartOptions) : '';
      const options = this.chartOptions;

      if (this.data['chartType'] === 'donut') {
        options.plotOptions.pie.donut.labels.show = true;
        options.dataLabels.enabled = false;
        options.legend.fontSize = '10px';
        if (this.data['series'].length !== 1) {
          options.plotOptions.pie.donut['size'] = '55%';
          options.plotOptions.pie['customScale'] = 0.8;
        }
      }
      if (this.data['chartType'] === 'radialBar' && this.data['series'].length !== 1) {
        options.legend.show = true;
        options.legend.fontSize = '14px';
        options.legend.offsetX = 10;
        options['chart']['height'] = 250;
        options['chart']['width'] = 250;
        options['tooltip']['enabled'] = true;
        options['tooltip']['fillSeriesColor'] = false;
      } else {
        options.legend.fontSize = '14px';
        options.plotOptions.radialBar.hollow.size = "40%"
        options.plotOptions.radialBar.endAngle = 360;
        options.plotOptions.radialBar.dataLabels.value.show = false;
      }

      options['chart']['type'] = this.data['chartType'];
      options['series'] = this.data['series'];
      options['labels'] = this.data['labels'];
      options['colors'] = this.data['colors'];
      // 
      // Extra Options
      // 
      if (this.options) {
        if (this.options['plotOptions']) {
          options['plotOptions'] = this.options['plotOptions'];

          let endAngle = 360;
          if (this.data['series'].length > 1 && this.data['series'].length < 5) {
            endAngle = 240;
          } else if (this.data['series'].length === 5) {
            endAngle = 200;
          } else {
            endAngle = 180;
          }

          options['plotOptions'].radialBar.endAngle = endAngle;
        }
        if (this.options['dataLabels']) {
          options['dataLabels'] = this.options['dataLabels'];
        }
        if (this.options['fill']) {
          options['fill'] = this.options['fill'];
        }
        if (this.options['legend']) {
          options['legend'] = this.options['legend'];
        }
      }

      const ApexCharts = apexChart['default'];
      const chartElement = document.querySelector('#chart-' + this.data['id']);
      const chart = new ApexCharts(chartElement, options);
      chart.render();
      this._debug ? console.log('HomeChart:III: ', options) : '';
    }
    this._debug ? console.log('----------------------------------') : '';

  }

  getMaxVal() {
    const maxSetting = this.data['visualSettings'][this.filter['viewPrefix'] + 'iMaxValue'];
    const maxLegend = Math.round(this.data['legends'][this.data['legends'].length - 1]['fEnd']);

    if (maxSetting > 0) {
      return maxSetting;
    } else {
      if (this.data['visualSettings'][this.filter['viewPrefix'] + 'sDataValue'] === 'Actual') {
        return maxLegend;
      } else {
        return 100;
      }
    }
  }

  onResize(force) {
    setTimeout(() => {
      let sizeChanged = false;
      if (this._currentWindowWidth !== window.innerWidth &&
        (this._currentWindowHeight - window.innerHeight > 50 || window.innerHeight - this._currentWindowHeight > 50)
      ) {
        sizeChanged = true;
        // this.doResize();
      }
    }, 250);
  }

  doResize() {
    setTimeout(() => {
      this._currentWindowHeight = window.innerHeight;
      this._currentWindowWidth = window.innerWidth;
      const ApexCharts = apexChart['default'];
      const chartElement = document.querySelector('#chart-' + this.data['id']);
      const chart = new ApexCharts(chartElement, this.chartOptions);
      chart.render();
    }, 2000);
  }

  public chartClick(summary_stepThroughValue) {
    this.filter.detailed_stepThroughValue = ''; // ensure this value is empty for the graph click through
    this.filter.summary_stepThroughValue = summary_stepThroughValue;
    const componentData = { 'currentViewSection': 'detailed', 'MymaxTemplateMenuComponentUID': this.graphData.MymaxTemplateMenuComponentUID };
    if (this.graphData['visualSettings'][this.filter['viewPrefix'] + 'bGraphClickThrough']) {
      this.podHolderHandler.emit(componentData);
    }
  }

  graphHolderHandler(componentData) {
    this.podHolderHandler.emit(componentData);
  }
}
