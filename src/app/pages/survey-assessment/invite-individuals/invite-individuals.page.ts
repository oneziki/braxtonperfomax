import { Component, OnInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SurveyAssessmentDetails, SurveyEmployeeInviteData } from '../../../_models/index';
import { AuthService, LoaderService, SurveyAssessmentService } from '../../../_services';
import * as $ from "jquery";

@Component({
  selector: 'app-invite-individuals',
  templateUrl: './invite-individuals.page.html',
  styleUrls: ['./invite-individuals.page.scss'],
})
export class InviteIndividualsPage implements OnInit, OnDestroy {

  _surveyEmployeeInviteData = new SurveyEmployeeInviteData();
  _usersToInvite = [];
  _bAllowAssessors = false;
  _assessmentCompleted = false;
  sSubmitMessage = '';

  _invitedUsers = [];
  _removedUsers = [];
  _externalEmail = '';
  _sErrorMessage = '';
  _surveyAssessorType = { 'SurveyAssessorTypeUID': '', 'sAssessorTypeDescription': '' };
  _surveyAssessmentData = new SurveyAssessmentDetails();

  _nextButton = {
    disabled: false,
    text: 'Next'
  };

  // Alerts
  _showWarningAlert = false;
  _showSubmitAlert = false;
  _hasFocus = false;

  // search filter
  public _searchEmployee = '';
  public _employee = {};
  // search = (text$: Observable<string>) =>
  //   map.call(debounceTime.call(text$, 200),
  //     term => term === '' ? [] : this._surveyEmployeeInviteData['EmployeeList'].filter(v => v.sFullName.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  // search = (text$: Observable<string>) => text$.pipe(
  //   debounceTime(200),
  //   distinctUntilChanged(),
  //   filter(term => term.length >= 2),
  //   map(term => this._surveyEmployeeInviteData['EmployeeList'].filter(v => v.sFullName.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  // )

  // formatter = (x: { sFullName: string }) => x.sFullName;

  private readonly onDestroy = new Subject<void>();

  constructor (private _surveyAssessmentService: SurveyAssessmentService,
    public _authService: AuthService,
    private _router: Router,) { }

