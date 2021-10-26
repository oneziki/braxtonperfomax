import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { PopoverController } from "@ionic/angular";

@Component({
  selector: 'app-mymax-pop',
  templateUrl: './mymax-pop.component.html',
  styleUrls: ['./mymax-pop.component.scss'],
})
export class MyMaxPopComponent implements OnInit {

  @Input() data;
  @Input() filter;
  @Input() popoverInfo;
  @Output() legendEmitter = new EventEmitter<any>();
  @Output() downloadEmitter = new EventEmitter<any>();
  @Output() componentViewHandler: EventEmitter<any> = new EventEmitter<any>();

  constructor (private popover: PopoverController) { }

  ngOnInit() {
  }

  ClosePopover() {
    this.popover.dismiss();
  }

  showLegend() {
    this.popoverInfo['_showLegend'] = !this.popoverInfo['_showLegend'];
    this.legendEmitter.emit(this.popoverInfo);
  }

  triggelMyMaxPodImage(data) {
    this.downloadEmitter.emit(data);
  }

  showDetailed() {
    this.ClosePopover();
    const componentData = { 'currentViewSection': 'detailed', 'MymaxTemplateMenuComponentUID': this.data.MymaxTemplateMenuComponentUID };
    this.componentViewHandler.emit(componentData);
  }
}
