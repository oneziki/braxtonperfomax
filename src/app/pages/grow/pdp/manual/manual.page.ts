import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService, EmployeeDirectoryService, KraPdpService, KraService, LoaderService } from '../../../../_services/index';
import { KraCompanySettings, SessionUser } from 'src/app/_models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manual',
  templateUrl: './manual.page.html',
  styleUrls: ['./manual.page.scss'],
})
export class ManualPage implements OnInit, OnDestroy {
  private readonly onDestroy = new Subject<void>();

  _sessionUser: SessionUser;
  _pdpProfile = [];
  _learningCategories = [];
  _learningData = [];
  _kraCompanySettings: KraCompanySettings;
  _iActivePDP = 0;
  _bManager = false;
  _performUser = {};
  _bCannotEditPDP = true;
  _bDisplayNoData = false;
  _bisLoading = true;
  _sSubmitButtonText = 'Submit To Manager';
  _bShowSubmitButton = false;

  // Option select arrays
  _pdpApproveOptions = [{ 'label': 'Pending' }, { 'label': 'Approved' }, { 'label': 'Declined' }];
  _pdpPriority = [{ 'label': 'High' }, { 'label': 'Medium' }, { 'label': 'Low' }];
  _pdpStatus = [{ 'label': 'Completed' }, { 'label': 'Not Completed' }];

  constructor (private _router: Router,
    public _authService: AuthService,
    public _loaderService: LoaderService,
    public _kraPDPService: KraPdpService,
    public _kraService: KraService,
    public _employeeDirectoryService: EmployeeDirectoryService) { }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._authService.hideAppPanel(true);
    this._kraCompanySettings = this._kraService._kraCompanySettings;
    this._sessionUser = this._authService._sessionUser;
    this._performUser = this._employeeDirectoryService._performUser;

    if (this.isEmpty(this._performUser)) {
      this._performUser = this._sessionUser
    }

