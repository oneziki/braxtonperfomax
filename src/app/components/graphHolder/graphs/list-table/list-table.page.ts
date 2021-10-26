import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-list-table',
  templateUrl: './list-table.page.html',
  styleUrls: ['./list-table.page.scss'],
})
export class ListTablePage implements OnInit {

  @Input() data: any;
  @Input() options: any;

  bLoadMore = false;

  constructor () { }

  ngOnInit() {
  }

}
