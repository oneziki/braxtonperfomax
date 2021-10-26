import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MyMaxFilter } from '../../../../_models';

@Component({
  selector: 'app-bar-list',
  templateUrl: './bar-list.component.html',
  styleUrls: ['./bar-list.component.scss']
})
// '../../../../../assets/icon/icofont.min.scss'
export class BarListComponent implements OnInit {

  @Input() data;
  @Input() filter: MyMaxFilter;
  @Output() graphClickHandler: EventEmitter<any> = new EventEmitter<any>();

  _maxVal = 0;

  constructor() {
   }

   ngOnInit() {
    this.data['data'].forEach(d => {
      if(this._maxVal < d[1]) {
        this._maxVal = d[1];
      }
   });
  }

  getBar(item) {
    let width = item[1];
    // WORK OUT 5 //
    if(this._maxVal > 0) {
      width = item[1] / this._maxVal * 100;
    }
    // // // // //
    width = width + '%';

    return {
      'width': width,
      'background': item[3]
    }
  }

  getColor(item) {
    return {
      'color': item[3]
    }
  }

  chartClick(item) {
    if(this.data['visualSettings'][this.filter['viewPrefix'] + 'bGraphClickThrough']) {
      this.filter.detailed_stepThroughValue = ''; // ensure this value is empty for the graph click through
      this.filter.summary_stepThroughValue = item[0];
      const componentData = {'currentViewSection': 'detailed', 'MymaxTemplateMenuComponentUID': this.data.MymaxTemplateMenuComponentUID};
      this.graphClickHandler.emit(componentData);
    }
  }
}
