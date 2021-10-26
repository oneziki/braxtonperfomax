import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnChanges,
} from '@angular/core';

import { CompanyTemplate } from './../../_models/index';

@Component({
  selector: 'app-menus',
  templateUrl: 'app-menus.page.html',
  styleUrls: ['app-menus.page.scss'],
})
export class AppMenus {
  @Input() type: any;
  @Input() sessionUser: any;
  @Input() companyTemplate: any;
  @Input() activitySummery: any;
  @Input() notificationsList: any;
  @Input() conversationFeed: any;
  @Input() managers: any;
  @Input() directReports: any;



  @Output() onItemClick = new EventEmitter();

  _companyTemplate: CompanyTemplate;

  constructor () { }

  getCompanyTempStyle(status) {
    if (this._companyTemplate) {
      return this._companyTemplate[status];
    }
    return null;
  }
}
