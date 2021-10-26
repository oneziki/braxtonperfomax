import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FileUploader } from 'ng2-file-upload';
import {
  AuthService,
  LoaderService,
  KraService,
} from '../../../../_services/index';
import {
  KraCompanySettings,
  DiscussionNotes,
  SessionUser,
  AppSettings,
  DiscussionRating,
} from '../../../../_models/index';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-discussion-manual',
  templateUrl: './discussion-manual.page.html',
  styleUrls: ['./discussion-manual.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DiscussionManualPage implements OnInit, OnDestroy {
  private readonly onDestroy = new Subject<void>();

  _sessionUser: SessionUser;
  _allowedTypes = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pps', 'odt', 'txt', 'pdf', 'jpg', 'jpeg', 'png', 'bmp', 'msg', 'eml', 'zip', 'zipx',];
  _employeeView = true;
  _preCheckImages = false;
  _selectedUser = {};
  _discussionNotes = [new DiscussionNotes()];
  _discussionRating = new DiscussionRating();
  _deletedDocuments = [];
  _kraCompanySettings: KraCompanySettings;
  _discussionDocs: object = {};
  _bCompleted = false;
  _searchTextUsers = '';
  _sRoleToEmployee = '';
  _employeeDetails: object;
  _discussionScaleItems = [];
  _discussionAccuracyScaleItems = [];
  _directReportEmployees = [];

  public _uuid: string = AppSettings.NEW_GUID;
  public uploader: FileUploader = new FileUploader({
    url: AppSettings.DISCUSSION_FILE_UPLOAD_ENDPOINT,
    autoUpload: true,
    removeAfterUpload: true,
    isHTML5: true,
  });

  constructor (
    public _authService: AuthService,
    private _router: Router,
    public _kraService: KraService,
    private _loaderService: LoaderService
  ) { }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._sessionUser = this._authService._sessionUser;
    this._kraCompanySettings = this._kraService._kraCompanySettings;
    this._sRoleToEmployee = this._kraService._sRoleToEmployee;
    this._preCheckImages = false;

    this._kraService.getDirectReportEmployees(this._sessionUser['P5Corp_userUID'])
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.setEmployeeDirectory();
      });

    this._kraService.getOrganisationKRADiscussionScales(this._sessionUser['P5Corp_userUID'])
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._discussionScaleItems = this._kraService._discussionScaleItems;
      });

    this._kraService.getOrganisationKRAAccuracyScales(this._sessionUser['P5Corp_userUID'])
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._discussionAccuracyScaleItems = this._kraService._discussionAccuracyScaleItems;
      });

    this.uploader.onAfterAddingFile = (fileItem: any) => {
      const fileType =
        fileItem.file['name'].split('.')[
        fileItem.file['name'].split('.').length - 1
        ];

      if (
        this._allowedTypes.indexOf(fileType.toLowerCase()) === -1 ||
        fileItem.file['size'] >= 2500000
      ) {
        if (this._allowedTypes.indexOf(fileType.toLowerCase()) === -1) {
          Swal.fire({
            title: 'Invalid File Type',
            html: 'Please make sure your file type is listed below:<br>PDF (.pdf)<br>Text (.txt)<br>Image (.jpg or .png or .bmp)<br>OpenDocument Text Document (.odt)<br>Microsoft Word (.doc or .docx)<br>Microsoft Power Point (.ppt or .pptx or .pps)<br>Microsoft Excel (.xls or .xlsx)<br>Mail Message (.msg or .eml)',
            icon: 'warning',
            confirmButtonColor: 'var(--primary)',
            heightAuto: false,
          });
        } else if (fileItem.file['size'] >= 2500000) {
          Swal.fire({
            title: 'Maximum File Size Exceeded',
            text: 'Please make sure the file you are uploading is smaller than 2.5mb',
            icon: 'warning',
            confirmButtonColor: 'var(--primary)',
            heightAuto: false,
          });
        }
      } else {
        this._uuid = AppSettings.NEW_GUID;
        fileItem.url =
          fileItem.url +
          '?id=' +
          this._uuid +
          '&type=' +
          fileItem.file['name'].split('.')[
          fileItem.file['name'].split('.').length - 1
          ] +
          '&usersUUID=' +
          this._sessionUser.P5Corp_userUID;
        fileItem.withCredentials = false;
        this._discussionDocs = {
          sAttachmentName: fileItem.file['name'],
          sFileName: fileItem.file['name'],
          sFileType:
            fileItem.file['name'].split('.')[
            fileItem.file['name'].split('.').length - 1
            ],
          sFileSize: fileItem.file['size'],
          userUUID: this._sessionUser.P5Corp_userUID,
          portalUserDocumentUploadsUUID: this._uuid,
        };
      }
    };
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  setEmployeeDirectory() {
    this._directReportEmployees = this._kraService._directReportEmployees;
    this._directReportEmployees.forEach((user) => {
      user['selected'] = false;
      if (user['sProfilePic'] === '') {
        user['srcFail'] = true;
      } else {
        user['srcFail'] = false;
        if (user['sProfilePic'].indexOf('?') === -1) {
          user['sProfilePic'] =
            user['sProfilePic'] + '?' + Math.floor(Math.random() * 1000 + 1);
        }
      }
    });

    this._preCheckImages = true;
    this._loaderService.exitLoader();
  }

  async selectedUser(employee) {
    this._selectedUser = employee;

    if ((employee.iMonth && employee.iYear) === '') {
      Swal.fire({
        title: 'User has not yet scored',
        text: 'The selected employee has not yet completed his latest review',
        icon: 'warning',
        confirmButtonColor: 'var(--primary)',
        heightAuto: false,
      });
    } else {
      this._loaderService.initLoader(true);
      this._employeeDetails = await this._kraService.getEmployeeDetails(
        this._selectedUser['userUUID']
      );

      this._kraService
        .getKraHRUrpRoleDiscussionNotes(employee.kraHrURPRoleUID, employee.iYear, employee.iMonth)
        .pipe(takeUntil(this.onDestroy))
        .subscribe((v) => {
          this._discussionNotes = this._kraService._discussionNotes;
          this._discussionNotes = this._discussionNotes;
          if (this._discussionNotes.length === 0) {
            this._discussionDocs = {};

            this._discussionNotes = [new DiscussionNotes()];
            this._discussionNotes[0].sCommentBy_fkUserUID =
              this._sessionUser.P5Corp_userUID;
            this._discussionNotes[0].kraHrURPRoleUID =
              employee['kraHrURPRoleUID'];
            this._discussionNotes[0].yearNumber = employee['iYear'];
            this._discussionNotes[0].monthNumber = employee['iMonth'];
            this._bCompleted = false;

            this._discussionRating = new DiscussionRating();
            this._discussionRating.kraHrURPRoleUID =
              employee['kraHrURPRoleUID'];
            this._discussionRating.bShowPerformanceDiscussionRating =
              this._kraCompanySettings.bShowPerformanceDiscussionRating;
          } else {
            this._discussionNotes[0].yearNumber = employee['iYear'];
            this._discussionNotes[0].monthNumber = employee['iMonth'];
            this._bCompleted = true;
          }
          this._loaderService.exitLoader();
          this._employeeView = false;
        });
    }
  }

  cancel() {
    this._loaderService.initLoader(true);
    this._employeeView = true;
    this._bCompleted = false;
    this._loaderService.exitLoader();
  }

  goPerformPage() {
    this._router.navigate(['perform'], { replaceUrl: true });
  }

  savePerformanceDiscussion() {
    this._loaderService.initLoader();
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
      this._kraService.saveDiscussionNotes(this._discussionNotes[0], this._discussionDocs, this._discussionRating)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this._router.navigate(['perform'], { replaceUrl: true });
          this._loaderService.exitLoader();
        });
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

}
