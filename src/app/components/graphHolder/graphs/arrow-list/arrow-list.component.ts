import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MyMaxFilter } from '../../../../_models';

@Component({
  selector: 'app-arrow-list',
  templateUrl: './arrow-list.component.html',
  styleUrls: ['./arrow-list.component.scss']
})
// '../../../../../assets/icon/icofont.min.scss'
export class ArrowListComponent {

  @Input() data;
  @Input() filter: MyMaxFilter;
  @Output() graphClickHandler: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  chartClick(item) {
    this.filter.detailed_stepThroughValue = ''; // ensure this value is empty for the graph click through
    this.filter.summary_stepThroughValue = item[0];
    const componentData = {'currentViewSection': 'detailed', 'MymaxTemplateMenuComponentUID': this.data.MymaxTemplateMenuComponentUID};
    this.graphClickHandler.emit(componentData);
  }
}
