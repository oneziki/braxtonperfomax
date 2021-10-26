import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-modals',
  templateUrl: './modals.page.html',
  styleUrls: ['./modals.page.scss'],
})
export class ModalsPage implements OnInit {

  @Input() modalData;
  @Input() type;

  constructor() { }

  ngOnInit() {
  }

}
