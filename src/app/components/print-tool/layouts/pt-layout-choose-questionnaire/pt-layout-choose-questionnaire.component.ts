import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AuthService, ChooseQuestionnaireService, LoaderService, PrintToolService } from '../../../../_services';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { PrintToolContent } from '../../print-tool';

@Component({
  selector: 'app-pt-layout-choose-questionnaire',
  templateUrl: './pt-layout-choose-questionnaire.component.html',
  styleUrls: ['./pt-layout-choose-questionnaire.component.scss']
})
export class LayoutChooseQuestionnaireComponent implements OnInit, OnDestroy {

  @Input() _coverData = {};
  @Input() _contentData: PrintToolContent;
  @Output() backHandler: EventEmitter<any> = new EventEmitter<any>();

  _navStatus = '';
  mobilityA = {};
  mobilityB = {};
  essentialQualifications = [];
  optionalQualifications = [];

  private readonly onDestroy = new Subject<void>();

  constructor (
    public _authService: AuthService,
    public _chooseQuestionnaireService: ChooseQuestionnaireService,
    private _loaderService: LoaderService,
    private _router: Router,
    private _printtoolService: PrintToolService
  ) { }

  ngOnInit() {
    if (this._contentData['mobilities'].length > 0) {
      this.mobilityA = this._contentData['mobilities'][0];
      if (this._contentData['mobilities'].length > 1) {
        this.mobilityB = this._contentData['mobilities'][1];
      }
    }

    // qualifications
    let i = 0;
    let j = 0;
    for (i = 0; i < this._contentData['futureRole'].length; i++) {
      for (j = 0; j < this._contentData['futureRole'][i]['qualifications'].length; j++) {
        if (Boolean(this._contentData['futureRole'][i]['qualifications'][j]['bEssential']) === true) {
          this.essentialQualifications.push(this._contentData['futureRole'][i]['qualifications'][j]);
        } else {
          this.optionalQualifications.push(this._contentData['futureRole'][i]['qualifications'][j]);
        }
      }
    }
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.closePDFView();
  }

  closePDFView() {
    this._printtoolService._triggerClosingView.emit();
  }

  goBack(): void {
    this.backHandler.emit();
  }

  printPDFReport(): void {
    this._loaderService.initLoader(true);
    this._chooseQuestionnaireService.printChooseQuestionnaireReport(this._contentData['UserChooseQuestionnaireUID'])
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.closePDFView();
        this._router.navigate(['choose'], { replaceUrl: true });
      });
  }

}
