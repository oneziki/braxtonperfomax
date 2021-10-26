import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MyMaxFilter } from '../../../../_models';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
// '../../../../../assets/icon/icofont.min.scss'
export class CardListComponent {

  @Input() data;
  @Input() filter: MyMaxFilter;
  @Output() graphClickHandler: EventEmitter<any> = new EventEmitter<any>();

  _mouseOvered = -1;

  constructor () { }

  chartClick(item) {
    if (this.data['visualSettings'][this.filter['viewPrefix'] + 'bGraphClickThrough']) {

      this.filter.detailed_stepThroughValue = ''; // ensure this value is empty for the graph click through
      this.filter.summary_stepThroughValue = item[0];
      const componentData = { 'currentViewSection': 'detailed', 'MymaxTemplateMenuComponentUID': this.data.MymaxTemplateMenuComponentUID };
      this.graphClickHandler.emit(componentData);
    }
  }
}
