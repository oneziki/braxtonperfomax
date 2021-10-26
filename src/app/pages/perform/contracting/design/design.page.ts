import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, KraService, LoaderService, PrintToolService } from 'src/app/_services';
import { KraCompanySettings, SessionUser } from 'src/app/_models';
import { ignoreElements, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-design',
  templateUrl: './design.page.html',
  styleUrls: ['./design.page.scss'],
})
export class DesignPage implements OnInit, OnDestroy {
  private readonly onDestroy = new Subject<void>();

  _sessionUser: SessionUser;
  _userProfileData = {}
  _kraCompanySettings: KraCompanySettings;
  _performanceAgreementData: object;
  _sRoleToEmployee: string;
  _sErrorMessage = [];
  _kraURPData = {};
  _KRAStatus = '';

  _removedKras = [];
  _templateScaleItems = [];


  _bEmployeeCompleting = false;
  _bManagerCompleting = false;
  _bCannotEditAgreement = true;
  _bShowPrintButton = false;

  _design = {
    weight: 0,
    busObjectives: []
  };

  _saveButton = {
    disabled: false,
    text: 'Save Draft'
  };
  _submitButton = {
    disabled: false,
    text: 'Submit to Manager'
  };
  _confirmButton = {
    disabled: false,
    text: 'Confirm'
  };

  constructor(private _router: Router,
    private _kraService: KraService,
    private _loaderService: LoaderService,
    public _authService: AuthService,
    private _printToolService: PrintToolService) { }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._kraCompanySettings = this._kraService._kraCompanySettings;
    this._sRoleToEmployee = this._kraService._sRoleToEmployee;
    this._sessionUser = this._authService._sessionUser;
    this._kraURPData = this._kraService._p7kraRoleProfileData['personalDetails'];
    this._userProfileData = this._kraURPData;
    this._KRAStatus = this._kraService.getStatusOption();

    if (this._sRoleToEmployee === 'Employee') {
      this._submitButton = {
        disabled: false,
        text: 'Submit to Manager'
      };
      this._bEmployeeCompleting = true;
      this._bManagerCompleting = false;

      this._bShowPrintButton = this._KRAStatus === this._kraService.taskStatusOptions['Completed'] || this._KRAStatus === this._kraService.taskStatusOptions['Draft'];

      if (this._KRAStatus === 'bView') {
        this._bCannotEditAgreement = true;
      } else {

        if (this._kraURPData['sAllocatedRoleType'] === 'Role Based') {
          this._bCannotEditAgreement = (this._kraURPData['bCanEdit'] === 0);
        } else {
          this._bCannotEditAgreement = false;
        }
      }

    } else {
      this._bEmployeeCompleting = false;
      this._bManagerCompleting = true;
      this._bShowPrintButton = true;

      this._submitButton = {
        disabled: false,
        text: 'Submit to Employee'
      };
    }
    this.emitUpdateAgreement();


  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  emitUpdateStatusAgreement() {
    this._router.navigate(['perform'], { replaceUrl: true });
    this._loaderService.exitLoader();
  }

  emitUpdateAgreement() {

    this._performanceAgreementData = this._kraService._kraPerformanceAgreementData.performanceAgreement;
    if (this._kraService._performanceAgreementProfile.objectivesData.length > 0 && this._kraURPData['sAllocatedRoleType'] !== 'Role Based') {
      this._design.busObjectives = this._kraService._performanceAgreementProfile.objectivesData;
    } else {
      this._design.busObjectives = this._performanceAgreementData['businessObjectives'];
    }

    if (this._kraCompanySettings.bAddOwnScaleDescription && this._sRoleToEmployee === 'Employee') {
      this._templateScaleItems = [];
      this._performanceAgreementData['defaultScales'].forEach(scale => {
        const itemScale = {
          fScaleScoreValue: scale['iOrder'], iScaleItemOrder: scale['iOrder'], kraHrPLIBKpiScaleDetailUID: ''
          , placeholder: scale['sName'], sScaleDescription: ''
        };
        this._templateScaleItems.push(itemScale);
      });

      this._templateScaleItems.splice(this._kraCompanySettings.iAmountScaleItems, this._templateScaleItems.length - 1);

      if (this._kraCompanySettings.iAmountScaleItems !== this._templateScaleItems.length) {

        for (let i = this._templateScaleItems.length; i < this._kraCompanySettings.iAmountScaleItems; i++) {
          const itemScale = {
            fScaleScoreValue: i + 1,
            iScaleItemOrder: i + 1,
            kraHrPLIBKpiScaleDetailUID: '',
            placeholder: '',
            sScaleDescription: ''
          };
          this._templateScaleItems.push(itemScale);
        }

      }

      if (this._kraURPData['sAllocatedRoleType'] === 'Template View' &&
        this._KRAStatus !== this._kraService.taskStatusOptions['Completed'] && this._sRoleToEmployee === 'Employee') {
        if (this._kraService._performanceAgreementProfile.objectivesData.length === 0) {
          this._design.busObjectives = [];
        }
        this.setDefaultKras();
      }
    }

    this._design.busObjectives.forEach((businessObjective) => {
      businessObjective['activeKra'] = 0;
      businessObjective['Kra'].forEach((kra) => {
        kra['activeKpi'] = 0;
        if (this._kraCompanySettings.bAddOwnScaleDescription && this._sRoleToEmployee === 'Employee') {
          kra['Kpi'].forEach((kpi) => {
            if (kpi['scales'].length < this._templateScaleItems.length) {
              kpi['scales'] = JSON.parse(
                JSON.stringify(this._templateScaleItems)
              );
            }
          });
        }
      });
    });

    this._sRoleToEmployee = this._kraService._sRoleToEmployee;
    this.setKraWeight();
    this._loaderService.exitLoader();
  }

