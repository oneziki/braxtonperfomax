import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, LoaderService, ThreeSixtyService } from '../../../../_services/index';
import { Router } from '@angular/router';
import { ThreeSixtyAssessment, ThreeSixtyAssessee } from '../../../../_models/index';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit, OnDestroy {

  _usePendingDefaultImage = [];
  _useCompletedDefaultImage = [];
  _selectedAssessment: ThreeSixtyAssessment;
  _pending: ThreeSixtyAssessee[] = [];
  _completed: ThreeSixtyAssessee[] = [];

  private readonly onDestroy = new Subject<void>();
  constructor(public _threeSixtyService: ThreeSixtyService,
    public _authService: AuthService,
    private _router: Router,) { }

  ngOnInit() {

    this._selectedAssessment = this._threeSixtyService._selectedAssessment;
    this._pending = this._threeSixtyService._threeSixty_assessees_pending;
    this._completed = this._threeSixtyService._threeSixty_assessees_completed;
    this._authService.hideAppPanel(true);

    if (this._pending.length === 0 && this._completed.length === 0) {
      this._threeSixtyService.getThreeSixtyAssesseesForAssessor(this._selectedAssessment.compAssessmentUID,
        this._selectedAssessment.sAssessorInternal_fkUserUUID, true)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.setAssessees();
        });
    } else {
      this.setAssessees();
    }
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  setAssessees() {
    this._selectedAssessment = this._threeSixtyService._selectedAssessment;
    this._pending = this._threeSixtyService._threeSixty_assessees_pending;
    this._completed = this._threeSixtyService._threeSixty_assessees_completed;

    // Check for Pending Images
    for (let i = 0; i < this._pending.length; i++) {
      if (this._pending[i]['profilePhoto'] && this._pending[i]['profilePhoto'].length) {
        this._usePendingDefaultImage[i] = false;
        this._pending[i]['profilePhoto'] = this._pending[i]['profilePhoto'] + '?' + Math.floor((Math.random() * 1000) + 1);
      } else {
        this._usePendingDefaultImage[i] = true;
      }
    }

    // Check for Completed Images
    for (let i = 0; i < this._completed.length; i++) {
      if (this._completed[i]['profilePhoto'] && this._completed[i]['profilePhoto'].length) {
        this._useCompletedDefaultImage[i] = false;
        this._completed[i]['profilePhoto'] = this._completed[i]['profilePhoto'] + '?' + Math.floor((Math.random() * 1000) + 1);
      } else {
        this._useCompletedDefaultImage[i] = true;
      }
    }

    if (this._pending.length === 1 && this._completed.length === 0) {
      this.getThreeSixtyQuestionnaireForAssessor(this._pending[0]);
    }
  }

  pendingDefaultImg(i) {
    this._usePendingDefaultImage[i] = true;
  }

  completedDefaultImg(i) {
    this._useCompletedDefaultImage[i] = true;
  }

  getThreeSixtyQuestionnaireForAssessor(assessee: ThreeSixtyAssessee) {
    // reset questionnaire
    this._threeSixtyService._threeSixty_questionnaire = {
      compAssessmentUID: '',
      compAssessmentAssessorsUID: '',
      title: '',
      pages: []
    };
    // set assessee
    this._threeSixtyService._selectedAssessee = assessee;
    // navigate to questionnaire page
    this._router.navigate(['grow/three-sixty/questionnaire'], { replaceUrl: true });
  }

  getThreeSixtyReport(assessee: ThreeSixtyAssessee) {
    // set assessee
    this._threeSixtyService._selectedAssessee = assessee;
    // this._threeSixtyService.getThreeSixtyQuestionnaireForAssessor(assessee)
    //   .pipe(takeUntil(this.onDestroy))
    //   .subscribe(threeSixty_questionnaire => {
    this._threeSixtyService._selectedAssessee = assessee;

    this._router.navigate(['grow/three-sixty/report'], { replaceUrl: true });
    // });
  }

  goBack() {
    this._router.navigate(['activity-summary'], { replaceUrl: true });
  }

}
