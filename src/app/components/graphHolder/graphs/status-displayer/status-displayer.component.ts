import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { MyMaxFilter } from '../../../../_models';

@Component({
  selector: 'app-status-displayer',
  templateUrl: './status-displayer.component.html',
  styleUrls: ['./status-displayer.component.scss']
})
export class StatusDisplayerComponent implements OnInit {

  @Input() forPrint;
  @Input() data;
  @Input() filter: MyMaxFilter;
  @Input() overallHeight;
  @Output() graphClickHandler: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('iconRow') iconRow: ElementRef;
  @ViewChild('legendRow') legendRow: ElementRef;
  
  _statusHeight = 0;
  _legendHeight = 0;

  constructor() { }

  ngOnInit() {
    if(!this.forPrint){
      setTimeout(() => {
        if (this.iconRow) {
          // this._statusHeight = this.iconRow.nativeElement.offsetHeight;
        }
        if (this.legendRow) {
          // this._legendHeight = this.legendRow.nativeElement.offsetHeight;
        }
      }, 1000);
    }
  }

  chartClick(item) {
    this.filter.detailed_stepThroughValue = ''; // ensure this value is empty for the graph click through
    this.filter.summary_stepThroughValue = item[0];
    const componentData = {'currentViewSection': 'detailed', 'MymaxTemplateMenuComponentUID': this.data.MymaxTemplateMenuComponentUID};
    this.graphClickHandler.emit(componentData);
  }
}
