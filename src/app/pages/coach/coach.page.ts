
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FileUploader } from 'ng2-file-upload';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import {
  AppSettings, Conversation, ConversationFilterData, EditSubjectHeading,
  FileUpload, Message, NewSubject, SessionUser, UserData
} from '../../_models/index';
import { AuthService, ConversationService, LoaderService, PrintToolService } from '../../_services/index';
import { CoachModalPage } from './coach-modal/coach-modal';

@Component({
  selector: 'app-coach',
  templateUrl: './coach.page.html',
  styleUrls: ['./coach.page.scss'],
})
export class CoachPage implements OnInit, OnDestroy {

  public file_Uploader: FileUploader = new FileUploader(
    {
      url: AppSettings.PERSONAL_DOCUMENTS_UPLOAD_ENDPOINT,
      autoUpload: true,
      removeAfterUpload: true,
      isHTML5: true
    });

  public file_Uploader_newMessage: FileUploader = new FileUploader(
    {
      url: AppSettings.PERSONAL_DOCUMENTS_UPLOAD_ENDPOINT,
      autoUpload: true,
      removeAfterUpload: true,
      isHTML5: true
    });

  _fileUuid: string = AppSettings.NEW_GUID;

  _searchFrom = '';
  _searchTo = '';


  _conversation: Conversation = new Conversation();
  _sMessage: Message = new Message();
  _newSubject: NewSubject = new NewSubject();
  _preCheckImages: boolean;
  _sessionUser: SessionUser;
  _userData: UserData = new UserData();
  _coach: object;
  _subjectHeadingEdit: EditSubjectHeading = new EditSubjectHeading();
  _editSubjectHolder: NewSubject = new NewSubject();

  _subjects = [];
  _selectedUser = [];
  _conversationCategories = [];
  _peformCategory = [];
  _conversationFeed = [];
  _latestConversation = [];

  _conversationPDFData = {};

  _searchTextUsers = '';
  _searchTextSubject = '';

  _maxCardHeight = 0;
  _userSelected = false;

  _canPublish = true;
  _throttleTime = 2000; //2 seconds
  _clearInterval = 2500; //2.5 seconds
  _isUserTyping = false;
  _clearTimerId;

  _isLoadingCategories = true;
  _isLoadingLatestConversation = true;
  _isLoadingUserList = true;

  private readonly onDestroy = new Subject<void>();
  private _onlineUsers: Subscription;
  private _userOnlineOffline: Subscription;
  private _newConversationMessage: Subscription;
  private _userTypingCoach: Subscription;
  constructor (private _loaderService: LoaderService,
    public _authService: AuthService,
    public _conversationService: ConversationService,
    private _printtoolService: PrintToolService,
    public modalController: ModalController
    // ,
    // private modalService: NgbModal
  ) { }