  emitRoleProfileData() {
    this._userProfileData = this._kraURPData['personalDetails'];
  }

  kraTabChanged(busObj, iKra) {
    busObj['activeKra'] = iKra;
  }
  kpiTabChanged(kra, iKpi) {
    kra['activeKpi'] = iKpi;
  }

  setDefaultKras() {
    const busObjArray = this._kraService._performanceAgreementProfile.objectivesData;
    // KRA open on default per objective
    busObjArray.forEach(bo => {
      if (bo['Kra'].length < this._kraCompanySettings.iMinimumTotalKras) {

        const amountToAdd = this._kraCompanySettings.iMinimumTotalKras - bo['Kra'].length;
        for (let j = 0; j < amountToAdd; j++) {
          this.adjustKRAsCount(bo, true);
        }
      }
    });
    // 1 KPI open by default per KRA
    busObjArray.forEach(bo => {
      bo['Kra'].forEach(kra => {
        if (kra['Kpi'].length < 1) {
          this.adjustCountKPI(kra, 0, true);
        }

      });
    });
  }

  setKraWeight() {
    this._sErrorMessage = [];
    let kraWeightCounter = 0;
    let totalKPIS = 0;

    // get the number of kpis first
    this._design.busObjectives.forEach(objective => {
      objective.Kra.forEach(kraItem => {
        kraItem.Kpi.forEach(kpiItem => {
          totalKPIS++;
        });
      });
    });

    const fWeight = 100 / totalKPIS;
    fWeight.toFixed(2);
    this._design.busObjectives.forEach(objective => {
      objective.Kra.forEach(kraItem => {
        let kpiWeightCounter = 0;
        kraItem.Kpi.forEach(kpiItem => {
          if (this._kraCompanySettings['bShowWeightingsOnAgreement'] === 0 && this._kraURPData['sAllocatedRoleType'] === 'Template View') {
            kpiItem.fWeight = Math.floor(fWeight);
          } else {
            kpiItem.fWeight = Math.floor(kpiItem.fWeight);
          }
          kpiWeightCounter = Math.floor(kpiWeightCounter) + kpiItem.fWeight;
        });
        kraItem.weight = Math.round(kpiWeightCounter * 100) / 100;
        kraWeightCounter = kraWeightCounter + (Math.round(kraItem.weight * 100) / 100);
      });
    });

    // KEY RESULT AREA CAPABILITY
    this._design.weight = Math.round(kraWeightCounter * 100) / 100;

    if (this._design.weight !== 100 && this._kraCompanySettings.bShowWeightings) {
      this._submitButton['disabled'] = true;
      this._sErrorMessage.push('Your total weight is ' + this._design.weight + '%. Please ensure the total weight is equal to 100%, however, you may still save as draft');
    } else {
      this._submitButton['disabled'] = false;
      this._sErrorMessage = [];
    }
  }

  setKPIWeight(kra, kpiIndex, adjustment: boolean) {
    if (adjustment) {
      kra['Kpi'][kpiIndex]['fWeight']++;
    } else {
      kra['Kpi'][kpiIndex]['fWeight']--;
    }
    this.setKraWeight();
  }