    if (this._performUser['P5Corp_userUID']) {
      this._performUser['userUUID'] = this._performUser['P5Corp_userUID'];
    }
    if (this._sessionUser.P5Corp_userUID !== this._performUser['userUUID']) {
      this._bManager = true;
      this._sSubmitButtonText = 'Confirm';
      this._bShowSubmitButton = true;
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
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  setKRACompanySettings() {
    this._kraCompanySettings = this._kraService._kraCompanySettings;
    this.getPdpData()
  }

  getPdpData() {
    this._kraPDPService.getUserPDPProfile(this._kraPDPService._sYear, this._bManager, this._performUser['userUUID'])
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.emitUpdatePDP();
      });
  }

  emitUpdatePDP() {
    this._pdpProfile = this._kraPDPService._kraPDPProfileData['pdpProfile'];
    this._learningCategories = this._kraPDPService._kraPDPProfileData['learningCategories'];

    if (!this._pdpProfile.length && !this._bManager) {
      this.adjustPDPCount(true, 0);
    } else {
      if (this._pdpProfile.length) {
        this._pdpProfile.forEach(pdp => {
          pdp['bView'] = true;
          if (this._bManager) {
            // department view
            if (pdp['sAcceptStatus'] === 'Declined') {
              pdp['sAcceptStatus'] = 'Declined';
            } else if (
              pdp['sAcceptStatus'] === 'Completed' ||
              pdp['sAcceptStatus'] === 'Approved' ||
              pdp['sAcceptStatus'] === 'Accepted' ||
              pdp['sAcceptStatus'] === 'Incompleted'
            ) {
              pdp['sAcceptStatus'] = 'Approved';
            } else if (pdp['sAcceptStatus'] === 'Selected' || pdp['sAcceptStatus'] === 'Pending') {
              pdp['sAcceptStatus'] = 'Pending';
              this._bCannotEditPDP = false;
            }
          } else {
            this._bCannotEditPDP = false;
            if (pdp['sAcceptStatus'] === 'Completed' || pdp['sAcceptStatus'] === 'Pending') {
              pdp['sAcceptStatus'] = 'Completed';
            } else if (pdp['sAcceptStatus'] === 'Incompleted') {
              pdp['sAcceptStatus'] = 'Not Completed';
            } else if (pdp['sAcceptStatus'] === 'Approved') {
              pdp['sAcceptStatus'] = 'Completed';
            } else if (pdp['sAcceptStatus'] === 'Declined') {
              pdp['sAcceptStatus'] = 'Declined';
            }
            if (pdp['sAcceptStatus'] === 'Declined') {
              pdp['sManagerStatus'] = 'Decline';
            } else if (
              pdp['sAcceptStatus'] === 'Completed' ||
              pdp['sAcceptStatus'] === 'Approved' ||
              pdp['sAcceptStatus'] === 'Incompleted'
            ) {
              pdp['sManagerStatus'] = 'Approved';
            } else if (pdp['sAcceptStatus'] === 'Selected' || pdp['sAcceptStatus'] === 'Pending') {
              pdp['sManagerStatus'] = '';
            }
          }
        });
      } else {
        this._bDisplayNoData = true;
      }

    }
    this._bisLoading = false;
    this._loaderService.exitLoader();
  }

  adjustPDPCount(adjustment: boolean, pdpIndex) {
    if (adjustment) {
      const pdpObj = {
        'learningInterventionUID': '',
        'learningInterventionCategoryUID': '',
        'pdpOwnDevelopmentUID': '',
        'pdpOwnDevelopmentLearningUID': '',
        'sDevelopmentPriority': '',
        'sDescription': '',
        'sComment': '',
        'comments': [],
        'sPriority': '',
        'iPriority': '',
        'dPeriodOfImprovementEnd': '',
        'sCurrentState': 'Selected',
        'bMarkForDelete': false,
        'activePDP': 0,
        'bView': false
      };
      this._pdpProfile.push(pdpObj);
      this._iActivePDP = this._pdpProfile.length - 1;
    } else {
      this._pdpProfile = this._pdpProfile.filter(item => this._pdpProfile.indexOf(item) !== pdpIndex);
      this._iActivePDP = this._pdpProfile.length - 1;
    }

    const iPDP = this._pdpProfile.findIndex(x => x['pdpOwnDevelopmentUID'] === '');

    if (iPDP !== -1) {
      this._bShowSubmitButton = true;
    } else {
      this._bShowSubmitButton = false;
    }
  }

  pdpTabChanged(iPDP) {
    this._iActivePDP = iPDP;
  }

  validateProfile() {
    let sMessage = '';
    let sStatus: String = 'No action';

    this._pdpProfile.forEach(pdp => {
      if (this._sessionUser.P5Corp_userUID === this._performUser['userUUID']) {
        if (pdp['siPriority'] === 'High') {
          pdp['iPriority'] = 0;
        } else if (pdp['siPriority'] === 'Medium') {
          pdp['iPriority'] = 1;
        } else {
          pdp['iPriority'] = 2;
        }
        if (pdp['sDevelopmentPriority'] === '') {
          sMessage = sMessage + 'Please enter ' + this._kraCompanySettings.sPDPDevelopmentNeedChange + '<br>';
        }
        if (pdp['sDescription'] === '') {
          sMessage = sMessage + 'Please enter ' + this._kraCompanySettings.sPDPActivityDescriptionChange + '<br>';
        }
        if (pdp['dPeriodOfImprovementEnd'] === '' || !pdp['dPeriodOfImprovementEnd']) {
          sMessage = sMessage + 'Please enter ' + this._kraCompanySettings.sPDPDueDateChange + '<br>';
        }
        if (pdp['sPriority'] === '') {
          sMessage = sMessage + 'Please select a  Priority' + '<br>';
        }
        if (pdp['sComment'] === '') {
          sMessage = sMessage + 'Please leave a comment' + '<br>';
        }
        if (pdp['sAcceptStatus'] === 'Declined') {
          pdp['sCurrentState'] = 'Declined';
        } else if (pdp['pdpOwnDevelopmentUID'] === '') { // new pdp
          pdp['sCurrentState'] = 'Selected';
        } else {
          pdp['sCurrentState'] = 'Accepted';
        }
        if (pdp['sAcceptStatus'] !== '') {
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
    });

    if (this._kraCompanySettings['bMakePDPMandatory'] && this._pdpProfile.length === 0) {
      sMessage = sMessage + 'Please fill in at least one development needs' + '<br>';
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
      this._kraPDPService.savePDPContract(this._pdpProfile, this._bManager, this._performUser['userUUID'])
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.goGrowPage();
        })
    }
  }

  getTabName(name) {
    if (name.length) {
      return name;
    } else {
      return this._kraCompanySettings.sPDPDevelopmentNeedChange;
    }
  }

  goGrowPage() {
    this._router.navigate(['grow'], { replaceUrl: true });
  }

  isEmpty(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

}
