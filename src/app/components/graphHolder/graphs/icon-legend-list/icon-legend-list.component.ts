import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { MyMaxFilter } from '../../../../_models';

@Component({
  selector: 'app-icon-legend-list',
  templateUrl: './icon-legend-list.component.html',
  styleUrls: ['./icon-legend-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
// '../../../../../assets/icon/icofont.min.scss'
export class IconLegendListComponent {

  @Input() data;
  @Input() filter: MyMaxFilter;
  @Input() overallHeight;
  @Output() graphClickHandler: EventEmitter<any> = new EventEmitter<any>();

  _mouseOvered = 0;

  constructor() { }

  ngOnInit() {

  }

  calcMarginToip() {
    if(this.overallHeight && this.overallHeight > 200) {
      if (this.data['data'] && this.data['visualSettings'][ this.filter['viewPrefix'] + 'bDisplayGraphVertical']) {
        if (this.overallHeight < 200) {
          return '0';
        } else {
          let toReturn = this.overallHeight / 15;
          if (toReturn < 0){
            toReturn = 0;
          }
          return toReturn + 'px';
        }        
      } else {
        let toReturn = this.overallHeight / 4.5;
        if (toReturn < 0){
          toReturn = 0;
        }
        return toReturn + 'px';
      }
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
