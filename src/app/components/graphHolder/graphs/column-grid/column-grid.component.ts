import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { MyMaxFilter } from '../../../../_models';

@Component({
  selector: 'app-column-grid',
  templateUrl: './column-grid.component.html',
  styleUrls: ['./column-grid.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ColumnGridComponent {

  @Input() data;
  @Input() filter: MyMaxFilter;
  @Input() overallHeight;
  @Output() graphClickHandler: EventEmitter<any> = new EventEmitter<any>();

  _mouseOvered = 0;

  constructor() { }

  ngOnInit() {
    this.data['data'].forEach(item => {
      if(item['fScore1'] && !Number.isInteger(item['fScore1'])) item['fScore1'] = item['fScore1'].trim();
      if(item['fScore2'] && !Number.isInteger(item['fScore2'])) item['fScore2'] = item['fScore2'].trim();
    });
  }

  calcMarginToip() {
    if(this.overallHeight > 200) {
      let toReturn = this.overallHeight / 4.5;
      if (toReturn < 0){
        toReturn = 0;
      }
      return toReturn + 'px';
    } else {
      return '0px';
    }
  }

  chartClick(item) {
    if (this.data['visualSettings'][ this.filter['viewPrefix'] + 'bGraphClickThrough']) {
      this.filter.detailed_stepThroughValue = ''; // ensure this value is empty for the graph click through
      if(item['sLabel1'] && item['sLabel1']['label']) {
        this.filter.summary_stepThroughValue = item['sLabel1']['label'];
      } else {
        this.filter.summary_stepThroughValue = item[0];
      }
      const componentData = {'currentViewSection': 'detailed', 'MymaxTemplateMenuComponentUID': this.data.MymaxTemplateMenuComponentUID};
      this.graphClickHandler.emit(componentData);
    }
  }
}
