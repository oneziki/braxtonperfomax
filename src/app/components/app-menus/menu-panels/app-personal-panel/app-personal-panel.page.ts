import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'app-personal-panel',
  templateUrl: 'app-personal-panel.page.html',
  styleUrls: ['app-personal-panel.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppPersonalPanel {
  @Input() managers: any;
  @Input() sessionUser: any;
  @Input() companyTemplate: any;
  @Output() onItemClick = new EventEmitter();

  constructor () { }
}
