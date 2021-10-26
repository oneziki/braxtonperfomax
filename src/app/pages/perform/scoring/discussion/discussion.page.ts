import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FileUploader } from 'ng2-file-upload';
import {
  AuthService,
  LoaderService,
  KraService
} from '../../../../_services/index';
import {
  KraCompanySettings,
  DiscussionNotes,
  SessionUser,
  AppSettings,
  DiscussionRating,
  KraItemSettings
} from '../../../../_models/index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.page.html',
  styleUrls: ['./discussion.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DiscussionPage implements OnInit, OnDestroy {
  private readonly onDestroy = new Subject<void>();

  _sRoleToEmployee: string;
  _discussionNotes = [new DiscussionNotes()];
  _discussionRating = new DiscussionRating();
  _deletedDocuments = [];
  _KraPerformanceAgreement: KraItemSettings;
  _kraCompanySettings: KraCompanySettings;
  _performanceReviewData: object;
  _kraURPData: object;
  _employeeDetails: object;
  _discussionScaleItems = [];
  _discussionAccuracyScaleItems = [];
  _sessionUser: SessionUser;
  _discussionDocs: object = {};
  _KRAStatus = '';
  _bViewMode = false;
  _kraItems = [];
  _sErrorMessage = [];
  _sWarningMessage = [];
  _allowedTypes = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pps', 'odt', 'txt', 'pdf', 'jpg', 'jpeg', 'png', 'bmp', 'msg', 'eml', 'zip', 'zipx'];

  _isLoadingSetButtons = true;
  _isLoadingDiscussionScaleItems = true;
  _isLoadingEmployeeEmailDetails = true;
  _isLoadingDiscussionAccuracyScaleItems = true;
  _isLoadingDiscussionNotes = true;
  _isLoading = true;
  _bCompleted = false;
  _switchToModeration = false;

  _moderateButton: object;

  public _uuid: string = AppSettings.NEW_GUID;
  public uploader: FileUploader = new FileUploader({
    url: AppSettings.DISCUSSION_FILE_UPLOAD_ENDPOINT,
    autoUpload: true,
    removeAfterUpload: true,
    isHTML5: true
  });

  constructor(public _authService: AuthService,
    private _router: Router,
    public _kraService: KraService,
    private _loaderService: LoaderService) { }

  async ngOnInit() {
    this._loaderService.initLoader(true);
    this._discussionScaleItems = this._kraService._discussionScaleItems;
    this._discussionAccuracyScaleItems = this._kraService._discussionAccuracyScaleItems;
    this._kraCompanySettings = this._kraService._kraCompanySettings;
    this._sessionUser = this._authService._sessionUser;
    this._sRoleToEmployee = this._kraService._sRoleToEmployee;
    this._KRAStatus = this._kraService.getStatusOption();

    if (this._KRAStatus === 'bView' && !this._kraService._bShowModerationMode) {
      this._bViewMode = true;
    } else {
      this._bViewMode = false;
      this._switchToModeration = true;
    }

    if (this._discussionAccuracyScaleItems.length === 0) {
      this._kraService.getOrganisationKRAAccuracyScales(this._sessionUser['P5Corp_userUID'])
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.emitUpdateDiscussionAccuracyScaleItems();
        });
    } else {
      this.emitUpdateDiscussionAccuracyScaleItems();
    }

    if (this._discussionScaleItems.length === 0) {
      this._kraService.getOrganisationKRADiscussionScales(this._sessionUser['P5Corp_userUID'])
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.emitDiscussionScaleItems();
        });
    } else {
      this.emitDiscussionScaleItems();
    }

    if (!this._kraService._employeeDetails) {
      this._employeeDetails = await this._kraService.getEmployeeDetails(this._kraService._currentTask['EmployeeUID']);
      this._isLoadingEmployeeEmailDetails = false;
      this.emitUpdateEmployeeDetails();
    } else {
      this.emitUpdateEmployeeDetails();
    }

    this.setButtons();

    // FILE  UPLOAD
    this.uploader.onAfterAddingFile = (fileItem: any) => {
      const fileType = fileItem.file['name'].split('.')[fileItem.file['name'].split('.').length - 1];
      if (this._allowedTypes.indexOf(fileType.toLowerCase()) === -1 || fileItem.file['size'] >= 2500000) {
        if (this._allowedTypes.indexOf(fileType.toLowerCase()) === -1) {
          Swal.fire(
            'Invalid File Type',
            'Please make sure your file type is listed below:<ul><li>PDF (.pdf)</li><li>Text (.txt)</li><li>Image (.jpg or .png or .bmp)</li><li>OpenDocument Text Document (.odt)</li><li>Microsoft Word (.doc or .docx)</li><li>Microsoft Power Point (.ppt or .pptx or .pps)</li><li>Microsoft Excel (.xls or .xlsx)</li><li>Mail Message (.msg or .eml)</li></ul>',
            'warning'
          );
        } else if (fileItem.file['size'] >= 2500000) {
          Swal.fire(
            'Maximum File Size Exceeded',
            'Please make sure the file you are uploading is smaller than 2.5mb',
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
          this._sessionUser.P5Corp_userUID;
        fileItem.withCredentials = false;
        this._discussionDocs = {
          sAttachmentName: fileItem.file['name'],
          sFileName: fileItem.file['name'],
          sFileType: fileItem.file['name'].split('.')[fileItem.file['name'].split('.').length - 1],
          sFileSize: fileItem.file['size'],
          userUUID: this._sessionUser.P5Corp_userUID,
          portalUserDocumentUploadsUUID: this._uuid
        };
      }
    };
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  emitDiscussionScaleItems() {
    this._discussionScaleItems = this._kraService._discussionScaleItems;
    this._isLoadingDiscussionScaleItems = false;
    this.checkLoaderAllClear();
  }

  emitUpdateEmployeeDetails() {
    this._employeeDetails = this._kraService._employeeDetails;
    this._isLoadingEmployeeEmailDetails = false;
    this.emitUpdateDiscussionData();
    this.checkLoaderAllClear();
  }

  emitUpdateDiscussionAccuracyScaleItems() {
    this._discussionAccuracyScaleItems = this._kraService._discussionAccuracyScaleItems;
    this._isLoadingDiscussionAccuracyScaleItems = false;
    this.checkLoaderAllClear();
  }

  emitUpdateDiscussionData() {

    if (!this.isEmpty(this._kraService._performanceReviewProfile.performanceDiscussion)) {
      this._discussionDocs = this._kraService._performanceReviewProfile.performanceDiscussion['additionalScoreData']['discussionDocs'];
    } else {

      this._performanceReviewData = this._kraService._kraPerformanceReviewData.performanceAgreement;
      if (this._performanceReviewData['discussionRating'].length) {
        this._discussionRating = this._performanceReviewData['discussionRating'][0];
      }
      if (this._performanceReviewData['discussionNotes'].length) {
        this._discussionNotes = this._performanceReviewData['discussionNotes'];
        if (this._discussionNotes.length === 0) {
          this._discussionDocs = {};

          this._discussionNotes = [new DiscussionNotes()];
          this._discussionNotes[0].sCommentBy_fkUserUID = this._sessionUser.P5Corp_userUID;
          this._discussionNotes[0].kraHrURPRoleUID = this._kraService._currentTask['kraHrURPRoleUID'];
          this._discussionNotes[0].yearNumber = this._kraService._currentTask['iYear'];
          this._discussionNotes[0].monthNumber = this._kraService._currentTask['iMonth'];
          this._bCompleted = false;

          this._discussionRating = new DiscussionRating();
          this._discussionRating.kraHrURPRoleUID = this._kraService._currentTask['kraHrURPRoleUID'];
          this._discussionRating.bShowPerformanceDiscussionRating = this._kraCompanySettings.bShowPerformanceDiscussionRating;
        } else {

          this._discussionDocs = this._discussionNotes;
          this._discussionNotes[0].yearNumber = this._kraService._currentTask['iYear'];
          this._discussionNotes[0].monthNumber = this._kraService._currentTask['iMonth'];
          this._bCompleted = true;
          this._discussionNotes[0].selectedDateCreated = this._discussionNotes[0]['selectedDateCreated'].split('-')[2] + '-' +
            this._discussionNotes[0]['selectedDateCreated'].split('-')[1] + '-' +
            this._discussionNotes[0]['selectedDateCreated'].split('-')[0];
        }

      }
    }
    this._isLoadingDiscussionNotes = false;
    this.checkLoaderAllClear();
  }

  handleModeration(on) {
    if (on) {
      this._bViewMode = false;
      this._switchToModeration = true;
      this._kraService._bShowModerationMode = true;
      this._moderateButton['text'] = 'Update';
    } else {
      this._bViewMode = true;
      this._switchToModeration = false;
      this._kraService._bShowModerationMode = false;
      this._moderateButton['text'] = 'Update Scorecare';
    }
  }

  saveModeration() {
    // this._loaderService.initLoader(true);
    this.triggerButton('moderate');

    let additionalScoreData: Object = new Object();

    if (this._sErrorMessage.length === 0) {

      additionalScoreData = {
        sUserScored_fkUserUUID: this._kraURPData['sEmployeeUUID'],
        roleUUID: this._kraURPData['kraHrURPRoleUID'],
        kraSettings: this._kraCompanySettings,
        moderationReason: '',
        sScoredBy_fkUserUUID: this._sessionUser.P5Corp_userUID,
        isKraKpiSurvey: true,
        isAssessorScoring: false,
        bManager: true,
        assessor_kraHrURPRoleUID: this._kraService
          ._assessor_kraHrURPRoleUID,
        sAssessorType: 'Report To',
        openEndedQuestionsArray: '',
        bIsScoredBy_Self: 0,
        bIsScoredBy_Admin: 1,
        bIsScoredBy_Admin2: 0,
        deletedDocument: this._deletedDocuments,
        discussionDate: this._discussionNotes[0]['selectedDateCreated'],
        discussionNotes: this._discussionNotes[0]['sComment'],
        discussionDocs: this._discussionDocs,
        discussionRating: this._discussionRating,
        bShowDiscussionRating: this._kraCompanySettings.bShowPerformanceDiscussionRating
      };
      this._kraService._performanceReviewProfile.performanceDiscussion['additionalScoreData'] = additionalScoreData;
      this._kraService._performanceReviewProfile.performanceDiscussion['additionalScoreData']['selectedDatesToScore'] =
        [{
          monthNumber: this._kraService._reviewMonth, sMonthYearName: this._kraService._reviewMonth,
          yearNumber: this._kraService._reviewYear
        }];

      this._kraService.saveKraCompentencyModeration('kra', true, false, true, false)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this._router.navigate(['perform']);
        });
    }
  }

  setButtons() {
    let revertTo: string;
    let submitTo = '';
    let text = 'Submit Final Review';

    if (this._kraService['_sRoleToEmployee'] === 'Manager') {
      text = this._kraURPData && this._kraURPData['sAdmin2UUID'] === '' ? 'Complete final review' : 'Submit Review';
      revertTo = 'individual';
    }

    this._moderateButton = {
      disabled: false,
      text: 'Update Scorecard'
    };
    this._isLoadingSetButtons = false;
    this.checkLoaderAllClear();
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

  checkLoaderAllClear() {
    let toReturn = true;

    if (this._isLoadingDiscussionNotes) {
      toReturn = false;
    }

    if (this._isLoadingDiscussionAccuracyScaleItems) {
      toReturn = false;
    }

    if (this._isLoadingEmployeeEmailDetails) {
      toReturn = false;
    }

    if (this._isLoadingDiscussionScaleItems) {
      toReturn = false;
    }

    if (this._isLoadingSetButtons) {
      toReturn = false;
    }
    
    if (toReturn === true) {
      this._isLoading = false;
      this._loaderService.exitLoader();
    }
  }

  goReview() {
    let additionalScoreData: Object = new Object();
    if (this._sRoleToEmployee === 'Manager') {
      additionalScoreData = {
        sUserScored_fkUserUUID: this._kraService._currentTask['sEmployeeUUID'],
        roleUUID: this._kraService._currentTask['kraHrURPRoleUID'],
        kraSettings: this._kraCompanySettings,
        moderationReason: '',
        sScoredBy_fkUserUUID: this._sessionUser.P5Corp_userUID,
        isKraKpiSurvey: true,
        isAssessorScoring: false,
        bManager: true,
        sAssessorType: 'Report To',
        openEndedQuestionsArray: '',
        bIsScoredBy_Self: 0,
        bIsScoredBy_Admin: 1,
        bIsScoredBy_Admin2: 0,
        deletedDocument: this._deletedDocuments,
        discussionDate: this._discussionNotes[0]['selectedDateCreated'],
        discussionNotes: this._discussionNotes[0]['sComment'],
        discussionDocs: this._discussionDocs,
        discussionRating: this._discussionRating,
        bShowDiscussionRating: this._kraCompanySettings.bShowPerformanceDiscussionRating,
        discussionNotesImprovements: this._discussionNotes[0]['sImprovements'],
        discussionNotesGoals: this._discussionNotes[0]['sGoals'],
        discussionNotesStrengths: this._discussionNotes[0]['sStrengths']
      }
      this._kraService._performanceReviewProfile.performanceDiscussion['additionalScoreData'] = additionalScoreData;
    }

    this._router.navigate(['perform/scoring/assessment'], { replaceUrl: true });
  }

  validateDiscussionPage() {
    this._loaderService.initLoader(true);
    let bEmpty = false;

    if (/^ *$/.test(this._discussionNotes[0]['sComment'])) {
      bEmpty = true;
    }

    if (this._discussionNotes[0]['selectedDateCreated']) {
      var Ddate = new Date(this._discussionNotes[0]['selectedDateCreated'].toString());
      this._discussionNotes[0]['dDateDiscussion']['year'] = Ddate.getFullYear();
      this._discussionNotes[0]['dDateDiscussion']['month'] = Ddate.getMonth();
      this._discussionNotes[0]['dDateDiscussion']['day'] = Ddate.getDay();

    } else {
      bEmpty = true;
    }
    if (/^ *$/.test(this._discussionNotes[0]['sStrengths'])) {
      bEmpty = true;
    }
    if (/^ *$/.test(this._discussionNotes[0]['sImprovements'])) {
      bEmpty = true;
    }
    if (/^ *$/.test(this._discussionNotes[0]['sGoals'])) {
      bEmpty = true;
    }


    if (this._kraCompanySettings.bShowPerformanceDiscussionRating) {
      if (/^ *$/.test(this._discussionRating['PerformanceDiscussionScaleUID'])) {
        bEmpty = true;
      }
      if (/^ *$/.test(this._discussionRating['PerformanceAccuracyScaleUID'])) {
        bEmpty = true;
      }
    }

    if (bEmpty) {
      this._loaderService.exitLoader();
      Swal.fire(
        'Not all fields have been filled in',
        'Please make sure all fields are filled in',
        'error'
      );
    } else {
      this.savePerformanceReview();
    }
  }

  handleDraftButtonClick() {
    this._loaderService.initLoader(true);
    let additionalScoreData: Object = new Object();
    if (this._sRoleToEmployee === 'Manager') {
      additionalScoreData = {
        sUserScored_fkUserUUID: this._kraService._currentTask['sEmployeeUUID'],
        roleUUID: this._kraService._currentTask['kraHrURPRoleUID'],
        kraSettings: this._kraCompanySettings,
        moderationReason: '',
        sScoredBy_fkUserUUID: this._sessionUser.P5Corp_userUID,
        isKraKpiSurvey: true,
        isAssessorScoring: false,
        bManager: true,
        sAssessorType: 'Report To',
        openEndedQuestionsArray: '',
        bIsScoredBy_Self: 0,
        bIsScoredBy_Admin: 1,
        bIsScoredBy_Admin2: 0,
        deletedDocument: this._deletedDocuments,
        discussionDate: this._discussionNotes[0]['selectedDateCreated'],
        discussionNotes: this._discussionNotes[0]['sComment'],
        discussionDocs: this._discussionDocs,
        discussionRating: this._discussionRating,
        bShowDiscussionRating: this._kraCompanySettings.bShowPerformanceDiscussionRating,
        discussionNotesImprovements: this._discussionNotes[0]['sImprovements'],
        discussionNotesGoals: this._discussionNotes[0]['sGoals'],
        discussionNotesStrengths: this._discussionNotes[0]['sStrengths']
      }
      this._kraService._performanceReviewProfile.performanceDiscussion['additionalScoreData'] = additionalScoreData;
    }

    this._kraService.saveKraPerformanceReview('kra', false, false, true, true)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._router.navigate(['perform'], { replaceUrl: true });
      });
  }

  savePerformanceReview() {
    this._kraService.saveKraPerformanceReview('kra', false, false, true, true)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._router.navigate(['perform'], { replaceUrl: true });
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

}