  ngOnInit() {
    this._surveyEmployeeInviteData = this._surveyAssessmentService._surveyEmployeeInviteData;
    this._surveyAssessmentData = this._surveyAssessmentService._surveyAssessmentData;

    if (this._surveyEmployeeInviteData) {
      this._surveyAssessmentService.getSurveyEmployeeInviteData(this._surveyAssessmentData['surveyHrPLIBRoleUID'], this._surveyAssessmentData['surveyHrURPRoleUID'])
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.setInviteEmployeeList();
        });
    } else {
      this.setInviteEmployeeList();
    }
  }

  setInviteEmployeeList() {
    this._surveyEmployeeInviteData = this._surveyAssessmentService._surveyEmployeeInviteData;

    if (this._surveyEmployeeInviteData['surveyDetails']['bInviteOthers'] === 1) {
      this._bAllowAssessors = true;
    } else {
      this._bAllowAssessors = false;
      $('#disableDiv').addClass('disabledbutton');
    }

    if (this._surveyEmployeeInviteData['surveyDetails']['bIsComplete'] === 1) {
      this._assessmentCompleted = true;
    }
    // this._loaderService.exitLoader();
  }

  ngOnDestroy() {
    this._surveyEmployeeInviteData = new SurveyEmployeeInviteData();
    this._surveyAssessmentData = new SurveyAssessmentDetails();
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  inviteUser() {
    if (this._surveyAssessorType['SurveyAssessorTypeUID'] === '') {
      Swal.fire({
        text: 'Please Select An Assessor Type',
        icon: 'warning',
        confirmButtonColor: 'var(--primary)',
        heightAuto: false
      });

    } else if ((this._invitedUsers.length + this._surveyEmployeeInviteData['surveyDetails']['UserInvitedList'].length) >= this._surveyEmployeeInviteData['surveyDetails']['iTotalInvitations']) {
      Swal.fire({
        text: 'You have exceeded this Assessments Max Assessor invite amount',
        icon: 'warning',
        confirmButtonColor: 'var(--primary)',
        heightAuto: false
      });
    } else {

      if (!this._employee.hasOwnProperty('sFullName')) {
        this._employee = {
          'initials': '',
          'sFullName': this._searchEmployee,
          'email': this._externalEmail,
          'bNew': true,
          'userUUID': '',
          'bExternal': true,
          'bManager': false,
          'SurveyAssessorTypeUID': this._surveyAssessorType['SurveyAssessorTypeUID'],
          'sAssessorTypeDescription': this._surveyAssessorType['sAssessorTypeDescription']
        };

      } else {
        this._employee['bExternal'] = false;
        this._employee['bNew'] = true;
        this._employee['bManager'] = false;
        this._employee['SurveyAssessorTypeUID'] = this._surveyAssessorType['SurveyAssessorTypeUID'];
        this._employee['sAssessorTypeDescription'] = this._surveyAssessorType['sAssessorTypeDescription'];
        this._invitedUsers = this._invitedUsers.filter(item => item.userUUID !== this._employee['userUUID']);
      }

      this._invitedUsers.push(this._employee);
      this._externalEmail = '';
      this._surveyAssessorType = { 'SurveyAssessorTypeUID': '', 'sAssessorTypeDescription': '' };
      this._employee = {};
      this._searchEmployee = '';
    }
  }

  univiteUser(inviteeData: object, inviteeIndex) {
    // remove unsaved users from the invite list

    Swal.fire({
      title: 'Remove ' + inviteeData['sFullName'],
      text: 'Are you sure you want to remove ' + inviteeData['sFullName'] + ' as an Assessor?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      buttonsStyling: false,
      confirmButtonColor: 'var(--primary)',
      heightAuto: false
    }).then((result) => {
      if (result.value) {
        if (inviteeData.hasOwnProperty('userUUID')) {
          this._invitedUsers = this._invitedUsers.filter(item => item.userUUID !== inviteeData['userUUID']);
        } else {
          this._invitedUsers = this._invitedUsers.filter(item => this._invitedUsers.indexOf(item) !== inviteeIndex);
        }
      }
    });
  }

  univiteAssessmentAssessors(inviteeData, assessorIndex) {
    // remove saved users from the invite list
    Swal.fire({
      title: 'Remove ' + inviteeData['sAssessorFullName'],
      text: 'Are you sure you want to remove ' + inviteeData['sAssessorFullName'] + ' as an Assessor?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      buttonsStyling: false,
      confirmButtonColor: 'var(--primary)',
      heightAuto: false
    }).then((result) => {
      if (result.value) {
        this._surveyEmployeeInviteData['surveyDetails']['UserInvitedList'] = this._surveyEmployeeInviteData['surveyDetails']['UserInvitedList'].filter(item =>
          item.surveyAssessmentInvitesUID !== inviteeData['surveyAssessmentInvitesUID']);
        this._removedUsers.push({
          'surveyAssessmentInvitesUID': inviteeData.surveyAssessmentInvitesUID
        });
      }
    });
  }

  findDuplicates(InvitedUsers) {
    // get list of emails from Invited Users Array
    const valueArr = InvitedUsers.map(function (item) { return item.email; });

    const result = [];

    valueArr.forEach(function (element, index) {
      // Find if there is a duplicate or not
      if (valueArr.indexOf(element, index + 1) > -1) {

        // Find if the element is already in the result array or not
        if (result.indexOf(element) === -1) {
          result.push(element);
        }
      }
    });

    if (result.length === 0) {
      return false;
    } else {
      return true;
    }
  }

  validateInvitees() {
    this._sErrorMessage = '';
    const checkDupUser = this.findDuplicates(this._invitedUsers);

    // check if user has invited or removed users
    if (this._invitedUsers.length !== 0 || this._removedUsers.length !== 0) {
      this.sSubmitMessage = 'Please confirm if you would like to submit the above individuals to provide feedback. If you would like to make updates before submitting, please click ""Cancel""';
      this.displaySubmits(checkDupUser);

      // if he has not invited or removed anyone but did not start assessment change submit message;
    } else if (!this._assessmentCompleted) {
      this.sSubmitMessage = 'Click Confirm To Allocate and Start the Survey Assessment';
      this.displaySubmits(checkDupUser);

      // display completed assessment message;
    } else {
      this.completedAssessment();
    }
  }

  displaySubmits(checkDupUser) {
    if (!checkDupUser) {
      this.triggerButton('submit');
      this.alertSubmit();
    } else {
      this._sErrorMessage = 'Please ensure that all email addresses for all assessors are unique'; this.alertWarning();
    }
  }

  alertWarning() {
    this._showWarningAlert = true;
  }

  triggerButton(btn) {
    switch (btn) {
      case 'submit':
        this._nextButton = {
          disabled: true,
          text: 'Submitting...'
        };
        break;
      default:
        this.setButtons();
    }
  }

  alertSubmit() {
    this._showSubmitAlert = true;
  }

  cancelSubmit() {
    this._showSubmitAlert = false;
    this.triggerButton('');
  }

  setButtons() {
    this._nextButton = {
      disabled: false,
      text: 'Next'
    };
  }

  completedAssessment() {
    this._nextButton = {
      disabled: true,
      text: 'Next'
    };

    Swal.fire({
      text: 'This assessment has been completed',
      icon: 'success',
      confirmButtonColor: 'var(--primary)',
      heightAuto: false
    });

  }

  allocateSurvey() {
    // logic on what to do starts here
    // this._loaderService.initLoader(true);

    // if its a new assessment allocate it first
    if (this._surveyAssessmentData['surveyHrURPRoleUID'] === '') {
      this._surveyAssessmentService.allocateSurveyProfile(this._surveyAssessmentData['surveyHrPLIBRoleUID'])
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.setAssessmentData();
        });

      // if assessment has been allocated, check if you have to update inviteds users
    } else if (this._invitedUsers.length !== 0 || this._removedUsers.length !== 0) {
      this.submitInvitedAssessors();

      // if no assessors has been added or removed check if assessment has been completed
    } else if (this._assessmentCompleted) {
      this.completedAssessment();

      // if it has not been completed take him to the questionnaire;
    } else {
      this.routeToQuestionnaire();
    }
  }

  setAssessmentData() {
    this._surveyAssessmentData = this._surveyAssessmentService._surveyAssessmentData;
    this.submitInvitedAssessors();
  }

  submitInvitedAssessors() {
    // after allocation check for what logic to do next

    // if assessment has been allocated, check if you have to update inviteds users
    if (this._invitedUsers.length !== 0 || this._removedUsers.length !== 0) {
      this._surveyAssessmentService.submitInvitedAssessors(this._invitedUsers, this._removedUsers,
        this._surveyAssessmentData['surveyHrURPRoleUID'])
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.routeToQuestionnaire();
        });

      // if no assessors has been added or removed check if assessment has been completed
    } else if (this._assessmentCompleted) {
      this.completedAssessment();

      // if it has not been completed take him to the questionnaire;
    } else {
      this.routeToQuestionnaire();
    }
  }

  routeToQuestionnaire() {
    //  check if assessment has been completed
    if (this._assessmentCompleted) {
      // this._loaderService.exitLoader();
      this._nextButton = {
        disabled: true,
        text: 'Next'
      };
      Swal.fire({
        text: 'Asessors added and removed successfully',
        icon: 'success',
        confirmButtonColor: 'var(--primary)',
        heightAuto: false
      });
    } else {
      // if it has not been completed take him to the questionnaire;
      this._authService._linkSurveyUID = this._surveyAssessmentData['surveyHrURPRoleUID'];
      this._authService._linkUserUID = this._surveyAssessmentData['surveyAssessmentAssessorsUID'];
      // this._loaderService.exitLoader();
      this._router.navigate(['survey-assessment/questionnaire'], { replaceUrl: true });
    }
  }

  routeBack() {
    this._router.navigate(['survey-assessment/sa-category-list'], { replaceUrl: true });
  }

  searchEmployee() {
    this._employee = {};

    const user = this._surveyEmployeeInviteData['EmployeeList'].find(employee => employee.sFullName === this._searchEmployee);
    if (user !== undefined) {
      this._employee = user;
    }
  }

}
