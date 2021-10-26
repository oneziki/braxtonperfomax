import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthService, LoaderService, TrainingService } from '../../../_services/index';

@Component({
  selector: 'app-trainers-tool',
  templateUrl: './trainers-tool.page.html',
  styleUrls: ['./trainers-tool.page.scss'],
})
export class TrainersToolPage implements OnInit {
  _userTrainingList = [];
  _trainersFilterData = {};
  _trainersUID = '';
  _isExternalTrainer = true;
  _sModules = '';
  _bNoData = false;
  _trainingMethod = ['Classroom', 'Online', 'Work session'];
  _scoreOrResult = ['Passed', 'Failed', 'Competent', 'Not competent', 'To train', 'In training', 'Tramming'];

  _isLoading = true;
  _isLoadingUserList = true;
  _isLoadingFilterData = true;
  _showSubmitAlert = false;
  _submitting = false;


  private readonly onDestroy = new Subject<void>();
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor (
    public _authService: AuthService,
    private router: Router,
    private _trainingService: TrainingService,
    private _loaderService: LoaderService) { }

  ngOnInit(): void {
    this._loaderService.initLoader(true);
    if (localStorage.getItem('isExternalTrainer')) {
      this._isExternalTrainer = JSON.parse(localStorage.getItem('isExternalTrainer'));
    }
    this._authService.hideAppPanel(true);

    this._trainersFilterData = this._trainingService._trainersFilterData;
    this._isLoadingFilterData = true;
    this._isLoadingUserList = true;


    this.setData();
    if (Object.keys(this._trainersFilterData).length === 0) {
      this._trainingService.getUserFilterData(this._trainersUID, this._isExternalTrainer)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this._trainersFilterData = this._trainingService._trainersFilterData;
          this.resetFilter();
          this._isLoadingFilterData = false;
          this.checkLoaderAllClear();
        });
    } else {
      this.resetFilter();
      this._isLoadingFilterData = false;
      this.checkLoaderAllClear();
    }

    this._trainingService.getTrainingUsers(this._trainersUID, this._isExternalTrainer)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._userTrainingList = this._trainingService._userTrainingList;
        if (this._userTrainingList.length === 0) {
          this._bNoData = true;
        }
        this._isLoadingUserList = false;
        this.checkLoaderAllClear();
      });

  }

  setData() {
    if (this._isExternalTrainer) {
      this._trainersUID = this._trainingService._trainersUID;
    } else {
      this._trainersUID = this._authService._sessionUser.P5Corp_userUID;
    }
  }

  resetFilter() {
    this._trainersFilterData['departmentFilter'] = 'none';
    this._trainersFilterData['candidateFilter'] = 'none';
    this._trainersFilterData['trainingModuleFilter'] = 'none';
    this._trainersFilterData['serviceProvider'] = 'none';
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.onDestroy.next();
  }

  checkLoaderAllClear() {
    let toReturn = true;

    if (this._isLoadingUserList) {
      toReturn = false;
    }
    if (this._isLoadingFilterData) {
      toReturn = false;
    }
    if (toReturn === true) {
      this._isLoading = false;
      this._loaderService.exitLoader();
    }
  }

  reCalculateDate(training) {
    training['dDateCompleted'] = training['dDateCompletedTemp'];
    this.validateData(training);
  }

  validateData(training) {
    // Validate data
    let bValid = true;

    if (training['ScoreResult'] === '') {
      bValid = false;
    } else {
      const iValue = this._scoreOrResult.findIndex(x => x === training['ScoreResult']);
      if (iValue === -1) {
        if (isNaN(training['ScoreResult'])) {
          bValid = false;
        }
      }
    }

    if (training['dDateCompleted'] === '') {
      bValid = false;
    }

    if (training['TrainingMethod'] === '') {
      bValid = false;
    }

    training['bValid'] = bValid;
  }

  validateUsers() {
    // Check if there is atleast one valid user before submitting data
    const iValue = this._userTrainingList.findIndex(x => x['bValid'] === true);
    if (iValue === -1) {
      Swal.fire({
        title: '',
        text: 'Please make sure there is atleast one valid candidate with data before submitting',
        icon: 'warning',
        showCloseButton: true,
        confirmButtonColor: 'var(--primary)',
        heightAuto: false,
      });
    } else {
      this._showSubmitAlert = true;
      Swal.fire({
        text: 'Are you sure you want to submit these candiates that have valid statuses',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        confirmButtonColor: 'var(--primary)',
        heightAuto: false,
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.submitData();
        }
      });
    }
  }

  submitData() {
    this._loaderService.initLoader(true);
    const userList = this._userTrainingList.filter(user => user.bValid === true);

    if (userList.length !== 0) {
      this._trainingService.saveCandidateTrainingNeedsData(userList)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.updateUserData();
        });
    }
  }

  sortBy(column) {
    if (column === 'Candidate') {

      // sort by Candidate asc/desc logic
      if (this._trainersFilterData['candidateFilter'] === 'desc' || this._trainersFilterData['candidateFilter'] === 'none') {
        this._userTrainingList.sort((a, b) => (a.sFullName > b.sFullName) ? 1 : -1);
        this._trainersFilterData['candidateFilter'] = 'asc';
      } else {
        this._userTrainingList.sort((a, b) => (b.sFullName > a.sFullName) ? 1 : -1);
        this._trainersFilterData['candidateFilter'] = 'desc';
      }
      // hide arrows for other columns that were prev sorted
      this._trainersFilterData['departmentFilter'] = 'none';
      this._trainersFilterData['trainingModuleFilter'] = 'none';
      this._trainersFilterData['serviceProvider'] = 'none';

    } else if (column === 'Department') {
      // sort by Department asc/desc logic
      if (this._trainersFilterData['departmentFilter'] === 'desc' || this._trainersFilterData['departmentFilter'] === 'none') {
        this._userTrainingList.sort((a, b) => (a.Department > b.Department) ? 1 : -1);
        this._trainersFilterData['departmentFilter'] = 'asc';
      } else {
        this._userTrainingList.sort((a, b) => (b.Department > a.Department) ? 1 : -1);
        this._trainersFilterData['departmentFilter'] = 'desc';
      }
      // hide arrows for other columns that were prev sorted
      this._trainersFilterData['candidateFilter'] = 'none';
      this._trainersFilterData['trainingModuleFilter'] = 'none';
      this._trainersFilterData['serviceProvider'] = 'none';

    } else if (column === 'Module') {
      // sort by Module asc/desc logic
      if (this._trainersFilterData['trainingModuleFilter'] === 'desc' || this._trainersFilterData['trainingModuleFilter'] === 'none') {
        this._userTrainingList.sort((a, b) => (a.sModule > b.sModule) ? 1 : -1);
        this._trainersFilterData['trainingModuleFilter'] = 'asc';
      } else {
        this._userTrainingList.sort((a, b) => (b.sModule > a.sModule) ? 1 : -1);
        this._trainersFilterData['trainingModuleFilter'] = 'desc';
      }
      // hide arrows for other columns that were prev sorted
      this._trainersFilterData['candidateFilter'] = 'none';
      this._trainersFilterData['departmentFilter'] = 'none';
      this._trainersFilterData['serviceProvider'] = 'none';

    } else if (column === 'Provider') {
      // sort by Provider asc/desc logic
      if (this._trainersFilterData['serviceProvider'] === 'desc' || this._trainersFilterData['serviceProvider'] === 'none') {
        this._userTrainingList.sort((a, b) => (a.sProvider > b.sProvider) ? 1 : -1);
        this._trainersFilterData['serviceProvider'] = 'asc';
      } else {
        this._userTrainingList.sort((a, b) => (b.sProvider > a.sProvider) ? 1 : -1);
        this._trainersFilterData['serviceProvider'] = 'desc';
      }
      // hide arrows for other columns that were prev sorted
      this._trainersFilterData['candidateFilter'] = 'none';
      this._trainersFilterData['trainingModuleFilter'] = 'none';
      this._trainersFilterData['departmentFilter'] = 'none';
    }

  }

  updateUserData() {
    this._isLoadingUserList = true;
    this._trainingService.getTrainingUsers(this._trainersUID, this._isExternalTrainer)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._userTrainingList = this._trainingService._userTrainingList;
        if (this._userTrainingList.length === 0) {
          this._bNoData = true;
        }
        this._loaderService.exitLoader();
        Swal.fire({
          title: '',
          text: 'Thank you for successfully submitting the training results',
          icon: 'info',
          showCloseButton: true,
          confirmButtonColor: 'var(--primary)',
          heightAuto: false,
          timer: 3000,
        });
      });
  }

  goBack() {
    this.router.navigate(['aspire/'], { replaceUrl: true });
  }

}
