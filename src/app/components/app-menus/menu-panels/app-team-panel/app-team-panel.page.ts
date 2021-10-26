import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'app-team-panel',
  templateUrl: 'app-team-panel.page.html',
  styleUrls: ['app-team-panel.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppTeamPanel {
  @Input() managers: any;
  @Input() directReports: any;
  @Input() companyTemplate: any;
  @Output() onItemClick = new EventEmitter();

  constructor () { }
}