  adjustKRAsCount(busObj, adjustment: boolean) {

    if (adjustment) {
      if (!busObj['Kra']) {
        busObj['Kra'] = [];
      }
      busObj['Kra'].push({
        activeKpi: 0,
        kraHrURPKraUID: '',
        sKraName: '',
        BusinessUnitObjectivesUID: '',
        BppUID: '',
        kraHrPLIBKraUID: '',
        kraHrDBankKraUID: '',
        weight: 0, Kpi: []
      });

    } else {
      this._removedKras.push({
        'kraHrURPKraUID': busObj['Kra'][busObj['Kra'].length - 1].kraHrURPKraUID,
        'Kpi': [] = busObj['Kra'][busObj['Kra'].length - 1].Kpi
      });
      busObj['Kra'] = busObj['Kra'].filter(
        item => busObj['Kra'].indexOf(item) !== busObj['Kra'].length - 1
      );

    }
    this.setKraWeight();
  }

  adjustCountKPI(Kra, iKPI, adjustment: boolean) {
    //this._bKraUpdated = true;
    let scaleItemCopy = [];
    scaleItemCopy = JSON.parse(JSON.stringify(this._templateScaleItems));
    if (adjustment) {
      if (this._kraCompanySettings.bAddOwnScaleDescription) {

        scaleItemCopy.forEach(scalemItems => {
          scalemItems['sScaleDescription'] = '';
        });
        scaleItemCopy.splice(this._kraCompanySettings.iAmountScaleItems, scaleItemCopy.length - 1);
      }

      Kra.Kpi.push({
        kraHrURPKpiUID: '',
        kraHrDBankKpiUID: '',
        sKpiname: '',
        sKpidescription: '',
        KraHrPLIBKpiUID: '',
        fWeight: 0,
        sKpiTargetHTML: '',
        sKpiBudgetLineHTML: '',
        sComment: '',
        contractComments: [],
        crps: [],
        scales: scaleItemCopy
      });
    } else {
      this._removedKras.push({
        'kraHrURPKraUID': '',
        'kraHrURPKpiUID': Kra['Kpi'][iKPI].kraHrURPKpiUID
      });
      Kra['Kpi'].splice(iKPI, 1);
    }
    this.setKraWeight();
  }

  formatKpiData() {

    this._design.busObjectives.forEach(objective => {
      objective.Kra.forEach(kraItem => {
        kraItem.Kpi.forEach(kpiItem => {
          if (kpiItem['sKpiTargetHTML'] && kpiItem['sKpiTargetHTML'].length) {
            kpiItem['sKpiTarget'] = kpiItem['sKpiTargetHTML'];
          } else {
            kpiItem['sKpiTarget'] = '';
          }
          if (kpiItem['sKpiBudgetLineHTML'] && kpiItem['sKpiBudgetLineHTML'].length) {
            kpiItem['sKpiBudgetLine'] = kpiItem['sKpiBudgetLineHTML'];
          } else {
            kpiItem['sKpiBudgetLine'] = '';
          }
        });
      });
    });
    this._kraService._performanceAgreementProfile.objectivesData = this._design.busObjectives;

  }

