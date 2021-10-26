import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-status-display',
  templateUrl: './status-display.page.html',
  styleUrls: ['./status-display.page.scss'],
})
export class StatusDisplayPage implements OnInit {

  @Input() data: any;
  @Input() options: any;

  constructor() { }

  ngOnInit() {
  }

}
