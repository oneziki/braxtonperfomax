import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MyMaxFilter } from '../../../../_models';

@Component({
  selector: 'app-pie-list',
  templateUrl: './pie-list.component.html',
  styleUrls: ['./pie-list.component.scss']
})

// ,'../../../../../assets/icon/icofont.min.scss'
export class PieListComponent implements OnInit {

  @Input() data;
  @Input() filter: MyMaxFilter;
  @Output() graphClickHandler: EventEmitter<any> = new EventEmitter<any>();

  _piesLoaded = false;

  constructor() { }

  ngOnInit() {

    const that = this;
    setTimeout(function() {

      that.data['data'].forEach(item => {
        item['Conversing']['dataTable']['options']['height']  = item['Conversing']['options']['height'];
        item['Reading']['dataTable']['options']['height']     = item['Reading']['options']['height'];
        item['Writing']['dataTable']['options']['height']     = item['Writing']['options']['height'];
        // console.log(item['name'] , 'Conversing', item['Writing']['dataTable']['options']);
        // console.log(item['name'] , 'Reading', item['Writing']['dataTable']['options']);
        // console.log(item['name'] , 'Writing', item['Writing']['dataTable']['options']);
      });
      that._piesLoaded = true;
    }, 1000);
  }

  chartClick(item) {
    this.filter.detailed_stepThroughValue = ''; // ensure this value is empty for the graph click through
    this.filter.summary_stepThroughValue = item[0];
    const componentData = {'currentViewSection': 'detailed', 'MymaxTemplateMenuComponentUID': this.data.MymaxTemplateMenuComponentUID};
    this.graphClickHandler.emit(componentData);
  }
}
