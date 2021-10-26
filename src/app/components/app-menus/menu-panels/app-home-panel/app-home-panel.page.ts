import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'app-home-panel',
  templateUrl: 'app-home-panel.page.html',
  styleUrls: ['app-home-panel.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppHomePanel {
  @Input() companyTemplate: any;
  @Input() activitySummery: any;
  @Input() notificationsList: any;
  @Input() conversationFeed: any;
  @Output() onItemClick = new EventEmitter();

  constructor() {}

  getCompanyTempStyle(status) {
    return this.companyTemplate[status];
  }
}
