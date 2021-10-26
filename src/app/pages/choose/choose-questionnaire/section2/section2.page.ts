import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { SessionUser } from '../../../../_models/index';
import { AuthService, LoaderService, ChooseQuestionnaireService, PrintToolService } from '../../../../_services/index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-section2',
  templateUrl: './section2.page.html',
  styleUrls: ['./section2.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Section2Page implements OnInit, OnDestroy {

  _sessionUser: SessionUser;
  _roleProfiles = [];
  _sOption = ['Yes', 'No'];
  _departments = [];
  _mobilities = [];
  _mobilitiesObj = [];
  _questionnaireSettings = {};
  _userQuestionnaire = {};
  _hasFocus = false;
  bLongDisable = true;
  bShortDisable = true;
  bImmediateDisable = true;
  _bDisplay = false;
  _searchImmediateRole = {};
  _searchShortTermRole = {};
  _searchLongTermRole = {};
  _userChooseQuestionnaireUID = '';

  private readonly onDestroy = new Subject<void>();

  constructor(private _chooseQuestionnaireService: ChooseQuestionnaireService,
    private _loaderService: LoaderService,
    public _authService: AuthService,
    private _router: Router,
    private _printtoolService: PrintToolService) { }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._sessionUser = this._authService._sessionUser;
    this._questionnaireSettings = this._chooseQuestionnaireService._questionnaireSettings;
    this._userQuestionnaire = this._chooseQuestionnaireService._userQuestionnaire;

    if (this.isEmpty(this._userQuestionnaire)) {
      this.goBack();
    }
    
    if (this.isEmpty(this._questionnaireSettings)) {

      this._chooseQuestionnaireService.getQuestionnaireSettings()
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.emitQuestionnaireData();
        });
    } else {
      this.emitQuestionnaireData();
    }
    this._loaderService.exitLoader();
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  emitQuestionnaireData() {
    this._questionnaireSettings = this._chooseQuestionnaireService._questionnaireSettings;
    this._userQuestionnaire = this._chooseQuestionnaireService._userQuestionnaire;
    this._roleProfiles = this._questionnaireSettings['roles'];
    this._departments = this._questionnaireSettings['departments'];
    this._mobilities = this._questionnaireSettings['mobilities'];
    this._bDisplay = true;
  }

  setMobility(mobility) {
    for (let i = 0; i < this._userQuestionnaire['mobilities'].length; i++) {
      if (this._userQuestionnaire['mobilities'][i]['Mobility_fkMobilityUID'] === mobility['Mobility_fkMobilityUID']) {
        this._userQuestionnaire['mobilities'].splice(i, 1);
      }
    }
    if (mobility['sCategoryName'] === 'N/A') {
      mobility['sWillingToRelocate'] = 'No';
    }
    
    this._userQuestionnaire['mobilities'].push(mobility);
  }

  setRelocate(mobility, value) {
    for (let i = 0; i < this._userQuestionnaire['mobilities'].length; i++) {
      if (this._userQuestionnaire['mobilities'][i]['Mobility_fkMobilityUID'] === mobility['MobilityUID']) {
        this._userQuestionnaire['mobilities'][i]['sWillingToRelocate'] = value;
      }
    }
  }

  isEmpty(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  setOptionState(value, option, _searchImmediateRole) {
    if (option === 'bImmediateDisable') {
      if (value === 'No') {
        this.bImmediateDisable = true;
        this._searchImmediateRole = 'Not Applicable';
      } else {
        this.bImmediateDisable = false;
        this._searchImmediateRole = { 0: '' };
      }
    } else if (option === 'bShortDisable') {
      if (value === 'No') {
        this.bShortDisable = true;
        this._searchShortTermRole = 'Not Applicable';
      } else {
        this.bShortDisable = false;
        this._searchShortTermRole = { 0: '' };
      }
    } else if (option === 'bLongDisable') {
      if (value === 'No') {
        this.bLongDisable = true;
        this._searchLongTermRole = 'Not Applicable';
      } else {
        this.bLongDisable = false;
        this._searchLongTermRole = { 0: '' };
      }
    }
  }

  previousPage() {
    this._chooseQuestionnaireService._userQuestionnaire = this._userQuestionnaire;
    this._router.navigate(['choose-questionnaire'], { replaceUrl: true });
  }

  submitQuestionnaire() {
    let sMessage = '';
    if (this._searchImmediateRole['JobTitleRoleUID']) {
      this._userQuestionnaire['sImmediateTermRoleUID'] = this._searchImmediateRole['JobTitleRoleUID'];
      this._userQuestionnaire['sImmediateTermRole'] = this._searchImmediateRole['sJobTitleRoleName'];
    } else if (this._searchImmediateRole === 'Not Applicable') {
      this._userQuestionnaire['sImmediateTermRoleUID'] = '';
      this._userQuestionnaire['sImmediateTermRole'] = 'Not Applicable';
    } else if (typeof this._searchImmediateRole === 'string') {
      this._userQuestionnaire['sImmediateTermRoleUID'] = '';
      this._userQuestionnaire['sImmediateTermRole'] = this._searchImmediateRole;
    } else {
      sMessage = sMessage + 'Please select a valid Immediate Term role<br>';
    }

    if (this._searchShortTermRole['JobTitleRoleUID']) {
      this._userQuestionnaire['sShortTermRoleUID'] = this._searchShortTermRole['JobTitleRoleUID'];
      this._userQuestionnaire['sShortTermRole'] = this._searchShortTermRole['sJobTitleRoleName'];
    } else if (this._searchShortTermRole === 'Not Applicable') {
      this._userQuestionnaire['sShortTermRoleUID'] = '';
      this._userQuestionnaire['sShortTermRole'] = 'Not Applicable';
    } else if (typeof this._searchShortTermRole === 'string') {
      this._userQuestionnaire['sShortTermRoleUID'] = '';
      this._userQuestionnaire['sShortTermRole'] = this._searchShortTermRole;
    } else {
      sMessage = sMessage + 'Please select a valid Short Term role<br>';
    }

    if (this._searchLongTermRole['JobTitleRoleUID']) {
      this._userQuestionnaire['sLongTermRoleUID'] = this._searchLongTermRole['JobTitleRoleUID'];
      this._userQuestionnaire['sLongTermRole'] = this._searchLongTermRole['sJobTitleRoleName'];
    } else if (this._searchLongTermRole === 'Not Applicable') {
      this._userQuestionnaire['sLongTermRoleUID'] = '';
      this._userQuestionnaire['sLongTermRole'] = 'Not Applicable';
    } else if (typeof this._searchLongTermRole === 'string') {
      this._userQuestionnaire['sLongTermRoleUID'] = '';
      this._userQuestionnaire['sLongTermRole'] = this._searchLongTermRole;
    } else {
      sMessage = sMessage + 'Please select a valid Long Term role<br>';
    }

    if (this._userQuestionnaire['sPreferredDepartment'] === '') {
      sMessage = sMessage + 'Please select a Department<br>';
    }
    if (this._userQuestionnaire['sWillingToRelocate'] === '') {
      sMessage = sMessage + 'Please complete the Mobilities section<br>';
    }
    if (this._userQuestionnaire['mobilities'].length + 1 !== this._questionnaireSettings['mobilities'].length) {
      sMessage = sMessage + 'Please complete the Mobilities section<br>';
    }
    for (let i = 0; i < this._userQuestionnaire['mobilities'].length; i++) {
      if (this._userQuestionnaire['mobilities'][i]['sWillingToRelocate'] === '') {
        sMessage = sMessage + 'Please complete the Mobilities section<br>';
      }
    }

    if (sMessage !== '') {
      Swal.fire({
        title: '',
        html: sMessage,
        icon: 'warning',
        confirmButtonColor: 'var(--primary)',
        heightAuto: false
      });
    } else {
      this._loaderService.initLoader(true);
      this._chooseQuestionnaireService.saveUserQuestionnaire(this._userQuestionnaire)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this._userChooseQuestionnaireUID = this._chooseQuestionnaireService._userChooseQuestionnaireUID;
          this.getReport();
        });
    }
  }

  getReport() {
    this._chooseQuestionnaireService.getChooseQuestionnaireReportData(this._userChooseQuestionnaireUID, false)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this._printtoolService.initPrintChooseQuestionnaireReportView(this._chooseQuestionnaireService['_reportData']);
          this._loaderService.exitLoader();
        });
  }

  goBack() {
    this._router.navigate(['choose/choose-questionnaire/section1'], { replaceUrl: true });
  }

  roleChange(event, value) {
    if (value === 'Immediate') {
      this._userQuestionnaire['sImmediateTermRole'] = event['value']['sJobTitleRoleName'];
      this._userQuestionnaire['sImmediateTermRoleUID'] = event['value']['JobTitleRoleUID'];
    } else if (value === 'ShortTerm') {
      this._userQuestionnaire['sShortTermRole'] = event['value']['sJobTitleRoleName'];
      this._userQuestionnaire['sShortTermRoleUID'] = event['value']['JobTitleRoleUID'];
    } else {
      this._userQuestionnaire['sLongTermRole'] = event['value']['sJobTitleRoleName'];
      this._userQuestionnaire['sLongTermRoleUID'] = event['value']['JobTitleRoleUID'];
    }
  }

}