  ngOnInit() {
    this._preCheckImages = false;
    this._loaderService.initLoader(true);
    this._authService.hideAppPanel(true);
    this._sessionUser = this._authService._sessionUser;
    this._userData = this._conversationService._userData;
    this._conversationService.updateSessionUser(true);
    this._isLoadingUserList = true;
    this._isLoadingLatestConversation = true;
    this._isLoadingCategories = true;

    for (let index = 0; index < this._authService['_sessionUser']['companytemplate']['linkedTiles'].length; index++) {
      const portalTile = this._authService['_sessionUser']['companytemplate']['linkedTiles'][index];
      if (portalTile['sName'] === 'Coach') {
        this._coach = portalTile;
        break;
      }
    }

    this._conversation['sSender_fkUserUUID'] = this._sessionUser.P5Corp_userUID;
    this._onlineUsers = this._conversationService.onlineUsers.subscribe(value => this.setOnlineUserList(value));
    this._userOnlineOffline = this._conversationService.userOnlineOffline.subscribe(value => this.updateUserList(value));
    this._newConversationMessage = this._conversationService.newConversationMessage.subscribe(value => this.updateConversationFeed(value));
    this._userTypingCoach = this._conversationService.userTypingCoach.subscribe(value => this.userIsTyping(value));

    this._conversationService.getUserData(this._sessionUser.P6_userUID)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._userData = this._conversationService._userData;
        this.setCoachDirectory();
      });


    this._conversationService.getConversationCategories(this._sessionUser.P5Corp_userUID)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._conversationCategories = this._conversationService._conversationCategories;
        this._isLoadingCategories = false;
        this._conversationCategories.forEach(category => {
          if (category.sCategoryName.toLowerCase() === 'perform') {
            // use to display selected default peform category
            this._peformCategory = category;
          }
        });
        this.checkLoaderAllClear();
        this.getLatestConversation();
      });


    this.file_Uploader.onAfterAddingFile = (fileItem: any) => {
      fileItem.url = fileItem.url +
        '?id=' + this._fileUuid +
        '&UserUID=' + this._sessionUser.P5Corp_userUID +
        '&type=' + fileItem.file['name'].split('.')[fileItem.file['name'].split('.').length - 1] +
        '&uploadType=' + 'coachConverstion' +
        '&sFileSize=' + fileItem.file['size'] +
        '&fileName=' + fileItem.file['name'];

      const _newFile = new FileUpload();
      _newFile.sFileName = fileItem.file['name'];
      _newFile.sUrl = fileItem.url;
      _newFile.fileUuid = this._fileUuid;

      this._newSubject.uploadedFiles.push(_newFile);

      fileItem.withCredentials = false;
      this._fileUuid = AppSettings.NEW_GUID;
    };

    this.file_Uploader_newMessage.onAfterAddingFile = (fileItem: any) => {
      fileItem.url = fileItem.url +
        '?id=' + this._fileUuid +
        '&UserUID=' + this._sessionUser.P5Corp_userUID +
        '&type=' + fileItem.file['name'].split('.')[fileItem.file['name'].split('.').length - 1] +
        '&uploadType=' + 'coachConverstion' +
        '&sFileSize=' + fileItem.file['size'] +
        '&fileName=' + fileItem.file['name'];

      const _newFile = new FileUpload();
      _newFile.sFileName = fileItem.file['name'];
      _newFile.sUrl = fileItem.url;
      _newFile.fileUuid = this._fileUuid;
      _newFile.sDocumentUploadName = fileItem.file['name'];

      this._sMessage.uploadedFiles.push(_newFile);

      fileItem.withCredentials = false;
      this._fileUuid = AppSettings.NEW_GUID;
    };

  }

  ngOnDestroy() {
    this._onlineUsers.unsubscribe();
    this._userOnlineOffline.unsubscribe();
    this._newConversationMessage.unsubscribe();
    this._userTypingCoach.unsubscribe();

    this.onDestroy.next();
    this.onDestroy.complete();
    this.closePDFView();
  }


  checkLoaderAllClear() {
    let toReturn = true;

    if (this._isLoadingCategories) {
      toReturn = false;
    }
    if (this._isLoadingLatestConversation) {
      toReturn = false;
    }
    if (this._isLoadingUserList) {
      toReturn = false;
    }

    if (toReturn === true) {
      // this._isLoading = false;
      this._loaderService.exitLoader();
    }
  }

  closePDFView() {
    this._printtoolService._triggerClosingView.emit();
  }

  setCoachDirectory() {
    this._userData['userManagers'].forEach(user => {
      user['selected'] = false;
      if (user['sProfilePic'] === '') {
        user['srcFail'] = true;
      } else {
        user['srcFail'] = false;
        if (user['sProfilePic'].indexOf('?') === -1) {
          user['sProfilePic'] = user['sProfilePic'] + '?' + Math.floor((Math.random() * 1000) + 1);
        }
      }
    });

    this._userData['userReportToEmployees'].forEach(user => {
      user['selected'] = false;
      if (user['sProfilePic'] === '') {
        user['srcFail'] = true;
      } else {
        user['srcFail'] = false;
        if (user['sProfilePic'].indexOf('?') === -1) {
          user['sProfilePic'] = user['sProfilePic'] + '?' + Math.floor((Math.random() * 1000) + 1);
        }
      }
    });

    this._preCheckImages = true;
    this._isLoadingUserList = false;

    this.checkLoaderAllClear();
  }

  getLatestConversation() {
    this._conversationService.getLatestConversation(this._sessionUser.P6_userUID)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._latestConversation = this._conversationService._latestConversation;
        this._isLoadingLatestConversation = false;
        this.setLatestconversation();
      });
  }

  setLatestconversation() {
    let employee = [];
    let categorie = [];
    let bDefaultCatg = true;
    if (this._latestConversation.length !== 0) {

      let iUser = this._userData['userManagers'].findIndex(x => x['userUUID'] === this._latestConversation[0]['userUUID']);
      if (iUser === -1) {
        iUser = this._userData['userReportToEmployees'].findIndex(x => x['userUUID'] === this._latestConversation[0]['userUUID']);
        employee = this._userData['userReportToEmployees'][iUser];
      } else {
        employee = this._userData['userManagers'][iUser];
      }

      let iCategorie = this._conversationCategories.findIndex(x => x['ConversationCategoryUID'] === this._latestConversation[0]['ConversationCategoryUID']);
      categorie = this._conversationCategories[iCategorie];
      bDefaultCatg = false;
    } else {
      employee = this._userData['userManagers'][0];
      categorie = this._peformCategory;
      bDefaultCatg = true;
    }
    this.selectedUser(employee, bDefaultCatg, categorie)

  }

  selectedUser(employee, bDefaultCategorie, category) {
    this._loaderService.initLoader(true);

    this._conversation['sReciever_fkUserUID'] = employee.userUUID;
    // set selected to use with showing seleted user
    employee.selected = true;
    // set selected employee and close big view of employees;
    this._selectedUser = employee;
    this._userSelected = true;
    this._conversationCategories.forEach(category => {
      category['iNumNotification'] = 0;
    });

    for (let i = 0; i < employee['categories'].length; i++) {
      for (let j = 0; j < this._conversationCategories.length; j++) {
        if (employee['categories'][i]['ConversationCategory_fkConversationCategoryUID'] === this._conversationCategories[j]['ConversationCategoryUID']) {
          this._conversationCategories[j]['iNumNotification'] = employee['categories'][i]['iNumNotification'];
          break;
        }
      }
    }

    // set peform category as the default category
    if (bDefaultCategorie) {
      if (this._peformCategory) {
        this.setSubjects(this._peformCategory, true);
      }
    } else {
      this.setSubjects(category, false);
    }
  }


  setSubjects(category, bdefaultSubject) {
    this._conversationFeed = [];
    this._loaderService.initLoader(true);

    this._conversation['ConversationCategoryUID'] = category.ConversationCategoryUID;
    this._conversation['sCategoryName'] = category.sCategoryName;

    this._conversationService.getCategorieSubjects(this._conversation)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._subjects = this._conversationService._subjects;
        if (bdefaultSubject) {
          if (this._subjects && this._subjects.length !== 0) {
            this.getConversation(this._subjects[0]);
          } else {
            this._loaderService.exitLoader();
          }
        } else {
          const iSubject = this._subjects.findIndex(x => x['ConversationSubjectsUID'] === this._latestConversation[0]['ConversationSubjectsUID']);
          const subject = this._subjects[iSubject]
          this.getConversation(subject);
        }
      });
  }

  async open(type, subjectData) {

    if (type === 'editSubject') {
      this._editSubjectHolder = subjectData;
      this._subjectHeadingEdit = new EditSubjectHeading();
      this._subjectHeadingEdit.ConversationSubjectsUID = subjectData.ConversationSubjectsUID;
      this._subjectHeadingEdit.sSubject = subjectData.sSubject;
    } else if (type === 'filter') {
      const conversation = this._conversationService._conversationFeed;
      this._conversationFeed = conversation;
    }

    const modal = await this.modalController.create({
      component: CoachModalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'sessionUser': this._sessionUser,
        'subjectHeadingEdit': this._subjectHeadingEdit,
        'type': type,
        'conversation': this._conversation,
        'newSubject': this._newSubject,
        'selectedUser': this._selectedUser,
        'searchFrom': this._searchFrom,
        'searchTo': this._searchTo
      }
    });

    modal.onDidDismiss()
      .then((data) => {
        const returnedData = data;

        if (data.data && data.data.dismissed !== true) {
          if (type === 'email') {
            this._newSubject = returnedData.data;
            this.saveSubject();
          } else if (type === 'editSubject') {
            this._subjectHeadingEdit = returnedData.data;
            this.saveNewHeading()
          } else if (type === 'filter') {
            this._searchFrom = returnedData.data;
            this._searchTo = returnedData.role;
            this.filterDates()
          }
        }
      });

    return await modal.present();
  }

  saveSubject() {
    this._loaderService.initLoader(true);

    this._conversationService.saveSubject(this._conversation, this._newSubject, this._sessionUser.P5Corp_userUID)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {

        // create date to push into subjects array
        const date = new Date();
        const formattedDate = date.toLocaleDateString('en-GB', {
          day: 'numeric', month: 'short', year: 'numeric'
        }).replace(/ /g, ' ');

        const subjObj = {
          sSubject: this._newSubject.sSubject,
          ConversationSubjectsUID: this._conversationService._conversationSubjectsUID,
          dDateCreated: formattedDate,
          iNumNotification: 0
        };

        // add to the beginning of array
        this._subjects.unshift(subjObj);
        this.getConversation(subjObj);

        this._newSubject = new NewSubject();
      });

  }

  getConversation(subject) {
    this._loaderService.initLoader(true);
    // calculate new notification amounts
    this._selectedUser['iNumNotification'] -= subject['iNumNotification'];
    this._coach['iNumNotifications'] -= subject['iNumNotification'];

    // remove from employee catg array
    for (let index = 0; index < this._selectedUser['categories'].length; index++) {
      const categories = this._selectedUser['categories'][index];
      if (categories['ConversationCategory_fkConversationCategoryUID'] === this._conversation['ConversationCategoryUID']) {
        categories['iNumNotification'] -= subject['iNumNotification'];
      }
    }

    // calculate iNumNotification from conversation categories array for immediate visual update
    for (let j = 0; j < this._conversationCategories.length; j++) {
      if (this._conversation['ConversationCategoryUID'] === this._conversationCategories[j]['ConversationCategoryUID']) {
        this._conversationCategories[j]['iNumNotification'] -= subject['iNumNotification'];
        break;
      }
    }

    subject['iNumNotification'] = 0;

    this._conversation['ConversationSubjectsUID'] = subject.ConversationSubjectsUID;
    this._conversation['sSubject'] = subject.sSubject;
    this._searchFrom = '';
    this._searchTo = '';

    // Empties previous message and resets data
    this.setMessageData();

    this._conversationService.getConversation(this._conversation)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._conversationFeed = this._conversationService._conversationFeed;
        this.checkProfilePictures();
      });
  }

  checkProfilePictures() {
    this._conversationFeed.forEach(user => {
      if (user['sProfilePic'] === '') {
        user['srcFail'] = true;
      } else {
        user['srcFail'] = false;
        if (user['sProfilePic'].indexOf('?') === -1) {
          user['sProfilePic'] = user['sProfilePic'] + '?' + Math.floor((Math.random() * 1000) + 1);
        }
      }
    });
    this._loaderService.exitLoader();
  }

  sendMessage() {
    this._loaderService.initLoader(true);

    if (/^ *$/.test(this._sMessage.sConversation)) {
      this._loaderService.exitLoader();
      Swal.fire({
        text: 'Messagebox Cannot be empty!',
        icon: 'error',
        showCloseButton: true,
        heightAuto: false
      }).then(function () { }).catch();
    } else {
      this._conversationService.saveConversation(this._conversation, this._sMessage, this._sessionUser.P5Corp_userUID)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.refreshConversationFeed();
        });
    }

  }

  refreshConversationFeed() {
    this._conversationService.getConversation(this._conversation)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._conversationFeed = this._conversationService._conversationFeed;
        // Empties previous message and resets data
        this.setMessageData();
        this.checkProfilePictures();
        this._loaderService.exitLoader();
      });
  }

  setMessageData() {
    this._sMessage = new Message();
    this._sMessage.sSubject = this._conversation['sSubject'];
    this._sMessage.ConversationSubjectsUID = this._conversation['ConversationSubjectsUID'];
    this._sMessage.sFirstName = this._sessionUser['sFirstname'];
  }

  downloadConversation(subject) {
    this._loaderService.initLoader(true);
    const pdfData = new ConversationFilterData();
    pdfData.ConversationSubjectsUID = subject.ConversationSubjectsUID;
    pdfData.bFiltered = false;
    this._conversationService.getPDFConversationData(pdfData)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._conversationPDFData = this._conversationService._conversationPDFData;
        this._conversationPDFData['P5Corp_userUID'] = this._sessionUser.P5Corp_userUID;
        this._printtoolService.initViewConversationFeedReportView(this._conversationPDFData);
        this._loaderService.exitLoader();
      });
  }

  removeFile(file) {
    file.bShowDocument = 0;
  }

  filterDates() {
    if (this._searchFrom === '' || this._searchTo === '') {
      Swal.fire({
        text: 'Please select valid start and end dates',
        icon: 'warning',
        showCloseButton: true,
        heightAuto: false
      }).then(function () { }).catch();
    } else {
      const start = this._searchFrom;
      const end = this._searchTo;
      let conversation = this._conversationService._conversationFeed;

      conversation = conversation.filter(m => {
        // fix for server timezone issue where time is +2 hours
        const filterTimeZoneDiff = new Date(m.filterDate);
        filterTimeZoneDiff.setHours(filterTimeZoneDiff.getHours() - 2);
        return new Date(m.filterDate) >= new Date(start) && new Date(filterTimeZoneDiff) <= new Date(end);
      });

      if (conversation.length === 0) {
        this._searchFrom = '';
        this._searchTo = '';
        Swal.fire({
          text: 'No communication occured between selected dates. Please select new dates',
          icon: 'warning',
          showCloseButton: true,
          heightAuto: false
        }).then(function () { }).catch();
      } else {
        // this.modalService.dismissAll();
        this._conversationFeed = conversation;

      }
    }
  }

  downloadFilteredConversation() {
    const pdfData = new ConversationFilterData();

    const fromDate = this._searchFrom['year'] + '-' + this._searchFrom['month'] + '-' + this._searchFrom['day'];
    const toDate = this._searchTo['year'] + '-' + this._searchTo['month'] + '-' + this._searchTo['day'];

    pdfData['ConversationSubjectsUID'] = this._conversation.ConversationSubjectsUID;

    if (this._searchFrom === '' || this._searchTo === '') {
      pdfData['bFiltered'] = false;
    } else {
      pdfData['bFiltered'] = true;
      pdfData['dFromDate'] = fromDate;
      pdfData['dToDate'] = toDate;
    }


    this._loaderService.initLoader(true);
    this._conversationService.getPDFConversationData(pdfData)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._conversationPDFData = this._conversationService._conversationPDFData;
        this._conversationPDFData['P5Corp_userUID'] = this._sessionUser.P5Corp_userUID;
        this._printtoolService.initViewConversationFeedReportView(this._conversationPDFData);
        this._loaderService.exitLoader();
      });
  }

  saveNewHeading() {
    // this.modalService.dismissAll();
    this._loaderService.initLoader(true);
    this._conversationService.updateSubject(this._subjectHeadingEdit)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._editSubjectHolder.sSubject = this._subjectHeadingEdit.sSubject;
        this._loaderService.exitLoader();
      });
  }

  deleteUploadedFile(conversation, doc) {

    Swal.fire({
      title: 'Remove ' + doc.sDocumentUploadName,
      text: 'Are you sure you want to remove the file ' + doc.sDocumentUploadName,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      buttonsStyling: false,
      heightAuto: false
    }).then((result) => {
      if (result.value) {
        this._loaderService.initLoader(true);
        this._conversationService.removeUploadedFile(doc, this._sessionUser.P5Corp_userUID)
          .pipe(takeUntil(this.onDestroy))
          .subscribe(v => {
            this._loaderService.exitLoader();
            conversation['uploadedFiles'] = conversation['uploadedFiles'].filter(({ UserPersonalDocumentUID }) => UserPersonalDocumentUID
              !== doc.UserPersonalDocumentUID);
          });
      }
    });
  }

  setOnlineUserList(employeeList) {
    // Online
    this._userData['userReportToEmployees'].forEach(userArray => {
      employeeList[this._sessionUser['sCompanyName']].forEach(userObsv => {
        if (userArray['userUUID'] === userObsv['userUID']) {
          userArray['bIsOnline'] = true;
        }

      });
    });
    this._userData['userManagers'].forEach(userArray => {
      employeeList[this._sessionUser['sCompanyName']].forEach(userObsv => {
        if (userArray['userUUID'] === userObsv['userUID']) {
          userArray['bIsOnline'] = true;
        }
      });
    });
  }

  updateUserList(user) {
    if (user['sCompanyName'] !== this._sessionUser['sCompanyName']) return;
    let index = 0;

    index = this._userData['userReportToEmployees'].findIndex(x => x['userUUID'] === user['userUID']);

    if (index !== -1) {
      this._userData['userReportToEmployees'][index]['bIsOnline'] = user['bIsOnline'];
    } else {
      index = this._userData['userManagers'].findIndex(x => x['userUUID'] === user['userUID']);
      if (index !== -1) {
        this._userData['userManagers'][index]['bIsOnline'] = user['bIsOnline'];
      }
    }
  }

  updateConversationFeed(message) {
    // Check if message is for intended employee
    if (message[1]['sReciever_fkUserUID'] !== this._sessionUser.P5Corp_userUID) return;
    // Is He Viewing The Message Sender
    if (message[1]['sSender_fkUserUUID'] === this._conversation['sReciever_fkUserUID']) {
      // Is he viewing the same Category
      if (this._conversation['ConversationCategoryUID'] === message[1]['ConversationCategoryUID']) {
        // Is he Viewing the Same Subject
        if (this._conversation['ConversationSubjectsUID'] === message[1]['ConversationSubjectsUID']) {
          // If its the same Subject Refresh Feed
          this.refreshFeed();
          // If its the not the same Subject Check If subject Exists
        } else if (this._subjects.findIndex(x => x['ConversationSubjectsUID'] === message[1]['ConversationSubjectsUID']) !== -1) {
          // If it exists add a notification to show there is a new message
          // Add a notification aswell as update the category List so Notifications Dont go into the negative for the correct employee
          const iSub = this._subjects.findIndex(x => x['ConversationSubjectsUID'] === message[1]['ConversationSubjectsUID']);
          this._subjects[iSub]['iNumNotification'] += 1;
          this.setNotificationForEmployee(message);
        } else {
          // If it doesnt Exists Update & Refresh subject list and set notification icon to display correctly showing where new message is
          this.refreshSubjectList(message);
          this.setCategoryNotifcation(message);
        }
      } else {
        // If he is not viewing the same Category update correct category and add notification to correct employee
        this.setCategoryNotifcation(message);
        this.setNotificationForEmployee(message);
      }
    } else {
      this.setNotificationForEmployee(message);
    }
  }

  setNotificationForEmployee(message) {
    // Match Employee with message sender to update Notifications
    const iReportEmp = this._userData['userReportToEmployees'].findIndex(x => x['userUUID'] === message[1]['sSender_fkUserUUID']);
    if (iReportEmp !== -1) {
      this._userData['userReportToEmployees'][iReportEmp]['iNumNotification'] += 1;
      const iCatgRep = this._userData['userReportToEmployees'][iReportEmp]['categories'].findIndex(
        x => x['ConversationCategory_fkConversationCategoryUID'] === message[1]['ConversationCategoryUID']);
      if (iCatgRep !== -1) {
        // add notification to category
        this._userData['userReportToEmployees'][iReportEmp]['categories'][iCatgRep]['iNumNotification'] += 1;
      } else {
        // create object for categories
        const catObj = {};
        catObj['ConversationCategory_fkConversationCategoryUID'] = message[1]['ConversationCategoryUID'];
        catObj['iNumNotification'] = 1;
        this._userData['userReportToEmployees'][iReportEmp]['categories'].push(catObj);
      }
    } else {
      const iUserEmp = this._userData['userManagers'].findIndex(x => x['userUUID'] === message[1]['sSender_fkUserUUID']);
      this._userData['userManagers'][iUserEmp]['iNumNotification'] += 1;

      const iCatgEmp = this._userData['userManagers'][iUserEmp]['categories'].findIndex(
        x => x['ConversationCategory_fkConversationCategoryUID'] === message[1]['ConversationCategoryUID']);
      if (iCatgEmp !== -1) {
        // add notification to category
        this._userData['userManagers'][iUserEmp]['categories'][iCatgEmp]['iNumNotification'] += 1;
      } else {
        // create object for categories
        const catObj = {};
        catObj['ConversationCategory_fkConversationCategoryUID'] = message[1]['ConversationCategoryUID'];
        catObj['iNumNotification'] = 1;
        this._userData['userManagers'][iUserEmp]['categories'].push(catObj);
      }
    }
  }

  setCategoryNotifcation(message) {
    // add one notifcation to correct cateogry
    const iCateg = this._conversationCategories.findIndex(x => x['ConversationCategoryUID'] === message[1]['ConversationCategoryUID']);
    this._conversationCategories[iCateg]['iNumNotification'] += 1;
  }

  refreshFeed() {
    // Refresh conversation Feed and update it with latest one
    this._conversationService.getConversation(this._conversation)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._conversationFeed = this._conversationService._conversationFeed;
        this.checkProfilePictures();
      });
  }

  refreshSubjectList(message) {
    // Refresh SubjectList and update it with latest one aswell as set the correct notfication for employee
    this._conversationService.getCategorieSubjects(this._conversation)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._subjects = this._conversationService._subjects;
        this.setNotificationForEmployee(message);
      });
  }

  onKeydown(event, bBol) {
    if (!bBol) {
      if (event.key === 'Enter' && event.ctrlKey === true) {
        this._newSubject['sConversation'] = this._newSubject['sConversation'] + '\r\n';
      } else if (event.key === 'Enter' && !/^ *$/.test(this._newSubject['sConversation'])) {
        if (!/^ *$/.test(this._newSubject['sSubject'])) {
          this.saveSubject();
          // this.modalService.dismissAll('Close click');
        }
      }
    } else {

      if (this._canPublish) {
        this._conversationService.isTypingCoach(this._conversation['sReciever_fkUserUID'], this._sMessage['ConversationSubjectsUID']);
        this._canPublish = false;
        setTimeout(() => {
          this._canPublish = true;
        }, this._throttleTime);
      }

      if (event.key === 'Enter' && event.ctrlKey === true) {
        this._sMessage['sConversation'] = this._sMessage['sConversation'] + '\r\n';
      } else if (event.key === 'Enter' && !/^ *$/.test(this._sMessage['sConversation'])) {
        this.sendMessage();
      }
    }
  }

  userIsTyping(userSubject) {
    if (userSubject[1] === this._sMessage['ConversationSubjectsUID'] && userSubject[0] === this._sessionUser['P5Corp_userUID']) {
      this._isUserTyping = true;
      if (this._clearTimerId) {
        clearTimeout(this._clearTimerId);
      }

      this._clearTimerId = setTimeout(() => {
        this._isUserTyping = false;
      }, this._clearInterval);
    }
  }



}
