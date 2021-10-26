import { Component, OnInit, Output, OnDestroy, Input, EventEmitter } from '@angular/core';
import { AuthService } from '../../../../_services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PrintToolContent } from '../../print-tool';

@Component({
  selector: 'app-pt-layout-esurvey-assessment',
  templateUrl: './pt-layout-esurvey-assessment.component.html',
  styleUrls: ['./pt-layout-esurvey-assessment.component.scss']
})
export class LayoutEsurveyAssessmentComponent implements OnInit, OnDestroy {

  @Input() _coverData = {};
  @Input() _contentData: PrintToolContent;
  @Output() backHandler: EventEmitter<any> = new EventEmitter<any>();

  _navStatus = '';

  private readonly onDestroy = new Subject<void>();
  constructor (public _authService: AuthService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  goBack(): void {
    this.backHandler.emit();
  }

}