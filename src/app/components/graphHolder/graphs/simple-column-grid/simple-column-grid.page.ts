import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-simple-column-grid',
  templateUrl: './simple-column-grid.page.html',
  styleUrls: ['./simple-column-grid.page.scss'],
})
export class SimpleColumnGridPage implements OnInit {

  @Input() data: any;
  @Input() options: any;

  constructor() { }

  ngOnInit() {
  }

}