  validateProfile() {
    this._sErrorMessage = [];
    let bManagerComments = true;
    let numberOfKra = 0;

    for (let i = 0; i < this._design.busObjectives.length; i++) {
      // KPI VALIDATION STARTS
      for (let j = 0; j < this._design.busObjectives[i]['Kra'].length; j++) {
        numberOfKra++;
        if (this._design.busObjectives[i]['Kra'][j].sKraName === '') {
          this._sErrorMessage.push('Input for ' +
            this._kraCompanySettings['sKraNameChange'] + ' at ' + (j + 1) + ' : ' +
            this._kraCompanySettings['sBusinessUnitObjective'] + ' ' + (i + 1));
        }

        if (this._design.busObjectives[i]['Kra'][j].Kpi.length === 0) {
          this._sErrorMessage.push('The minimum allowed Key Activities are 1 per ' + this._kraCompanySettings['sKraNameChange']);
        }

        for (let x = 0; x < this._design.busObjectives[i]['Kra'][j].Kpi.length; x++) {

          if (!this._kraCompanySettings.bAddOwnScaleDescription && this._kraURPData['sAllocatedRoleType'] === 'Template View') {
            this._design.busObjectives[i]['Kra'][j].Kpi[x].scales = this._design.busObjectives[0]['Kra'][0]['Kpi'][0]['scales'];
          }

          if (this._design.busObjectives[i]['Kra'][j].Kpi[x].sKpiname === '') {
            this._sErrorMessage.push('Input for ' +
              this._kraCompanySettings['sKpiNameChange'] + ' at ' + (x + 1) + ' : ' +
              this._kraCompanySettings['sKraNameChange'] + ' ' + (j + 1) + ' : ' +
              this._kraCompanySettings['sBusinessUnitObjective'] + ' ' + (i + 1));

          }

          if (this._kraCompanySettings['bShowWeightingsOnAgreement'] === 1 &&
            Math.floor(this._design.busObjectives[i]['Kra'][j].Kpi[x].fWeight) === 0) {
            this._sErrorMessage.push(this._kraCompanySettings['sKpiNameChange'] + ' at ' + (x + 1) + ' : ' +
              this._kraCompanySettings['sKraNameChange'] + ' ' + (j + 1) + ' : ' +
              this._kraCompanySettings['sBusinessUnitObjective'] + ' ' + (i + 1) +
              ' weight can not be 0');
          }

          if ((!this._design.busObjectives[i]['Kra'][j].Kpi[x].sComment || this._design.busObjectives[i]['Kra'][j].Kpi[x].sComment === '') &&
            this._kraService._performanceAgreementProfile.kraURPData['bManagerCompleting']
            && this._kraCompanySettings['bKraManagerContractCommentsCompulsory']) {
            bManagerComments = false;

          }

          if (this._kraCompanySettings['sKpiTargetsNameChange'] !== '') {
            if (this._design.busObjectives[i]['Kra'][j].Kpi[x].sKpiTargetHTML === '') {
              this._sErrorMessage.push('Input for ' + this._kraCompanySettings['sKpiTargetsNameChange'] +
                ' at '
                + this._kraCompanySettings['sKpiNameChange'] + ' ' + (x + 1) + ' : ' +
                this._kraCompanySettings['sKraNameChange'] + ' ' + (i + 1) + ' : ' +
                this._kraCompanySettings['sBusinessUnitObjective'] + ' ' + (i + 1));

            }
          }

          // Check for empty scales
          if (this._kraCompanySettings.bAddOwnScaleDescription) {
            for (let s = 0; s < this._design.busObjectives[i]['Kra'][j].Kpi[x]['scales'].length; s++) {
              if (this._design.busObjectives[i]['Kra'][j].Kpi[x]['scales'][s]['sScaleDescription'] === '') {
                this._sErrorMessage.push('Empty scale description/descriptions found at ' +
                  this._kraCompanySettings['sBusinessUnitObjective'] + ' ' + (i + 1) +
                  this._kraCompanySettings['sKraNameChange'] + ' ' + (j + 1) + ': ' +
                  this._kraCompanySettings['sKpiNameChange'] + ' ' + (x + 1));
                break;
              }
            }
          }

        }
      }
    }

    if (this._kraCompanySettings['bAllowLimitedKraProfileTotals']) {
      if (numberOfKra < this._kraCompanySettings['iMinimumTotalKras']) {
        this._sErrorMessage.push('The minimum allowed ' + this._kraCompanySettings['sKraNameChange'] + 's are ' + this._kraCompanySettings['iMinimumTotalKras']);
      }
      if (numberOfKra > this._kraCompanySettings['iMaximumTotalKras']) {
        this._sErrorMessage.push('The maximum allowed ' + this._kraCompanySettings['sKraNameChange'] + 's are ' + this._kraCompanySettings['iMaximumTotalKras']);
      }
    }


    if (bManagerComments === false) {
      this._sErrorMessage.push('Comments are compulsory');
    }

    if (this._kraCompanySettings['bShowWeightingsOnAgreement'] === 1 &&
      this._design.weight !== 100) {
      this._sErrorMessage.push('The weight must be equal to 100');
    }

    if (this._sErrorMessage.length === 0) {
      this.savePerformanceAgreement(false);
    }
  }

  goContractPeriod() {
    this._router.navigate(['perform/contracting/period'], { replaceUrl: true });
  }

  printKraContratingPDF() {
    this._loaderService.initLoader(true);
    this._kraService.getKRAPerformanceAgreementPDFProfile()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._printToolService.initPerformanceAgreementsView(this._kraService['_agreementPDFProfileData'], false);
        this._loaderService.exitLoader();
      });
  }

  savePerformanceAgreement(bIsDraft) {
    this._loaderService.initLoader(true);
    this._confirmButton['disabled'] = true;
    this._confirmButton['text'] = 'Confirming...';
    this._saveButton['disabled'] = true;
    this._submitButton['disabled'] = true;
    this._submitButton['text'] = 'Submitting...';

    this.formatKpiData();
    this._kraService._performanceAgreementProfile.kraURPData = this._kraURPData;
    this._kraService._performanceAgreementProfile.kraURPData['removedKras'] = this._removedKras;

    this._kraService.savePerformanceAgreement(bIsDraft, this._removedKras)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.emitUpdateStatusAgreement();
      });
  }

}
