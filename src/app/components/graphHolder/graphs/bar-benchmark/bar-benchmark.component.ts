import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MyMaxFilter } from '../../../../_models';

@Component({
  selector: 'app-bar-benchmark',
  templateUrl: './bar-benchmark.component.html',
  styleUrls: ['./bar-benchmark.component.scss']
})
// '../../../../../assets/icon/icofont.min.scss'
export class BarBenchmarkComponent {

  @Input() data;
  @Input() overallWidth;
  @Input() filter: MyMaxFilter;
  @Output() graphClickHandler: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  getBenchmark() {
    return this.data['benchMark'];
  }

  getColStyle() {
    if (this.overallWidth > 500) {
      return { width: '45%' };
    } else if (this.overallWidth > 1000) {
      return { width: '65%' };
    } else {
      return { width: '35%' };
    }
  }

  getItemStyle(type, listItem) {
    let toReturn;
    let scoreWidth;
    let backgroundValue = 3;
    let scoreWidthValue = 2;

    if ((listItem.length) > 4) {
      backgroundValue = 4;
      scoreWidthValue = 3;
    }

    switch (type) {
      case 'horzScore':
        if (listItem[1] > 49) {
          scoreWidth = listItem[1] - 50;
          toReturn = {
            width: scoreWidth + '%',
            left: '50%',
            background: listItem[backgroundValue]
          };
        } else {
          scoreWidth = 50 - listItem[1];
          toReturn = {
            width: scoreWidth + '%',
            right: '50%',
            background: listItem[backgroundValue]
          };
        }
        break;
      case 'horzAverage':
        if (listItem[1] > 49) {
          scoreWidth = listItem[scoreWidthValue] - 50;
          toReturn = {
            width: scoreWidth + '%',
            left: '50%'
          };
        } else {
          scoreWidth = 50 - listItem[scoreWidthValue];
          toReturn = {
            width: scoreWidth + '%',
            right: '50%'
          };
        }
        break;
        default:
          toReturn = {
            left: listItem[2]
          };
    }

    return toReturn; 
  }

  chartClick(item) {
    this.filter.detailed_stepThroughValue = ''; // ensure this value is empty for the graph click through
    this.filter.summary_stepThroughValue = item[0];
    const componentData = { 'currentViewSection': 'detailed', 'MymaxTemplateMenuComponentUID': this.data.MymaxTemplateMenuComponentUID };
    this.graphClickHandler.emit(componentData);
  }
}
