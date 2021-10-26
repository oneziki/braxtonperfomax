import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IntergratedPDP, IntergratedPdpCompetencies, KraCompanySettings, ThreeSixtyAssessee, ThreeSixtyAssessment, ThreeSixtyQuestionnaire, SessionUser } from '../../../../../_models/index';
import { AuthService, KraPdpService, KraService, LoaderService, ThreeSixtyService, EmployeeDirectoryService } from '../../../../../_services/index';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.page.html',
  styleUrls: ['./assessment.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AssessmentPage implements OnInit, OnDestroy {

  public _questionnaireTitle: string;
  public _sAssesseeFullName: string;
  public _sAssesseeInitials: string;

  
  _sessionUser: SessionUser;
  _kraCompanySettings: KraCompanySettings;
  _threeSixty_questionnaire: ThreeSixtyQuestionnaire;
  _selectedAssessee: ThreeSixtyAssessee;
  _selectedAssessment: ThreeSixtyAssessment;
  _pageGO = false;
  _accOutcome = [];
  _reportData: Object = {};
  _details: Object = {};
  _legend = [];
  _bViewMode = false;
  _lenseData = [];
  _questionData = [];
  _commentsData = [];
  _threeSixtyAssessment = [];
  _intergratedPDPProfile: IntergratedPDP;
  _conductPDPButton = {
    disabled: false,
    text: 'Complete PDP'
  };
  _selectAll = false;
  _bManager = false;

  _isLoadingKRACompanySettings = true;
  _isLoadingReportData = true;
  _isLoading = true;

  private readonly onDestroy = new Subject<void>();

  constructor(public _threeSixtyService: ThreeSixtyService,
    public _kraService: KraService,
    private _pdpService: KraPdpService,
    public _authService: AuthService,
    private _router: Router,
    private _loaderService: LoaderService,
    private _employeeDirectoryService: EmployeeDirectoryService) { }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._selectedAssessment = this._threeSixtyService._selectedAssessment;
    this._sessionUser = this._authService._sessionUser;
    this._reportData = this._threeSixtyService._reportData;
    this._kraCompanySettings = this._kraService._kraCompanySettings;
    this._intergratedPDPProfile = this._pdpService._intergratedPDPProfileData;

    if (this._sessionUser['P6_userUID'] !== this._employeeDirectoryService._performUser['P6_userUID']) {
      this._bManager = true;
    }

    this._pdpService.getIntergratedPDPUserProfile(this._selectedAssessment.compAssessmentUID, this._authService._sessionUser.P5Corp_userUID)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => { 
        this.setIntergratedPDPData();
      });
    
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
    this._isLoadingKRACompanySettings = false;
    this.checkLoaderAllClear();
  }

  setIntergratedPDPData() {
    this._intergratedPDPProfile = this._pdpService._intergratedPDPProfileData;
    if (this.isEmpty(this._intergratedPDPProfile)) {
      this._intergratedPDPProfile = new IntergratedPDP();
      this._intergratedPDPProfile['CompAssessmentUID'] = this._selectedAssessment.compAssessmentUID;

    } else if (this._intergratedPDPProfile['bDraft'] === 0) {
      this._bViewMode = true;
    }

    if (this._bManager || this._bViewMode) {
      this._conductPDPButton.text = 'View PDP';
    }

    if (this.isEmpty(this._threeSixtyService._reportData)) {
      this.buildAssesse();
    } else {
      this.setReportData();
    }
  }

  buildAssesse() {
    const assesse: ThreeSixtyAssessee = new ThreeSixtyAssessee();
    assesse.compAssessmentUID = this._selectedAssessment.compAssessmentUID,
      assesse.assesseeUUID = this._authService._sessionUser.P5Corp_userUID,
      assesse.assessorUUID = this._selectedAssessment.sAssessorInternal_fkUserUUID,
      assesse.sFirstName = this._authService._sessionUser.sFirstname,
      assesse.sLastName = this._authService._sessionUser.sLastName,
      assesse.sAssesseeFullName = this._authService._sessionUser.sFullName,
      assesse.compAssessorTypeUID = this._selectedAssessment['compAssessorTypeUID'],
      assesse.sAssessmentName = this._selectedAssessment.sAssessmentName,
      assesse.dDateCompleted = this._selectedAssessment.dDateCompleted,
      this._selectedAssessee = assesse;

    this._threeSixtyService.getThreeSixtyReport(this._selectedAssessee)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.setReportData();
      });
  }

  setReportData() {
    this._threeSixtyAssessment = [];
    this._loaderService.initLoader(true);
    this._reportData = this._threeSixtyService._reportData;
    this._questionData = this._reportData['questionData'];
    this._pageGO = true;

    for (let i = 0; i < this._questionData['sCompetencyType'].length; i++) {
      for (let j = 0; j < this._questionData['sCompetencyType'][i]['Competencies'].length; j++) {
        this._questionData['sCompetencyType'][i]['Competencies'][j]['Outcomes'].forEach(qd => {
          qd['showDetails'] = true;
          this._threeSixtyAssessment.push(qd);
          this._threeSixtyAssessment[this._threeSixtyAssessment.length - 1]['questions'] = [];
        });
      }
    }

    if (this._intergratedPDPProfile && this._intergratedPDPProfile.pdpCompetencies && this._intergratedPDPProfile.pdpCompetencies.length) {
      this._intergratedPDPProfile.pdpCompetencies.forEach(element => {
        this._threeSixtyAssessment.forEach(outcome => {
          outcome['Indicators'].forEach(indicator => {
            if (indicator['sIndicatorName'] === element['sIndicatorName']) {
              indicator['bIncludeInPDP'] = true;
            }
          });

        });
      });
    }

    this._isLoadingReportData = false;
    this.checkLoaderAllClear();
  }

  IncludeAllCheckboxChange(e) {
    this._threeSixtyAssessment.forEach(outcome => {      
      outcome['Indicators'].forEach(indicator => {
        if (e.target.checked) {
          indicator['bIncludeInPDP'] = false;
        } else {
          indicator['bIncludeInPDP'] = true;
        }
      });
    });
  }

  toggleOutcome(data) {
    if (data.showDetails) {
        data.showDetails = false;
    } else {
        data.showDetails = true;
    }
  }

  conductPDP() {
    let bExist = false;
    this._threeSixtyAssessment.forEach(outcome => {
      bExist = false;
      outcome['Indicators'].forEach(indicator => {
        if (indicator['bIncludeInPDP']) {
          this._intergratedPDPProfile.pdpCompetencies.forEach(element => {
            if (indicator['competencyHrURPIndicatorUID'] === element['competencyHrURPIndicatorUID']) {
              element['bIncludeInPDP'] = indicator['bIncludeInPDP'];
              bExist = true;
            }
          });

          if (!bExist) {
            const pdpCompetencies = new IntergratedPdpCompetencies();
            pdpCompetencies.IntergratedPdpCompetenciesUID = '';
            pdpCompetencies.sIndicatorName = indicator['sIndicatorName'];
            pdpCompetencies.sOutcomeName = outcome['sOutcomeName'];
            pdpCompetencies.competencyHrURPOutomeUID = outcome['competencyHrURPOutomeUID'];
            pdpCompetencies.competencyHrURPIndicatorUID = indicator['competencyHrURPIndicatorUID'];
            pdpCompetencies.dPeriodOfImprovementEnd = '';
            pdpCompetencies.fScoreValue = indicator['sScore'];
            pdpCompetencies.sPriority = '';
            pdpCompetencies.sAcceptStatus = 'Selected';
            pdpCompetencies['bIncludeInPDP'] = true;
            this._intergratedPDPProfile.pdpCompetencies.push(pdpCompetencies);
          }
          bExist = false;
        } else {
          if (this._intergratedPDPProfile.pdpCompetencies) {
            this._intergratedPDPProfile.pdpCompetencies.forEach(element => {
              if (indicator['competencyHrURPIndicatorUID'] === element['competencyHrURPIndicatorUID']) {
                element['bIncludeInPDP'] = indicator['bIncludeInPDP'];
              }
            });
          }
        }
      });
    });
    this._pdpService._intergratedPDPProfileData = this._intergratedPDPProfile;
    this._router.navigate(['grow/pdp/integrated/design'], { replaceUrl: true });
  }

  isEmpty(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  checkLoaderAllClear() {
    let toReturn = true;

    if (this._isLoadingKRACompanySettings) {
      toReturn = false;
    }
    if (this._isLoadingReportData) {
      toReturn = false;
    }

    if (toReturn === true) {
      this._isLoading = false;
      this._loaderService.exitLoader();
    }
  }

  goNext() {
    this._router.navigate(['grow/pdp/integrated/design'], { replaceUrl: true });
  }

  goBack() {
    this._router.navigate(['grow/pdp/integrated/list'], { replaceUrl: true });
  }

}
