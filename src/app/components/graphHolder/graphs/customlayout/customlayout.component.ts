import {Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-customlayout',
    templateUrl: './customlayout.component.html',
    styleUrls: ['./customlayout.component.scss'],
    encapsulation: ViewEncapsulation.None
})
// '../../../../../assets/icon/icofont.min.scss'
export class CustomLayoutComponent implements OnInit {

  @Input() pdfData;

  constructor() {}

  ngOnInit() {
    // console.log('pdfData:: ', this.pdfData);
  }

}
