import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SessionUser } from '../_models';
import { AuthService, EmployeeDirectoryService, LoaderService, MyMax7Service, ResourcesService, SurveyAssessmentService } from '../_services/index';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<any> = new Subject<any>();
  private Subscription: Subscription;
  private readonly onDestroy = new Subject<void>();

  _resourcesList = [];
  _featuredResourcesList = [];
  _notificationsList = [];
  _academiesList = [];
  _tipsAndTutorialsList = [];
  _survey_categories = [];
  _sessionUser: SessionUser;
  _companyTemplate: {};
  _myMaxData = {};

  _notificationsFlag = 'Notification';
  _sCatUIDs = '20DFA320-7B71-4FED-B1FD-09890894BE3B'; // Alert Alert, this is testing

  _isLoadingNotification = true;
  _isLoading = true;
  _selectedAppTab = '';

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    speed: 6000,
    autoplay: true,
  };
  _imgDisplayTeamNum = 5;
  _myManagers = [];
  _directReports = [];

  resourceL1 = null;
  resourceL2 = null;

  chartOptions1 = {
    footerLegend: true
  }
  chartOptionsRadial = {
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: "30%",
          background: "transparent",
          image: undefined
        },
        dataLabels: {
          name: {
            show: false
          },
          value: {
            show: false
          }
        }
      }
    },
    dataLabels: {
      enabled: true
    },
    fill: {
      opacity: 1
    },
    legend: {
      show: true,
      floating: true,
      fontSize: "10px",
      position: "left",
      offsetX: 0,
      offsetY: 0,
      labels: {
        useSeriesColors: true
      },
      markers: {
        width: 8,
        height: 8,
      },
      formatter: function (seriesName, opts) {
        return (
          seriesName.substring(0, 10) +
          ":  " +
          opts.w.globals.series[opts.seriesIndex]
        );
      },
      itemMargin: {
        vertical: -1
      }
    }
  }

  chartOptions2 = {
    footerList: true
  }

  chartData3a = {
    chartType: 'columnGrid',
    series: [],
    labels: [],
    colors: ['#3c6f26']
  }
  chartData3b = {
    chartType: 'columnGrid',
    series: [],
    labels: [],
    colors: ['#3c6f26']
  }

  _chartsLoaded = false;

  chartOptions4 = {
    statusLayout: 'portrait'
  }

  _showHomeTips = false;
  _showHomeDevNeeds = false;

  constructor (public _authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _myMaxService: MyMax7Service,
    private _resourcesService: ResourcesService,
    private _employeeDirectoryService: EmployeeDirectoryService,
    private _surveyAssessmentService: SurveyAssessmentService,
    private _loaderService: LoaderService) { }

  ngOnInit() {
    this._loaderService.initLoader();
    this._authService.hideAppPanel(false);
    this._sessionUser = this._authService._sessionUser;
    this._companyTemplate = this._sessionUser['companytemplate'];
    this._selectedAppTab = this._authService._selectedAppTab;
    this._myManagers = this._employeeDirectoryService._employeeAdminReportTo;
    this._directReports = this._employeeDirectoryService._directReports;
    this._survey_categories = this._surveyAssessmentService._survey_categories;
    this._resourcesList = this._resourcesService._resources;
    this._featuredResourcesList = this._resourcesService._featuredResources;
    this._notificationsList = this._resourcesService._notifications;
    this._academiesList = this._resourcesService._academies;
    this._tipsAndTutorialsList = this._resourcesService._tipsAndTutorialsList;
    this._chartsLoaded = false;

    // Development Needs
    if (this._survey_categories.length === 0) {
      this._surveyAssessmentService.getSurveyAssessmentsForCategories(this._sCatUIDs, false)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.updateSurveyCategories();
        });
    } else {
      this.updateSurveyCategories();
    }

    // Resources
    if (this._resourcesList.length === 0) {
      this._resourcesService.getResources()
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.setResources()
        });
    } else {
      this.setResources();
    }

    // Featured Resources
    if (this._featuredResourcesList.length === 0) {
      this._resourcesService.getFeaturedResources()
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.setFeaturedResources()
        });
    } else {
      this.setFeaturedResources();
    }

    // Notifications
    if (this._notificationsList.length === 0) {
      this._resourcesService.getNotifications(this._notificationsFlag)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.setNotifications();
        });
    } else {
      this.setNotifications();
    }

    // Acadamies
    if (this._academiesList.length === 0) {
      this._resourcesService.getAcademies()
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.setAcademies();
        });
    } else {
      this.setAcademies();
    }

    // Tips & Tutorials
    if (this._tipsAndTutorialsList.length === 0) {
      this._resourcesService.getTipsAndTutorials()
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.setTipsAndTutorials();
        });
    } else {
      this.setTipsAndTutorials();
    }

    // Report To's
    if (this._myManagers.length === 0) {
      const managers = this._employeeDirectoryService.getEmployeesAdminReportTo(this._sessionUser.P6_userUID).then(response => {
        this._myManagers = response;
        if (this._myManagers.length === 2) {
          this._imgDisplayTeamNum = 4
        }
      });
    }

    // Direct Reports
    if (this._myManagers.length === 0) {
      const managers = this._employeeDirectoryService.getDirectReportsForEmployee(this._sessionUser.P6_userUID).then(response => {
        this._directReports = response;
      });
    }

    this._myMaxService.getHomeTabData(this._sessionUser.P6_userUID)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(myMaxData => {
        this._myMaxData = myMaxData;
        this._chartsLoaded = true;
      });

    this._loaderService.exitLoader();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.onDestroy.next();
  }

  setResources() {
    this._resourcesList = this._resourcesService._resources;
    this._resourcesService._resources.forEach(element => {
      this._resourcesList = this._resourcesList.filter(item => item.sFlag === 'Resource P7');
    });
    this._resourcesList[0]['subCategory'].forEach(element => {
      element['showDetails'] = false;
    });
    this._isLoadingNotification = false;
    this.checkLoaderAllClear();
  }

  setFeaturedResources() {
    this._featuredResourcesList = this._resourcesService._featuredResources;
    this._isLoadingNotification = false;
    this.checkLoaderAllClear();
  }

  setNotifications() {
    this._notificationsList = this._resourcesService._notifications;
    this._isLoadingNotification = false;
    this.checkLoaderAllClear();
  }

  setAcademies() {
    this._academiesList = this._resourcesService._academies;
    this._isLoadingNotification = false;
    this.checkLoaderAllClear();
  }

  setTipsAndTutorials() {
    this._tipsAndTutorialsList = this._resourcesService._tipsAndTutorialsList;
    this._isLoadingNotification = false;
    this.checkLoaderAllClear();
  }

  checkLoaderAllClear() {
    let toReturn = true;

    // if (this._isLoadingKRACompanySettings) {
    //   toReturn = false;
    // }
    // if (this._isLoadingTeamInfo) {
    //   toReturn = false;
    // }
    if (toReturn === true) {
      this._isLoading = false;
      // this._loaderService.exitLoader();
    }
  }

  updateSurveyCategories() {
    this._survey_categories = this._surveyAssessmentService._survey_categories;
    if (this._authService['_individualTasks']) {
      this._survey_categories.forEach(element => {
        for (let i = 0; i < this._authService['_individualTasks']['3_current'].length; i++) {
          if (this._authService['_individualTasks']['3_current'][i]['sSubModule'] === 'surveyAssessment' &&
            element['surveyAssessmentCategoryUID'] === this._authService['_individualTasks']['3_current'][i]['surveyAssessmentCategory_fkSurveyAssessmentCategoryUID']) {
            element['bCompulsory'] = 1;
          }
        }
      });
    }
  }

  toggleRecourse(recourse) {

    // if (recourse['showDetails']) {
    //   recourse['showDetails'] = false;
    // } else {
    //   recourse['showDetails'] = true;
    // }
    this.router.navigate(['/resources'], { replaceUrl: true });
  }

}
