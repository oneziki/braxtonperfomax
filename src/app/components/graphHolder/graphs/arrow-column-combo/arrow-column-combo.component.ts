import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MyMaxFilter } from '../../../../_models';

@Component({
  selector: 'app-arrow-column-combo',
  templateUrl: './arrow-column-combo.component.html',
  styleUrls: ['./arrow-column-combo.component.scss']
})
// '../../../../../assets/icon/icofont.min.scss'
export class ArrowColumnComboComponent implements OnInit {

  @Input() data;
  @Input() overallHeight;
  @Input() filter: MyMaxFilter;
  @Output() graphClickHandler: EventEmitter<any> = new EventEmitter<any>();

  dType: string;
  colMax: string;
  legendMax = 0;

  constructor() { }

  ngOnInit() {

    // get Type
    this.dType = this.data['visualSettings'][ this.filter['viewPrefix'] + 'sDataValue'];

    // get Max Value
    this.data['legends'].forEach(l => {
      if (this.legendMax < l['fEnd']) {
        this.legendMax = l['fEnd'];
      }
    });

    // get Col Heights
    if(this.dType === 'Actual') {
      this.data['data'].forEach(d => {
        d['height'] = (Number(d[2]) / this.legendMax * 100);
        d['height'] = 100 - d['height'] + '%'
      });
    } else {
      this.data['data'].forEach(d => {
        d['height'] = 100 - d[1] + '%';
      });
    }

    // set Outer Col Height
    this.colMax = this.overallHeight - 65 + 'px';
  }

  chartClick(item) {
    this.filter.detailed_stepThroughValue = ''; // ensure this value is empty for the graph click through
    this.filter.summary_stepThroughValue = item[0];
    const componentData = {'currentViewSection': 'detailed', 'MymaxTemplateMenuComponentUID': this.data.MymaxTemplateMenuComponentUID};
    this.graphClickHandler.emit(componentData);
  }

}
