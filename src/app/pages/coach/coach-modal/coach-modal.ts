import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FileUploader } from 'ng2-file-upload';
import {
  AppSettings, Conversation, EditSubjectHeading,
  FileUpload, NewSubject, SessionUser
} from '../../../_models/index';
import { AuthService, ConversationService } from '../../../_services/index';

@Component({
  selector: 'coach-modal-page',
  styleUrls: ['../coach.page.scss'],
  templateUrl: './coach-modal.page.html',
})
export class CoachModalPage implements OnInit {
  // Data passed in by componentProps



  @Input() type: string;
  @Input() subjectHeadingEdit: EditSubjectHeading = new EditSubjectHeading();
  @Input() sessionUser: SessionUser;
  @Input() conversation: Conversation = new Conversation();
  @Input() newSubject: NewSubject = new NewSubject();
  @Input() selectedUser = [];
  @Input() searchFrom = '';
  @Input() searchTo = '';
  // END

  public file_Uploader: FileUploader = new FileUploader({
    url: AppSettings.PERSONAL_DOCUMENTS_UPLOAD_ENDPOINT,
    autoUpload: true,
    removeAfterUpload: true,
    isHTML5: true
  });

  // _newSubject: NewSubject = new NewSubject();
  _fileUuid: string = AppSettings.NEW_GUID;

  constructor (private modalController: ModalController,
    public _authService: AuthService,
    public _conversationService: ConversationService) {

  }

  ngOnInit(): void {
    this.file_Uploader.onAfterAddingFile = (fileItem: any) => {
      fileItem.url = fileItem.url +
        '?id=' + this._fileUuid +
        '&UserUID=' + this.sessionUser['P5Corp_userUID'] +
        '&type=' + fileItem.file['name'].split('.')[fileItem.file['name'].split('.').length - 1] +
        '&uploadType=' + 'coachConverstion' +
        '&sFileSize=' + fileItem.file['size'] +
        '&fileName=' + fileItem.file['name'];

      const _newFile = new FileUpload();
      _newFile.sFileName = fileItem.file['name'];
      _newFile.sUrl = fileItem.url;
      _newFile.fileUuid = this._fileUuid;

      this.newSubject['uploadedFiles'].push(_newFile);

      fileItem.withCredentials = false;
      this._fileUuid = AppSettings.NEW_GUID;
    };
  }

  clearSearchBox() {
    this.searchFrom = '';
    this.searchTo = '';
  }

  saveSubject() {
    this.modalController.dismiss(this.newSubject);
  }

  filterDates() {
    this.modalController.dismiss(this.searchFrom, this.searchTo);
  }

  saveNewHeading() {
    this.modalController.dismiss(this.subjectHeadingEdit);
  }

  removeFile(file) {
    file.bShowDocument = 0;
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true,
    });
  }

}