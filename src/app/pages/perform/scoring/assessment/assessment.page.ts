import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings, KraCompanySettings, SessionUser } from 'src/app/_models';
import { AuthService, KraService, PrintToolService, LoaderService, KraReviewService } from 'src/app/_services';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FileUploader } from 'ng2-file-upload';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.page.html',
  styleUrls: ['./assessment.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AssessmentPage implements OnInit {
  private readonly onDestroy = new Subject<void>();

  _sRoleToEmployee: string;
  _sessionUser: SessionUser;
  _kraCompanySettings: KraCompanySettings;
  _busObjectives = [];
  _reviewData: object;
  _kraURPData: object;
  _userProfileData: object;
  _KRAStatus = '';
  _bViewMode = false;
  _bShowNextPage = false;
  _sDocName: object = {};

  _currentKPI: {};
  _kraOverallSummary = [];
  _kraOverallResult = [];
  _deletedDocuments = [];
  _kraItems = [];
  _sErrorMessage = [];
  _isLoading = true;

  // Buttons
  _moderateButton: object;
  _draftButton: object;
  _submitButton: object;
  _revertButton: object;

  _switchToModeration = false;

  _bResultsNoficationToEmployee = false;
  _submitText = 'Submit';

  _allowedTypes = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pps', 'odt', 'txt', 'pdf', 'jpg', 'jpeg', 'png', 'bmp', 'msg', 'eml', 'zip', 'zipx'];
  public _uuid: string = AppSettings.NEW_GUID;
  public evidence_uploader: FileUploader = new FileUploader({
    url: AppSettings.FILE_UPLOAD_ENDPOINT,
    autoUpload: true,
    removeAfterUpload: true,
    isHTML5: true
  });

  constructor (private _router: Router,
    private _kraService: KraService,
    private _kraReviewService: KraReviewService,
    public _authService: AuthService,
    private _printtoolService: PrintToolService,
    public _loaderService: LoaderService) { }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._sRoleToEmployee = this._kraService._sRoleToEmployee;
    this._sessionUser = this._authService['_sessionUser'];
    this._kraCompanySettings = this._kraService._kraCompanySettings;
    this._KRAStatus = this._kraService.getStatusOption();
    this._kraService._kraOverallSummary = [];
    this._kraService._kraOverallResult = [];
    this._kraReviewService._currentReview;
    if (this._sRoleToEmployee !== 'Employee') {
      this._submitText = 'Next';
    } else {
      this._submitText = 'Submit To Manager';
    }
    if (this._KRAStatus === '') {
      this._router.navigate(['perform'], { replaceUrl: true });
      this._loaderService.exitLoader();
    }
    if (this._KRAStatus === 'bContinue') {
      this._kraService.getKraPerformanceReviewDraft()
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.emitUpdateScoring();
        });
    } else {
      this._kraService.getKraPerformanceReview()
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          if (this._KRAStatus === 'bView' && this._sRoleToEmployee !== 'Employee') {
            this._kraService.getKraSummary()
              .pipe(takeUntil(this.onDestroy))
              .subscribe(v => {
                this._kraService.getKraOverallResult()
                  .pipe(takeUntil(this.onDestroy))
                  .subscribe(v => {
                    this.emitUpdateScoring();
                  });
              });
          } else {
            this.emitUpdateScoring();
          }
        });

      if (this._KRAStatus === 'bView') {
        this._bViewMode = true;
      } else {
        this._bViewMode = false;
      }
    }

    // Get Role Details
    this._kraService.getUserRoleProfileData()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.emitUpdateRoleProfile();
      });

    this.setButtons();

    // AFTER FILE  UPLOAD SAVE THE DOCUMENT DATA TO THE KPI
    this.evidence_uploader.onAfterAddingFile = (fileItem: any) => {

      const fileType = fileItem.file['name'].split('.')[fileItem.file['name'].split('.').length - 1];

      if (this._allowedTypes.indexOf(fileType.toLowerCase()) === -1 || fileItem.file['size'] >= 2500000) {

        if (this._allowedTypes.indexOf(fileType.toLowerCase()) === -1) {
          Swal.fire(
            'Invalid File Type',
            // eslint-disable-next-line max-len
            'Please make sure your file type is listed below:<ul><li>PDF (.pdf)</li><li>Text (.txt)</li><li>Image (.jpg or .png or .bmp)</li><li>OpenDocument Text Document (.odt)</li><li>Microsoft Word (.doc or .docx)</li><li>Microsoft Power Point (.ppt or .pptx or .pps)</li><li>Microsoft Excel (.xls or .xlsx)</li><li>Mail Message (.msg or .eml)</li></ul>',
            'warning'
          );
        } else if (fileItem.file['size'] >= 2500000) {
          Swal.fire(
            'Maximum File Size Exceeded',
            'Please make sure your evidence file is smaller than 2.5mb',
            'warning'
          );
        }

      } else {
        this._uuid = AppSettings.NEW_GUID;
        fileItem.url =
          fileItem.url +
          '?id=' +
          this._uuid +
          '&type=' +
          fileItem.file['name'].split('.')[fileItem.file['name'].split('.').length - 1] +
          '&usersUUID=' +
          this._authService._sessionUser.P5Corp_userUID;
        fileItem.withCredentials = false;
        this._sDocName = {
          sAttachmentName: fileItem.file['name'],
          sFileType: fileItem.file['name'].split('.')[fileItem.file['name'].split('.').length - 1],
          sFileSize: fileItem.file['size'],
          userUUID: this._authService._sessionUser.P5Corp_userUID,
          portalUserDocumentUploadsUUID: this._uuid
        };

        this._kraItems.forEach(kraItem => {
          kraItem['kpis'].forEach(kpiItem => {
            if (kpiItem.kraHrURPKpiUID === this._currentKPI['kraHrURPKpiUID']) {
              kpiItem['documents'].push(this._sDocName);
            }
          });
        });
      }
    };

    // this._sRoleToEmployee !== 'Employee'

  }

  emitUpdateScoring() {
    this._kraOverallResult = this._kraService._kraOverallResult;
    this._kraOverallSummary = this._kraService._kraOverallSummary;

    this._reviewData = this._kraService._kraPerformanceReviewData.performanceAgreement;

    this._reviewData['kras'].forEach(kraItem => {
      this._busObjectives.push({ sObjectivesName: kraItem['sObjectivesName'], activeKra: 0, Kra: [] });
    });
    this._busObjectives = [...new Map(this._busObjectives.map(item => [item['sObjectivesName'], item])).values()];

    this._reviewData['kras'].forEach(kraItem => {
      this._busObjectives.forEach(obj => {
        if (kraItem['sObjectivesName'] === obj['sObjectivesName']) {
          obj['Kra'].push(kraItem);
        }
      });
    });

    this._busObjectives.forEach(busObj => {
      busObj['Kra'].forEach(kraItem => {
        kraItem['activeKpi'] = 0;
        kraItem['showDetails'] = false;
      });
    });

    if (this._kraService._performanceReviewProfile.keyResultAreas['kraData'] && this._kraService._performanceReviewProfile.keyResultAreas['kraData'].length !== 0) {
      this._kraItems = this._kraService._performanceReviewProfile.keyResultAreas['kraData'];
      this._deletedDocuments = this._kraService._performanceReviewProfile.kraURPData['deletedDocuments'];
    } else {
      this._kraItems = this._reviewData['kras'];
    }

    this.buildAssessments();

    this.manipulateViewPage();
    if (this._kraItems && this._kraItems.length > 0) {
      // set the first kra's kpi active
      if (this._kraItems[0]['kpis'].length > 0) {
        this._currentKPI = this._kraItems[0]['kpis'][0];
      } else {
        this._currentKPI = false;
      }
    }

    this._isLoading = false;
    this._loaderService.exitLoader();
  }

  emitUpdateRoleProfile() {
    this._kraURPData = this._kraService._p7kraRoleProfileData;
    this._userProfileData = this._kraURPData['personalDetails'];

    if (this._userProfileData['sEmployeeProfileImageUrl'] === '') {
      this._userProfileData['empSrcFail'] = true;
    } else {
      this._userProfileData['empSrcFail'] = false;
      if (this._userProfileData['sEmployeeProfileImageUrl'].indexOf('?') === -1) {
        this._userProfileData['sEmployeeProfileImageUrl'] =
          this._userProfileData['sEmployeeProfileImageUrl'] + '?' + Math.floor(Math.random() * 1000 + 1);
      }
    }

    if (this._userProfileData['sAdminProfileImageUrl'] === '') {
      this._userProfileData['managerSrcFail'] = true;
    } else {
      this._userProfileData['managerSrcFail'] = false;
      if (this._userProfileData['sAdminProfileImageUrl'].indexOf('?') === -1) {
        this._userProfileData['sAdminProfileImageUrl'] =
          this._userProfileData['sAdminProfileImageUrl'] + '?' + Math.floor(Math.random() * 1000 + 1);
      }
    }
  }

  toggleKra(kra) {
    if (kra['showDetails']) {
      kra['showDetails'] = false;
    } else {
      kra['showDetails'] = true;
    }
  }

  kraTabChanged(busObj, iKra) {
    busObj['activeKra'] = iKra;
  }
  kpiTabChanged(kra, iKpi) {
    kra['activeKpi'] = iKpi;
  }

  setEmployeeScale(kpi, scale) {
    kpi['fScore_self'] = scale['fScaleScoreValue'];
    kpi['performanceIdentifier'] = scale['kraHrPLIBKpiScaleDetailUID'];
    this.checkScoredKRA();
  }
  setManagerScale(kpi, scale) {
    kpi['fScore_admin'] = scale['fScaleScoreValue'];
    kpi['performanceIdentifier'] = scale['kraHrPLIBKpiScaleDetailUID'];
    this.checkScoredKRA();
  }

  setCurrentKPI(kpi) {
    this._currentKPI = kpi;
  }

  removeDoc(doc, docIndex) {
    this._currentKPI['documents'] = this._currentKPI['documents'].filter(
      item => this._currentKPI['documents'].indexOf(item) !== docIndex
    );
    if (this._deletedDocuments) {
      this._deletedDocuments.push({
        portalUserDocumentUploadsUUID: doc['portalUserDocumentUploadsUUID']
      });
    }
  }

  buildAssessments() {
    let kraCounter = 0;

    if (this._kraItems) {
      this._kraItems.forEach(kraItem => {
        kraItem['kpis'].forEach(kpiItem => {
          // FIND CORRECT SCALE
          if (this._kraService._sRoleToEmployee === 'Employee') {
            kpiItem['performanceIdentifier'] = kpiItem['scaleHRDetailUID_self'];
          } else if (this._kraService._sRoleToEmployee === 'Manager') {
            kpiItem['performanceIdentifier'] = kpiItem['scaleHRDetailUID_admin'];

          }
        });

        kraCounter++;
      });
    }
    this.checkScoredKRA();
  }

  checkScoredKRA() {

    this._busObjectives.forEach(busObj => {
      busObj['Kra'].forEach(kraItem => {
        kraItem['isScored'] = false;
        let scoredKPIs = 0;
        kraItem['kpis'].forEach(kpiItem => {
          if (kpiItem['performanceIdentifier']) {
            scoredKPIs++;
          }
        });
        if (scoredKPIs === kraItem['kpis'].length) {
          kraItem['isScored'] = true;
        }
      });
    });

  }

  manipulateViewPage() {
    if (this._busObjectives) {
      this._busObjectives.forEach(busObj => {
        busObj['Kra'].forEach(kraItem => {
          // loop KRA ITEM - KPI ITEMS
          kraItem['kpis'].forEach(kpiItem => {
            kpiItem['commentsCounterSelf'] = 0;
            kpiItem['documentsCounterSelf'] = 0;
            kpiItem['commentsCounterAdmin'] = 0;
            kpiItem['documentsCounterAdmin'] = 0;

            kpiItem['scales'].sort(function (obj1, obj2) {
              return obj1['iScaleItemOrder'] - obj2['iScaleItemOrder'];
            });

            kpiItem['comments'].forEach(comment => {
              if (this._authService._sessionUser && this._authService._sessionUser.P5Corp_userUID === comment.sCommentBy_fkUserUID) {
                kpiItem.bHasCommented = true;
              }
              // get EmployeeComments
              // get ManagerComments
              if (comment['sCommentBy_fkUserUID'] === this._userProfileData['sAdminUUID']) {
                kpiItem['commentsCounterAdmin']++;
                kpiItem['bManagerHasCommented'] = true;
              }

            });

            kpiItem['documents'].forEach(doc => {
              // get EmployeeEvidence
              if (doc['userUUID'] === this._userProfileData['sEmployeeUUID']) {
                kpiItem['documentsCounterSelf']++;
                kpiItem['bEmployeeHasUploadedDoc'] = true;
              }
              // get ManagerEvidence
              if (doc['userUUID'] === this._userProfileData['sAdminUUID']) {
                kpiItem['documentsCounterAdmin']++;
                kpiItem['bManagerHasUploadedDoc'] = true;
              }

            });

            // Get score types
            kpiItem['fScore_selfTypeOf'] = typeof (kpiItem['fScore_self']);
            kpiItem['fScore_adminTypeOf'] = typeof (kpiItem['fScore_admin']);

            // Set SELF score
            if (kpiItem['scaleHRDetailUID_self'] !== '') {
              if (kpiItem['fScore_selfTypeOf'] !== 'number') {
                kpiItem['fScore_self'] = 'N/A';
                kpiItem['fScore_selfOverall'] = 0;
              } else {
                kpiItem['fScore_self'] = parseInt(kpiItem['fScore_self']);
                kpiItem['fScore_selfOverall'] = Math.floor(
                  kpiItem['fScore_self'] / kpiItem['maxScaleValue'] * 100
                );
                kpiItem['fScore_selfOverall'] =
                  kpiItem['fScore_selfOverall'] % 5 < 3
                    ? kpiItem['fScore_selfOverall'] % 5 === 0
                      ? kpiItem['fScore_selfOverall']
                      : Math.floor(kpiItem['fScore_selfOverall'] / 5) * 5
                    : Math.ceil(kpiItem['fScore_selfOverall'] / 5) * 5;
              }
            } else {
              kpiItem['fScore_self'] = 'NS';
              kpiItem['fScore_selfOverall'] = 100;
            }

            if (kpiItem['fScore_self'] === -1) {
              kpiItem['fScore_selfOverall'] = 100;
            }

            if (kpiItem['scaleHRDetailUID_admin'] !== '') {
              // Set ADMIN score
              if (kpiItem['fScore_adminTypeOf'] === 'number') {
                kpiItem['fScore_admin'] = parseInt(kpiItem['fScore_admin']);
                kpiItem['fScore_adminOverall'] = Math.floor(
                  kpiItem['fScore_admin'] / kpiItem['maxScaleValue'] * 100
                );
                kpiItem['fScore_adminOverall'] =
                  kpiItem['fScore_adminOverall'] % 5 < 3
                    ? kpiItem['fScore_adminOverall'] % 5 === 0
                      ? kpiItem['fScore_adminOverall']
                      : Math.floor(kpiItem['fScore_adminOverall'] / 5) * 5
                    : Math.ceil(kpiItem['fScore_adminOverall'] / 5) * 5;
              } else {
                kpiItem['fScore_admin'] = 'N/A';
                kpiItem['fScore_adminOverall'] = 0;
              }
            } else {
              kpiItem['fScore_admin'] = 'NS';
              kpiItem['fScore_adminOverall'] = 0;
            }

            kpiItem['comments'].forEach(comment => {
              // loop  KPI ITEMS - USERS
              if (
                comment.sCommentBy_fkUserUID === this._authService._sessionUser.P5Corp_userUID
              ) {
                kpiItem.bHasCommented = true;
              }

            });

            kpiItem['kpiInvitedUsers'].forEach(invitedUsers => {
              // loop  KPI ITEMS - USERS
              if (
                invitedUsers['sInternalCommentBy_fkUserUID'] ===
                this._authService._sessionUser.P5Corp_userUID &&
                invitedUsers['sApprovalStatus'] === 'Declined'
              ) {
                kraItem['kpis'] = kraItem['kpis'].filter(
                  item => item.kraHrURPKpiUID !== kpiItem['kraHrURPKpiUID']
                );
              }
            });
          });
        });
      })
    }
  }

  printKraScoringPDF() {
    this._loaderService.initLoader(true);
    this._kraService.getReviewPDFData()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._printtoolService.initPerformanceReviewsView(this._kraService['_KRAReviewPDFData'], false);
        this._loaderService.exitLoader();
      });
  }

  goActivitySummary() {
    this._router.navigate([this._authService._sPreviousUrl], { replaceUrl: true });
  }

  goPerformanceDiscussion() {
    let additionalScoreData: Object = new Object();
    if (this._sRoleToEmployee === 'Manager') {
      additionalScoreData = {
        sUserScored_fkUserUUID: this._userProfileData['sEmployeeUUID'],
        roleUUID: this._userProfileData['kraHrURPRoleUID'],
        kraSettings: this._kraCompanySettings,
        moderationReason: '',
        sScoredBy_fkUserUUID: this._authService._sessionUser.P5Corp_userUID,
        isKraKpiSurvey: true,
        isAssessorScoring: false,
        bManager: true,
        sAssessorType: 'Report To',
        bIsScoredBy_Self: 0,
        bIsScoredBy_Admin: 1,
        bIsScoredBy_Admin2: 0,
        deletedDocument: this._deletedDocuments
      };

      //Validate Kpi's
      for (let i = 0; i < this._kraItems.length; i++) {
        for (let x = 0; x < this._kraItems[i]['kpis'].length; x++) {
          if (this._kraItems[i]['kpis'][x].performanceIdentifier === '') {
            this._sErrorMessage.push(
              'Please rate the employee level of performance for ' +
              this._kraCompanySettings['sKraNameChange'] +
              ' at ' + (i + 1) + ' : ' +
              this._kraCompanySettings['sKpiNameChange'] +
              ' ' + (x + 1)
            );
          }
        }
      }
    }
    // else {
    //   additionalScoreData = {
    //     sUserScored_fkUserUUID: this._authService._sessionUser.P5Corp_userUID,
    //     roleUUID: this._userProfileData['kraHrURPRoleUID'],
    //     kraSettings: this._kraCompanySettings,
    //     moderationReason: '',
    //     sScoredBy_fkUserUUID: this._authService._sessionUser.P5Corp_userUID,
    //     isKraKpiSurvey: true,
    //     isAssessorScoring: false,
    //     bManager: false,
    //     sAssessorType: 'Self',
    //     bIsScoredBy_Self: 1,
    //     bIsScoredBy_Admin: 0,
    //     bIsScoredBy_Admin2: 0,
    //     deletedDocument: this._deletedDocuments
    //   };
    // }

    this._kraService._performanceReviewProfile.keyResultAreas['additionalScoreData'] = additionalScoreData;
    this._kraService._performanceReviewProfile.keyResultAreas['additionalScoreData']['selectedDatesToScore'] =
      [{
        monthNumber: this._kraService._reviewMonth, sMonthYearName: this._kraService._reviewMonth,
        yearNumber: this._kraService._reviewYear
      }],

      this._kraService._performanceReviewProfile.keyResultAreas['additionalScoreData']['sEmployeeSigned'] =
      this._kraService._currentTask['sEmployeeSigned'];

    this._kraService._performanceReviewProfile.kraURPData = this._kraURPData;
    this._kraService._performanceReviewProfile.kraURPData['deletedDocuments'] = this._deletedDocuments;
    this._kraService._performanceReviewProfile.keyResultAreas['kraData'] = this._kraItems;

    this._router.navigate(['perform/scoring/discussion'], { replaceUrl: true });
  }

  validateContract() {
    this._sErrorMessage = [];
    for (let i = 0; i < this._kraItems.length; i++) {
      for (let x = 0; x < this._kraItems[i]['kpis'].length; x++) {
        if (this._sRoleToEmployee !== 'Employee') {
          if (this._kraItems[i]['kpis'][x].performanceIdentifier === '') {
            this._sErrorMessage.push(
              'Please rate the employee level of performance for ' +
              this._kraCompanySettings['sKraNameChange'] +
              ' at ' + (i + 1) + ' : ' +
              this._kraCompanySettings['sKpiNameChange'] +
              ' ' + (x + 1)
            );
          }
        } else {
          if (this._kraItems[i]['kpis'][x].performanceIdentifier === '') {
            this._sErrorMessage.push(
              'Please rate your level of performance for ' +
              this._kraCompanySettings['sKraNameChange'] +
              ' at ' + (i + 1) + ' : ' +
              this._kraCompanySettings['sKpiNameChange'] +
              ' ' + (x + 1)
            );
          }
          if (this._kraItems[i]['kpis'][x].sActual_Self === '') {
            this._sErrorMessage.push(
              'Please provide a narrative of your actual achievement for ' +
              this._kraCompanySettings['sKraNameChange'] +
              ' at ' + (i + 1) + ' : ' +
              this._kraCompanySettings['sKpiNameChange'] +
              ' ' + (x + 1)
            );
          }
        }
      }
    }

    if (this._sErrorMessage.length === 0) {
      if (this._sRoleToEmployee !== 'Employee') {
        this.goPerformanceDiscussion();
      } else {
        Swal.fire({
          text: 'Are you sure you would like to submit this as a final submission? ' +
            'Once you have submitted your review to your manager you will also' +
            'NOT BE ABLE to make any changes to it.  Would you like to proceed?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Submit',
          confirmButtonColor: 'var(--primary)',
          heightAuto: false,
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            this.handleConfirmButtonClick();
          }
        });
      }
    }
  }

  handleDraftButtonClick() {
    this._loaderService.initLoader(true);
    // set the additional object
    let additionalScoreData: Object = new Object();
    if (this._sRoleToEmployee === 'Manager') {
      additionalScoreData = {
        sUserScored_fkUserUUID: this._userProfileData['sEmployeeUUID'],
        roleUUID: this._userProfileData['kraHrURPRoleUID'],
        kraSettings: this._kraCompanySettings,
        moderationReason: '',
        sScoredBy_fkUserUUID: this._authService._sessionUser.P5Corp_userUID,
        isKraKpiSurvey: true,
        isAssessorScoring: false,
        bManager: true,
        sAssessorType: 'Report To',
        bIsScoredBy_Self: 0,
        bIsScoredBy_Admin: 1,
        bIsScoredBy_Admin2: 0,
        deletedDocument: this._deletedDocuments
      };
    } else {

      additionalScoreData = {
        sUserScored_fkUserUUID: this._authService._sessionUser.P5Corp_userUID,
        roleUUID: this._userProfileData['kraHrURPRoleUID'],
        kraSettings: this._kraCompanySettings,
        moderationReason: '',
        sScoredBy_fkUserUUID: this._authService._sessionUser.P5Corp_userUID,
        isKraKpiSurvey: true,
        isAssessorScoring: false,
        bManager: false,
        sAssessorType: 'Self',
        bIsScoredBy_Self: 1,
        bIsScoredBy_Admin: 0,
        bIsScoredBy_Admin2: 0,
        deletedDocument: this._deletedDocuments
      };

    }

    this._kraService._performanceReviewProfile.keyResultAreas['additionalScoreData'] = additionalScoreData;
    this._kraService._performanceReviewProfile.keyResultAreas['additionalScoreData']['selectedDatesToScore'] =
      [{
        monthNumber: this._kraService._reviewMonth, sMonthYearName: this._kraService._reviewMonth,
        yearNumber: this._kraService._reviewYear
      }],

      this._kraService._performanceReviewProfile.keyResultAreas['additionalScoreData']['sEmployeeSigned'] =
      this._kraService._currentTask['sEmployeeSigned'];

    this._kraService._performanceReviewProfile.kraURPData = this._kraURPData;
    this._kraService._performanceReviewProfile.kraURPData['deletedDocuments'] = this._deletedDocuments;
    this._kraService._performanceReviewProfile.keyResultAreas['kraData'] = this._kraItems;
    this._kraService.saveKraPerformanceReview('kra', false, false, true, true, this._bResultsNoficationToEmployee)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.emitUpdateStatusReview();
      });
  }

  handleConfirmButtonClick() {
    this._loaderService.initLoader(true);
    this.triggerButton('submit');
    let additionalScoreData: Object = new Object();
    this._kraReviewService._sRoleToEmployee = this._sRoleToEmployee;
    this._kraReviewService._employeeUID = this._authService._sessionUser.P5Corp_userUID;
    this.setPerformanceIndentifier();
    additionalScoreData = {
      sUserScored_fkUserUUID: this._authService._sessionUser.P5Corp_userUID,
      roleUUID: this._kraURPData['kraHrURPRoleUID'],
      kraSettings: this._kraCompanySettings,
      moderationReason: '',
      sScoredBy_fkUserUUID: this._authService._sessionUser.P5Corp_userUID,
      isKraKpiSurvey: true,
      isAssessorScoring: false,
      bManager: false,
      assessor_kraHrURPRoleUID: this._kraReviewService
        ._assessor_kraHrURPRoleUID,
      sAssessorType: 'Self',
      openEndedQuestionsArray: '',
      bIsScoredBy_Self: 1,
      bIsScoredBy_Admin: 0,
      bIsScoredBy_Admin2: 0,
      deletedDocument: this._deletedDocuments,
      sOverallFeedbackComment: '',
      'deletedExternalAssessors': []
    };
    additionalScoreData['sEmployeeSigned'] = this._kraService._currentTask['sEmployeeSigned'];
    this._kraReviewService
      .saveKraReviewPerformanceAgreement(
        additionalScoreData,
        [
          {
            monthNumber: this._kraService._reviewMonth,
            sMonthYearName: this._kraService._reviewMonth,
            yearNumber: this._kraService._reviewYear
          }
        ],
        this._kraItems,
        'kra',
        false,
        false,
        true,
        false
      )
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        // do nothing
        this._router.navigate(['perform']);
      });


  }

  setPerformanceIndentifier() {
    this._kraItems.forEach(kraItem => {
      kraItem['kpis'].forEach(kpiItem => {
        kpiItem['scales'].forEach(scale => {
          // loop KPI SCALE ITEM - KPI SCALE ITEMS

          if (this._authService._KRAView === 'personal') {
            if (scale.kraHrPLIBKpiScaleDetailUID === kpiItem['performanceIdentifier']) {
              kpiItem['fScore_self'] = scale.fScaleScoreValue;
              kpiItem['scaleHRDetailUID_self'] = kpiItem['performanceIdentifier'];
              kpiItem['fScore_admin'] = kpiItem['fScore_admin'] === 'N/A' ? null : kpiItem['fScore_admin'];
            }
          }

          if (this._authService._KRAView === 'department') {
            if (this._kraReviewService._sRoleToEmployee === 'Manager') {
              if (scale.kraHrPLIBKpiScaleDetailUID === kpiItem['performanceIdentifier']) {
                kpiItem['scaleHRDetailUID_admin'] = kpiItem['performanceIdentifier'];
                kpiItem['fScore_admin'] = scale.fScaleScoreValue;
                kpiItem['fScore_self'] = kpiItem['fScore_self'] === 'N/A' ? null : kpiItem['fScore_self'];
              }

            }
          }

        });
      });
    });

    this._kraReviewService._performanceReviewProfile.keyResultAreas['kraData'] = this._kraItems;
  }

  handleModeration(on) {
    if (on) {
      if (this._reviewData['bScoreModeratedAmount'] > 1) {
        Swal.fire({
          title: '',
          text: 'Moderation has already been done!',
          icon: 'info',
          confirmButtonColor: 'var(--primary)',
          heightAuto: false
        });
      } else {
        this._bViewMode = false;
        this._switchToModeration = true;
        this._kraService._bShowModerationMode = true;
        this._moderateButton['text'] = 'Update';
      }
    } else {
      this._bViewMode = true;
      this._switchToModeration = false;
      this._kraService._bShowModerationMode = false;
      this._moderateButton['text'] = 'Update Scorecare';
    }
  }

  saveModeration() {
    this._loaderService.initLoader(true);
    this.triggerButton('moderate');
    let additionalScoreData: Object = new Object();

    if (this._sErrorMessage.length === 0) {

      this._kraItems.forEach(kraItem => {
        kraItem['kpis'].forEach(kpi => {
          kpi['bDeclined'] = kpi['scaleHRDetailUID_admin'] === kpi['performanceIdentifier'] ? false : true;
        });
      });

      additionalScoreData = {
        sUserScored_fkUserUUID: this._kraURPData['sEmployeeUUID'],
        roleUUID: this._kraURPData['kraHrURPRoleUID'],
        kraSettings: this._kraCompanySettings,
        moderationReason: this._reviewData['sScoreModeratedReason'],
        sScoredBy_fkUserUUID: this._sessionUser['P5Corp_userUID'],
        isKraKpiSurvey: true,
        isAssessorScoring: false,
        bManager: true,
        assessor_kraHrURPRoleUID: this._kraService._assessor_kraHrURPRoleUID,
        sAssessorType: 'Report To',
        bIsScoredBy_Self: 0,
        bIsScoredBy_Admin: 1,
        bIsScoredBy_Admin2: 0,
        deletedDocument: this._deletedDocuments
      };

      this._kraService._performanceReviewProfile.moderateKra['additionalScoreData'] = additionalScoreData;
      this._kraService._performanceReviewProfile.moderateKra['additionalScoreData']['selectedDatesToScore'] =
        [{
          monthNumber: this._kraService._reviewMonth, sMonthYearName: this._kraService._reviewMonth,
          yearNumber: this._kraService._reviewYear
        }];
      this._kraService._performanceReviewProfile.moderateKra['kraData'] = this._kraItems;

      this._kraService.saveKraCompentencyModeration('kra', true, false, true, false)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this._router.navigate(['perform']);
        });
    }
  }

  setButtons() {
    this._moderateButton = {
      disabled: false,
      text: this._kraCompanySettings['sModerationButtonText']
    };
  }

  triggerButton(btn) {
    this.setButtons();
    switch (btn) {
      case 'moderate':
        this._moderateButton = {
          disabled: true,
          text: 'Moderating...'
        };
        break;
      default:
        this.setButtons();
    }
  }

  emitUpdateStatusReview() {
    this._router.navigate(['perform'], { replaceUrl: true });
    this._loaderService.exitLoader();
  }
}
