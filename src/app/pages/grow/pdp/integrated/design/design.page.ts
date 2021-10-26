import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import {
  IntergratedPDP,
  IntergratedPdpDevelopmentNeeds, KraCompanySettings,
  SessionUser, ThreeSixtyAssessee, ThreeSixtyAssessment, ThreeSixtyQuestionnaire
} from '../../../../../_models/index';
import { AuthService, KraPdpService, KraService, LoaderService, ThreeSixtyService, EmployeeDirectoryService } from '../../../../../_services/index';

@Component({
  selector: 'app-design',
  templateUrl: './design.page.html',
  styleUrls: ['./design.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DesignPage implements OnInit, OnDestroy {

  public _questionnaireTitle: string;
  public _sAssesseeFullName: string;
  public _sAssesseeInitials: string;

  _envTheme: object;
  _sessionUser: SessionUser;
  _kraCompanySettings: KraCompanySettings;
  _portalView: string;
  _maxCardHeight = 0;
  _threeSixty_questionnaire: ThreeSixtyQuestionnaire;
  _selectedAssessee: ThreeSixtyAssessee;
  _selectedAssessment: ThreeSixtyAssessment;
  _pageGO = false;

  _bManager = false;

  _reportData: Object = {};
  _details: Object = {};
  _legend = [];
  _bViewMode = false;
  _showEmployeeSubmitAlert = false;
  _lenseData = [];
  _questionData = [];
  _commentsData = [];
  _threeSixtyAssessment = [];
  _pdpSection1Data = [];
  _pdpAcc = [];
  dateOptions: string;
  _formattedDate: string;
  _sErrorMessage = [];
  _bManagerCommentExist = false;
  _intergratedPDPProfile: IntergratedPDP;
  _performUser = {};

  // Option select arrays
  _pdpApproveOptions = [{ 'label': 'Pending' }, { 'label': 'Approved' }, { 'label': 'Declined' }];
  _pdpPriority = [{ 'label': 'High' }, { 'label': 'Medium' }, { 'label': 'Low' }];
  _pdpStatus = [{ 'label': 'Completed' }, { 'label': 'Not Completed' }];

  _submitButton = {
    disabled: false,
    text: 'Submit to Manager'
  };

  _saveButton = {
    disabled: false,
    text: 'Save Draft'
  };

  private readonly onDestroy = new Subject<void>();

  constructor(public _threeSixtyService: ThreeSixtyService,
    public _kraService: KraService,
    public _authService: AuthService,
    private _router: Router,
    public _kraPDPService: KraPdpService,
    private _loaderService: LoaderService,
    private _employeeDirectoryService: EmployeeDirectoryService) { }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._selectedAssessment = this._threeSixtyService._selectedAssessment;
    this._reportData = this._threeSixtyService._reportData;
    this._kraCompanySettings = this._kraService._kraCompanySettings;
    this._sessionUser = this._authService._sessionUser;
    this._pdpSection1Data = this._kraPDPService._kraPDPUserPersonalDetails;
    this._intergratedPDPProfile = this._kraPDPService._intergratedPDPProfileData;
    this._performUser = this._employeeDirectoryService._performUser;

    if (this.isEmpty(this._performUser)) {
      this._performUser = this._sessionUser
    }

    if (this._performUser['P5Corp_userUID']) {
      this._performUser['userUUID'] = this._performUser['P5Corp_userUID'];
    }
    if (this._sessionUser.P5Corp_userUID
      !== this._performUser['userUUID']) {
      this._bManager = true;
    }
    
    if (!this._kraCompanySettings) {
      this._kraService.getKraCompanySettings()
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.setKRACompanySettings();
        });
    } else {
      this.setKRACompanySettings();
    }

    if (this._pdpSection1Data.length === 0) {
      this._kraPDPService.getIntergratedPDPSection1Data(this._performUser['userUUID'])
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.setPDPSection1Details();
        });
    } else {
      this._details = this._pdpSection1Data[0];
    }

    if (!this._bManager) {
      if (this._intergratedPDPProfile['bDraft'] === 0) {
        this._bViewMode = true;
      }
      if (this._intergratedPDPProfile.sDateAdminSigned !== '') {
        this._submitButton.text = 'Save';
      }

      if (this._intergratedPDPProfile && this._intergratedPDPProfile.pdpDevelopmentNeeds.length === 0) {
        this.adjustPDPCount(true, 0);
      }
      this.buildPDPDates();
    } else {
      this._bManager = true;      
      if (this._kraPDPService._currentPDP['status'] === this._authService._sessionUser.companytemplate.sCompletedName) {
        this._bViewMode = true;
      }
      if (!this._intergratedPDPProfile) {
        this._kraPDPService.getIntergratedPDPUserProfile(this._kraPDPService._currentPDP['CompAssessmentUID'],
          this._kraPDPService._currentPDP['EmployeeUID']
        ).pipe(takeUntil(this.onDestroy))
          .subscribe(v => {
            this.setIntergratedPDPData();
          });
      } else {
        this.buildPDPDates();
      }
    }
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  checkLoaderAllClear() {
    let allClear = true;
    if (!this._kraCompanySettings) {
      allClear = false;
    }

    if (!this._pdpSection1Data || this._pdpSection1Data.length === 0) {
      allClear = false;
    }

    if (!this._intergratedPDPProfile) {
      allClear = false;
    }

    if (allClear) {
      this._loaderService.exitLoader();
      this._pageGO = true;
    }
  }

  setKRACompanySettings() {
    this._kraCompanySettings = this._kraService._kraCompanySettings;
    this.checkLoaderAllClear();
  }

  setPDPSection1Details() {
    this._pdpSection1Data = this._kraPDPService._kraPDPUserPersonalDetails;
    this._details = this._pdpSection1Data[0];
    this.checkLoaderAllClear();
  }

  adjustPDPCount(adjustment: boolean, pdpItemIndex) {
    if (adjustment) {
      const pdpObj = new IntergratedPdpDevelopmentNeeds();
      pdpObj.IntergratedPdpOwnDevelopementUID = '';
      pdpObj.sDevelopmentPriority = '';
      pdpObj.sDevelopmentActivity = '';
      pdpObj.iPriority = 0;
      pdpObj.sPriority = '';
      pdpObj.sAcceptStatus = 'Selected';
      pdpObj.dPeriodOfImprovementEnd = '';
      pdpObj['sCurrentState'] = 'Selected';
      pdpObj['bMarkForDelete'] = false;
      pdpObj['accordionID'] = 'ngb1-0-' + this._intergratedPDPProfile.pdpDevelopmentNeeds.length;
      this._intergratedPDPProfile.pdpDevelopmentNeeds.push(pdpObj);

    } else {
      const that = this;
      Swal.fire({
        title: 'Remove PDP',
        text: 'Are you sure you want to remove PDP ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'var(--primary)',
        heightAuto: false,
        cancelButtonColor: 'var(--danger)',
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
      }).then(function (dismiss) {
        if (dismiss['value'] === true) {
          that._intergratedPDPProfile.pdpDevelopmentNeeds[pdpItemIndex]['bMarkForDelete'] = true;
        }
      }).catch();
    }
    this._pageGO = true;
    this._loaderService.exitLoader();
  }

  setIntergratedPDPData() {
    this._selectedAssessment = this._threeSixtyService._selectedAssessment;
    this._intergratedPDPProfile = this._kraPDPService._intergratedPDPProfileData;
    this.buildPDPDates();
  }

  buildPDPDates() {
    const pdpDevelopmentNeedsArray = this._intergratedPDPProfile.pdpDevelopmentNeeds;
    for (let i = 0; i < pdpDevelopmentNeedsArray.length; i++) {
      if (!this._bManager) {
        // employee status
        if (pdpDevelopmentNeedsArray[i]['sAcceptStatus'] === 'Pending' ||
          pdpDevelopmentNeedsArray[i]['sAcceptStatus'] === 'Selected') {
          pdpDevelopmentNeedsArray[i]['sAcceptStatus'] = 'Selected';
          pdpDevelopmentNeedsArray[i]['sManagerStatus'] = '';
        } else if (pdpDevelopmentNeedsArray[i]['sAcceptStatus'] === 'Completed') {
          pdpDevelopmentNeedsArray[i]['sManagerStatus'] = 'Approved';
          pdpDevelopmentNeedsArray[i]['sAcceptStatus'] = 'Completed';
        } else if (pdpDevelopmentNeedsArray[i]['sAcceptStatus'] === 'Accepted') {
          pdpDevelopmentNeedsArray[i]['sManagerStatus'] = 'Approved';
          pdpDevelopmentNeedsArray[i]['sAcceptStatus'] = 'Not Completed';
        } else if (pdpDevelopmentNeedsArray[i]['sAcceptStatus'] === 'Incompleted') {
          pdpDevelopmentNeedsArray[i]['sManagerStatus'] = 'Approved';
          pdpDevelopmentNeedsArray[i]['sAcceptStatus'] = 'Not Completed';
        } else if (pdpDevelopmentNeedsArray[i]['sAcceptStatus'] === 'Approved') {
          pdpDevelopmentNeedsArray[i]['sManagerStatus'] = 'Approved';
          pdpDevelopmentNeedsArray[i]['sAcceptStatus'] = 'Completed';
        } else if (pdpDevelopmentNeedsArray[i]['sAcceptStatus'] === 'Declined') {
          pdpDevelopmentNeedsArray[i]['sAcceptStatus'] = 'Declined';
          pdpDevelopmentNeedsArray[i]['sManagerStatus'] = 'Declined';
        }
      } else {
        // BUILD MANAGER PDP STATUS FOR SECTION 2
        // department view
        if (pdpDevelopmentNeedsArray[i]['sAcceptStatus'] === 'Declined') {
          pdpDevelopmentNeedsArray[i]['sAcceptStatus'] = 'Declined';
        } else if (
          pdpDevelopmentNeedsArray[i]['sAcceptStatus'] === 'Completed' ||
          pdpDevelopmentNeedsArray[i]['sAcceptStatus'] === 'Approved' ||
          pdpDevelopmentNeedsArray[i]['sAcceptStatus'] === 'Accepted' ||
          pdpDevelopmentNeedsArray[i]['sAcceptStatus'] === 'Incompleted'
        ) {
          pdpDevelopmentNeedsArray[i]['sAcceptStatus'] = 'Approved';
        } else if (pdpDevelopmentNeedsArray[i]['sAcceptStatus'] === 'Selected' ||
          pdpDevelopmentNeedsArray[i]['sAcceptStatus'] === 'Pending') {
          pdpDevelopmentNeedsArray[i]['sAcceptStatus'] = 'Pending';
        }

        // check manager comments
        for (let c = 0; c < pdpDevelopmentNeedsArray[i]['comments'].length; c++) {
          if (pdpDevelopmentNeedsArray[i]['comments'][c]['sCommentBy'] === this._sessionUser.sFullName) {
            this._bManagerCommentExist = true;
          }
        }
      }
    }

    // SECTION 3
    const pdpCompetenciesArray = this._intergratedPDPProfile.pdpCompetencies;
    for (let x = 0; x < pdpCompetenciesArray.length; x++) {

      // BUILD PDP STATUS FOR SECTION 3
      if (!this._bManager) {
        // employee status
        if (pdpCompetenciesArray[x]['sAcceptStatus'] === 'Pending' ||
          pdpCompetenciesArray[x]['sAcceptStatus'] === 'Selected') {

          pdpCompetenciesArray[x]['sAcceptStatus'] = 'Selected';
          pdpCompetenciesArray[x]['sManagerStatus'] = '';
        } else if (pdpCompetenciesArray[x]['sAcceptStatus'] === 'Completed') {
          pdpCompetenciesArray[x]['sManagerStatus'] = 'Approved';
          pdpCompetenciesArray[x]['sAcceptStatus'] = 'Completed';
        } else if (pdpCompetenciesArray[x]['sAcceptStatus'] === 'Accepted') {
          pdpCompetenciesArray[x]['sManagerStatus'] = 'Approved';
          pdpCompetenciesArray[x]['sAcceptStatus'] = 'Not Completed';
        } else if (pdpCompetenciesArray[x]['sAcceptStatus'] === 'Incompleted') {
          pdpCompetenciesArray[x]['sManagerStatus'] = 'Approved';
          pdpCompetenciesArray[x]['sAcceptStatus'] = 'Not Completed';
        } else if (pdpCompetenciesArray[x]['sAcceptStatus'] === 'Approved') {
          pdpCompetenciesArray[x]['sManagerStatus'] = 'Approved';
          pdpCompetenciesArray[x]['sAcceptStatus'] = 'Completed';
        } else if (pdpCompetenciesArray[x]['sAcceptStatus'] === 'Declined') {
          pdpCompetenciesArray[x]['sAcceptStatus'] = 'Declined';
          pdpCompetenciesArray[x]['sManagerStatus'] = 'Declined';
        }
      } else {
        // BUILD MANAGER PDP STATUS FOR SECTION 3
        // department view
        if (pdpCompetenciesArray[x]['sAcceptStatus'] === 'Declined') {
          pdpCompetenciesArray[x]['sAcceptStatus'] = 'Declined';
        } else if (
          pdpCompetenciesArray[x]['sAcceptStatus'] === 'Completed' ||
          pdpCompetenciesArray[x]['sAcceptStatus'] === 'Approved' ||
          pdpCompetenciesArray[x]['sAcceptStatus'] === 'Accepted' ||
          pdpCompetenciesArray[x]['sAcceptStatus'] === 'Incompleted'
        ) {
          pdpCompetenciesArray[x]['sAcceptStatus'] = 'Approved';
        } else if (pdpCompetenciesArray[x]['sAcceptStatus'] === 'Selected' ||
          pdpCompetenciesArray[x]['sAcceptStatus'] === 'Pending') {
          pdpCompetenciesArray[x]['sAcceptStatus'] = 'Pending';
        }

        // check manager comments
        for (let c = 0; c < pdpCompetenciesArray[x]['comments'].length; c++) {
          if (pdpCompetenciesArray[x]['comments'][c]['sCommentBy'] === this._sessionUser.sFullName) {
            this._bManagerCommentExist = true;
          }
        }
      }
    }
    this.checkLoaderAllClear();
  }

  validatePDP(bDraft) {
    let sMessage = '';

    let numberOfDevelopmentNeeds = 0;
    numberOfDevelopmentNeeds = this._intergratedPDPProfile.pdpDevelopmentNeeds.length;
    let pdpDevelopmentNeedsArray = [];
    pdpDevelopmentNeedsArray = this._intergratedPDPProfile.pdpDevelopmentNeeds;

    let numberOfPDPCompetencies = 0;
    numberOfPDPCompetencies = this._intergratedPDPProfile.pdpCompetencies.length;
    let pdpCompetenciesArray = [];
    pdpCompetenciesArray = this._intergratedPDPProfile.pdpCompetencies;
    
    if (!this._bViewMode) {
      // first validate data for the development needs - SECTION 2
      for (let i = 0; i < numberOfDevelopmentNeeds; i++) {
        if (this._bManager) {
          if (pdpDevelopmentNeedsArray[i]['sAcceptStatus'] === 'Pending') {
            sMessage = sMessage + 'Please Approve/ Decline PDP at section 2: Development Need ' + (i + 1) + '<br>';
          }
        } else {
          if (!pdpDevelopmentNeedsArray[i]['bMarkForDelete']) {
            if (this._kraCompanySettings.bShowDevelopmentNeedOnPDP) {
              if (pdpDevelopmentNeedsArray[i]['sDevelopmentPriority'] === '') {
                sMessage = sMessage + 'Input for ' +
                  this._kraCompanySettings['sPDPDevelopmentNeedChange'] + ' at section 2: Development Need ' + (i + 1) + '<br>';
              }
            }
            if (pdpDevelopmentNeedsArray[i]['sDevelopmentActivity'] === '') {
              sMessage = sMessage + 'Input for ' +
                this._kraCompanySettings['sPDPActivitiesChange'] + ' at section 2: Development Need ' + (i + 1) + '<br>';
            }
            if (pdpDevelopmentNeedsArray[i]['dPeriodOfImprovementEnd'] === null ||
              pdpDevelopmentNeedsArray[i]['dPeriodOfImprovementEnd'] === '') {
              sMessage = sMessage + 'Input for ' +
                this._kraCompanySettings['sPDPDueDateChange'] + ' at section 2: Development Need ' + (i + 1) + '<br>';
            }
            if (pdpDevelopmentNeedsArray[i]['sPriority'] === '') {
              sMessage = sMessage + 'Input for ' +
                this._kraCompanySettings['sPDPPriorityChange'] + ' at section 2: Development Need ' + (i + 1) + '<br>';
            }
          }
        }
      }

      //  validate data for the PDP Competencies - SECTION 3
      for (let x = 0; x < numberOfPDPCompetencies; x++) {
        if (this._bManager) {
          if (pdpCompetenciesArray[x]['sAcceptStatus'] === 'Pending') {
            sMessage = sMessage + 'Please Approve/ Decline PDP at section 3: Competency ' + (x + 1) + '<br>';
          }
        } else {
          if (pdpCompetenciesArray[x]['dPeriodOfImprovementEnd'] == null ||
            pdpCompetenciesArray[x]['dPeriodOfImprovementEnd'] === '') {
            sMessage = sMessage + 'Input for ' +
              this._kraCompanySettings['sPDPDueDateChange'] + ' at section 3: Competency ' + (x + 1) + '<br>';
          }
          if (pdpCompetenciesArray[x]['sPriority'] === '') {
            sMessage = sMessage + 'Input for ' +
              this._kraCompanySettings['sPDPPriorityChange'] + ' at section 3: Competency ' + (x + 1) + '<br>';
          }
        }
      }

      //  validate data for the PDP Career Goals - SECTION 4
      if (this._intergratedPDPProfile['sShortTermGoals'] === '') {
        sMessage = sMessage + 'Input for Short Term Goal at section 4: Career Goals<br>';
      }
      if (this._intergratedPDPProfile['sMediumTermGoals'] === '') {
        sMessage = sMessage + 'Input for Medium Term Goal at section 4: Career Goals<br>';
      }
      if (this._intergratedPDPProfile['sLongTermGoals'] === '') {
        sMessage = sMessage + 'Input for Long Term Goal at section 4: Career Goals<br>';
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
        this.saveIntergratedPDP(bDraft);
      }
    } else {
      this.saveIntergratedPDP(bDraft);
    }
  }

  saveIntergratedPDP(bDraft) {
    this._loaderService.initLoader(true);
    let sStatus: String = 'No action';
    let pdpDevelopmentNeedsArray = [];
    pdpDevelopmentNeedsArray = this._intergratedPDPProfile.pdpDevelopmentNeeds;
    let pdpCompetenciesArray = [];
    pdpCompetenciesArray = this._intergratedPDPProfile.pdpCompetencies;

    // set section 2 object data
    pdpDevelopmentNeedsArray.forEach(pdp => {
      // employee objects
      if (!this._bManager) {
        if (pdp['sAcceptStatus'] === 'Declined') {
          pdp['sCurrentState'] = 'Declined';
        } else if (pdp['sAcceptStatus'] === 'Selected') {
          pdp['sCurrentState'] = 'Selected';
        } else if (pdp['IntergratedPdpOwnDevelopementUID'] === '') { // new pdp
          pdp['sCurrentState'] = 'Selected';
        } else {
          pdp['sCurrentState'] = 'Accepted';
        }
        if (pdp['sAcceptStatus'] !== '' && pdp['sAcceptStatus'] !== 'Not Completed') {
          pdp['sStatus'] = pdp.sAcceptStatus;
        } else {
          pdp['sStatus'] = sStatus;
        }

        // Manager objects
      } else {
        if (pdp['sAcceptStatus'] === 'Approved' || pdp['sAcceptStatus'] === 'Approved') {
          sStatus = 'Approve';
        } else if (pdp['sAcceptStatus'] === 'Declined') {
          sStatus = 'Decline';
        }
        pdp['sStatus'] = sStatus;
        pdp['bMarkForDelete'] = false;
        pdp['sCurrentState'] = 'Selected';
      }
      if (pdp['sPriority'] === 'Medium') {
        pdp['iPriority'] = 1;
      } else if (pdp['sPriority'] === 'Low') {
        pdp['iPriority'] = 2;
      } else {
        pdp['iPriority'] = 0;
      }
    });

    // set section 3 object data
    pdpCompetenciesArray.forEach(pdp => {
      // employee objects
      if (!this._bManager) {
        if (pdp['sAcceptStatus'] === 'Declined') {
          pdp['sCurrentState'] = 'Declined';
        } else if (pdp['sAcceptStatus'] === 'Selected') {
          pdp['sCurrentState'] = 'Selected';
        } else if (pdp['IntergratedPdpCompetenciesUID'] === '') { // new pdp
          pdp['sCurrentState'] = 'Selected';
        } else {
          pdp['sCurrentState'] = 'Accepted';
        }
        if (pdp['sAcceptStatus'] !== '' && pdp['sAcceptStatus'] !== 'Not Completed') {
          pdp['sStatus'] = pdp.sAcceptStatus;
        } else {
          pdp['sStatus'] = sStatus;
        }

        // Manager objects
      } else {
        if (pdp['sAcceptStatus'] === 'Approved' || pdp['sAcceptStatus'] === 'Approved') {
          sStatus = 'Approve';
        } else if (pdp['sAcceptStatus'] === 'Declined') {
          sStatus = 'Decline';
        }
        pdp['sStatus'] = sStatus;
        pdp['bMarkForDelete'] = false;
        pdp['sCurrentState'] = 'Selected';
      }
      if (pdp['sPriority'] === 'Medium') {
        pdp['iPriority'] = 1;
      } else if (pdp['sPriority'] === 'Low') {
        pdp['iPriority'] = 2;
      } else {
        pdp['iPriority'] = 0;
      }
    });

    this._submitButton['text'] = 'Submitting...';

    this._kraPDPService.saveIntergratedPDP(bDraft, this._intergratedPDPProfile['CompAssessmentUID'], this._bManager)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.updatePDPView();
      });
  }

  isEmpty(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  updatePDPView() {
    this._router.navigate(['grow'], { replaceUrl: true });
  }

  goActivitySummary() {
    this._router.navigate(['grow'], { replaceUrl: true });
  }

  goBack() {
    this._router.navigate(['grow/pdp/integrated/assessment'], { replaceUrl: true });
  }

}
