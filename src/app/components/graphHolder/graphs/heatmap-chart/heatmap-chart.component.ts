import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MyMaxFilter } from '../../../../_models';

@Component({
  selector: 'app-heatmap-chart',
  templateUrl: './heatmap-chart.component.html',
  styleUrls: ['./heatmap-chart.component.scss']
})
export class HeatmapChartComponent implements OnInit {

  @Input() data;
  @Input() filter: MyMaxFilter;
  @Input() overallHeight;
  @Input() overallWidth;
  @Output() graphClickHandler: EventEmitter<any> = new EventEmitter<any>();

  _gridType = '';
  _gridClass = '';

  constructor() { }

  ngOnInit() {
    // set class name
    this._gridType = this.data.visualSettings['sGridType'];
    if (this._gridType === '4 Box (2x2)') {
      this._gridClass = 'grid-two-columns';
    } else if (this._gridType === '6 Box (2x3)') {
      this._gridClass = 'grid-two-columns';
    } else if (this._gridType === '6 Box (3x2)') {
      this._gridClass = 'grid-three-columns';
    } else if (this._gridType === '9 Box (3x3)') {
      this._gridClass = 'grid-three-columns';
    } else if (this._gridType === '12 Box (3x4)') {
      this._gridClass = 'grid-three-columns';
    } else if (this._gridType === '12 Box (4x3)') {
      this._gridClass = 'grid-four-columns';
    }
  }

  chartClick(item) {
    this.filter.detailed_stepThroughValue = ''; // ensure this value is empty for the graph click through
    this.filter.summary_stepThroughValue = JSON.stringify(item);
    const componentData = {'currentViewSection': 'detailed', 'MymaxTemplateMenuComponentUID': this.data.MymaxTemplateMenuComponentUID};
    this.graphClickHandler.emit(componentData);
  }


}
