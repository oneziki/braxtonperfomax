import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { AuthService, PrintToolService } from '../../_services/index';
import { PrintToolContent, PrintToolOptions } from './print-tool';

@Component({
  selector: 'app-print-tool',
  templateUrl: './print-tool.page.html',
  styleUrls: ['./print-tool.page.scss'],
  encapsulation: ViewEncapsulation.None
})


export class PrintToolPage implements OnDestroy {

  private _subPerformanceReviews: Subscription;
  private _subPerformanceAgreements: Subscription;
  private _subEsurveyAssessment: Subscription;
  private _subThreesixtyReport: Subscription;
  private _subSwotReport: Subscription;
  private _subPdpReport: Subscription;
  private _subIntegratedPdpReport: Subscription;
  private _subChooseQuestionnaireReport: Subscription;
  private _subSelfAssessmentReport: Subscription;
  private _subExpertiseReviewReport: Subscription;
  private _subRecruitmentReport: Subscription;
  private _subConversationReport: Subscription;
  private _contributionScorecardReport: Subscription;
  private _safetyMetricReport: Subscription;
  private _companyScorecardReport: Subscription;
  private _closeView: Subscription;
  private _personalPorfolioReport: Subscription;
  private _subExitInterviewReport: Subscription;

  private ngUnsubscribe: Subject<any> = new Subject<any>();

  public isPageVisible = false;
  public showBackButton = true;
  public printerLayout = String;
  public _printerOptions: PrintToolOptions = new PrintToolOptions();
  _footerDate = new Date();

  _coverData = {};
  _contentData: PrintToolContent = new PrintToolContent();

  constructor (public _authService: AuthService,
    private _printToolService: PrintToolService,
    private _router: Router) {

    this._closeView = this._printToolService._triggerClosingView.subscribe(() => this.ngOnDestroy());

    this._subPerformanceReviews = this._printToolService.
      _triggerPerformanceReviewsView.subscribe(() => this.viewPerformanceReviewsLayout());

    this._subPerformanceAgreements = this._printToolService.
      _triggerPerformanceAgreementsView.subscribe(() => this.viewPerformanceAgreementsLayout());

    this._subEsurveyAssessment = this._printToolService.
      _triggerEsurveyAssessmentView.subscribe(() => this.viewEsurveyAssessmentLayout());

    this._subThreesixtyReport = this._printToolService.
      _triggerThreesixtyReportView.subscribe(() => this.viewThreesixtyReportLayout());

    this._subSwotReport = this._printToolService.
      _triggerSwotReportView.subscribe(() => this.viewSwotReportLayout());

    this._subSwotReport = this._printToolService.
      _triggerPeriodSummaryReportView.subscribe(() => this.viewPeriodSummaryReportLayout());

    this._subPdpReport = this._printToolService.
      _triggerPDPReportView.subscribe(() => this.viewbPdpReportLayout());

    this._subIntegratedPdpReport = this._printToolService.
      _triggerIntegratedPDPReportView.subscribe(() => this.viewIntegratedPdpReportLayout());

    this._subChooseQuestionnaireReport = this._printToolService.
      _triggerChooseQuestionnaireReportView.subscribe(() => this.viewChooseQuestionnaireReportLayout());

    this._subSelfAssessmentReport = this._printToolService.
      _triggerSelfAssessmentReportView.subscribe(() => this.viewSelfAssessmentLayout());

    this._subExpertiseReviewReport = this._printToolService.
      _triggerExpertiseReviewReportView.subscribe(() => this.viewExpertiseReviewReportLayout());

    this._subConversationReport = this._printToolService.
      _triggerConversationFeedReportView.subscribe(() => this.viewConversationFeedLayout());

    this._contributionScorecardReport = this._printToolService.
      _triggerContributionScorecardView.subscribe(() => this.viewContributionScoreCardReport());

    this._companyScorecardReport = this._printToolService.
      _triggerCompanyScorecardView.subscribe(() => this.viewCompanyScoreCardReport());

    this._safetyMetricReport = this._printToolService.
      _triggerSafetyMetricView.subscribe(() => this.viewSafetyMetricReport());

    this._personalPorfolioReport = this._printToolService._triggerPersonalPortfolioView.subscribe(() => this.viewPersonalPorfolio());

    this._subExitInterviewReport = this._printToolService.
      _triggerExitInterviewReportView.subscribe(() => this.viewExitInterviewReportLayout());

    this._subRecruitmentReport = this._printToolService.
      _triggerRecruitmentReportView.subscribe(() => this.viewRecruitmentReportLayout());

  }


  ngOnDestroy(): void {
    document.body.classList.remove('ptViewer');
    this.isPageVisible = false;
  }

  //  PERFORMANCE REVIEW   // 
  viewPerformanceReviewsLayout() {
    this.showBackButton = false;
    // Set PDF Data
    this._printerOptions = this._printToolService['_printerOptions'] as PrintToolOptions;
    if (this._printerOptions && this._printerOptions['data']) {
      if (this._printerOptions['data'][0]) {
        this._contentData = this._printerOptions['data'][0];
      } else {
        this._contentData = this._printerOptions['data'];
      }
      this._contentData['bShowFullScreen'] = this._printerOptions['bShowFullScreen'];
    }

    this._coverData = {
      clientLogo: this._authService._sessionUser ? this._authService._sessionUser['companyPdfLogo'] : '',
      clientBanner: this._authService._sessionUser['pdfBackground'],
      coverTitle: 'Performance Review Results',
      coverSub: this._contentData['pdfData']['userPersonalDetails']['sEmployeeFullName']
    };

    this.isPageVisible = true;
    document.body.classList.add('ptViewer');
  }
  //

  //  PERFORMANCE AGREEMENT   //
  viewPerformanceAgreementsLayout() {
    this.showBackButton = false;
    // Set PDF Data
    this._printerOptions = this._printToolService['_printerOptions'] as PrintToolOptions;
    if (this._printerOptions && this._printerOptions['data']) {
      if (this._printerOptions['data'][0]) {
        this._contentData = this._printerOptions['data'][0];
      } else {
        this._contentData = this._printerOptions['data'];
      }
      this._contentData['bShowFullScreen'] = this._printerOptions['bShowFullScreen'];
    }
    // Set Cover Data
    this._coverData = {
      clientLogo: this._authService._sessionUser ? this._authService._sessionUser['companyPdfLogo'] : '',
      clientBanner: this._authService._sessionUser['pdfBackground'],
      coverTitle: 'Performance Agreement',
      coverSub: this._contentData['personalDetails']['sEmployeeName']
    };

    this.isPageVisible = true;
    document.body.classList.add('ptViewer');
  }
  //

  //  ESURVEY ASSESSMENT //
  viewEsurveyAssessmentLayout() {
    this._printerOptions = this._printToolService['_printerOptions'] as PrintToolOptions;

    // Look for MAIN title
    const mainTitle = this._printerOptions['data']['details']['sSurveyName'];
    // Look for SUB title
    const subTitle = this._printerOptions['data']['details']['sFirstName'] + ' ' + this._printerOptions['data']['details']['sLastName'];

    this._coverData = {
      clientLogo: this._authService._sessionUser ? this._authService._sessionUser['companyPdfLogo'] : '',
      clientBanner: this._authService._sessionUser['pdfBackground'],
      coverTitle: mainTitle,
      coverSub: subTitle
    };

    if (this._printerOptions && this._printerOptions['data']) {
      this._contentData = this._printerOptions['data'];
    }

    this.isPageVisible = true;
    document.body.classList.add('ptViewer');
  }
  //

  //  360 RESULTS  //
  viewThreesixtyReportLayout() {
    this.showBackButton = false;
    // Set PDF Data
    this._printerOptions = this._printToolService['_printerOptions'] as PrintToolOptions;
    if (this._printerOptions && this._printerOptions['data']) {
      if (this._printerOptions['data'][0]) {
        this._contentData = this._printerOptions['data'][0];
      } else {
        this._contentData = this._printerOptions['data'];
      }
      this._contentData['bShowFullScreen'] = this._printerOptions['bShowFullScreen'];
    }
    // Set Cover Data
    this._coverData = {
      clientLogo: this._authService._sessionUser ? this._authService._sessionUser['companyPdfLogo'] : '',
      clientBanner: this._authService._sessionUser['pdfBackground'],
      coverTitle: this._contentData['details'][0]['sAssessmentName'],
      coverSub: this._contentData['details'][0]['sAssesseeName']
    };

    this.isPageVisible = true;
    document.body.classList.add('ptViewer');
  }
  //

  //  EXIT INTERVIEW  //
  viewExitInterviewReportLayout() {
    this.showBackButton = false;

    // Set PDF Data
    this._printerOptions = this._printToolService['_printerOptions'] as PrintToolOptions;
    if (this._printerOptions && this._printerOptions['data']) {
      if (this._printerOptions['data'][0]) {
        this._contentData = this._printerOptions['data'][0];
      } else {
        this._contentData = this._printerOptions['data'];
      }
      this._contentData['bShowFullScreen'] = this._printerOptions['bShowFullScreen'];
    }
    // Set Cover Data

    this._coverData = {
      clientLogo: this._authService._sessionUser ? this._authService._sessionUser['companyPdfLogo'] : '',
      clientBanner: this._authService._sessionUser['pdfBackground'],
      coverTitle: this._contentData['details'][0]['sAssessmentName'],
      coverSub: this._contentData['details'][0]['sAssesseeName']
    };

    this.isPageVisible = true;
    document.body.classList.add('ptViewer');
  }
  //

  //  CHOOSE QUESTIONNAIRE  //
  viewChooseQuestionnaireReportLayout() {
    // Set PDF Data
    this.showBackButton = false;
    this._printerOptions = this._printToolService['_printerOptions'] as PrintToolOptions;
    if (this._printerOptions && this._printerOptions['data']) {
      if (this._printerOptions['data'][0]) {
        this._contentData = this._printerOptions['data'][0];
      } else {
        this._contentData = this._printerOptions['data'];
      }
    }

    // Set Cover Data
    this._coverData = {
      clientLogo: this._authService._sessionUser ? this._authService._sessionUser['companyPdfLogo'] : '',
      clientBanner: this._authService._sessionUser['pdfBackground'],
      coverTitle: this._contentData['sCoverTitle'],
      coverSub: this._contentData['sEmployeeFullName']
    };

    this.isPageVisible = true;
    document.body.classList.add('ptViewer');
  }
  //

  //  SWOT REPORT  //
  viewSwotReportLayout() {
    this.showBackButton = false;
    // Set PDF Data
    this._printerOptions = this._printToolService['_printerOptions'] as PrintToolOptions;
    if (this._printerOptions && this._printerOptions['data']) {
      if (this._printerOptions['data'][0]) {
        this._contentData = this._printerOptions['data'][0];
      } else {
        this._contentData = this._printerOptions['data'];
      }
    }
    // Set Cover Data
    this._coverData = {
      clientLogo: this._authService._sessionUser ? this._authService._sessionUser['companyPdfLogo'] : '',
      clientBanner: this._authService._sessionUser['pdfBackground'],
      coverTitle: 'SWOT Analysis',
      coverSub: this._contentData['PersonalDetails']['sEmployeeFullName']
    };

    this.isPageVisible = true;
    document.body.classList.add('ptViewer');
  }
  //

  //  PERIOD SUMMARY REPORT  //
  viewPeriodSummaryReportLayout() {
    this.showBackButton = false;
    // Set PDF Data
    this._printerOptions = this._printToolService['_printerOptions'] as PrintToolOptions;
    if (this._printerOptions && this._printerOptions['data']) {
      if (this._printerOptions['data'][0]) {
        this._contentData = this._printerOptions['data'][0];
      } else {
        this._contentData = this._printerOptions['data'];
      }
    }

    // Set Cover Data
    this._coverData = {
      clientLogo: this._authService._sessionUser ? this._authService._sessionUser['companyPdfLogo'] : '',
      clientBanner: this._authService._sessionUser['pdfBackground'],
      coverTitle: 'Period Summary',
      coverSub: this._contentData['personalDetails'][0]['sEmployeeFullName']
    };

    this.isPageVisible = true;
    document.body.classList.add('ptViewer');
  }
  //

  //  PDP REPORT  //
  viewbPdpReportLayout() {
    this.showBackButton = false;
    // Set PDF Data
    this._printerOptions = this._printToolService['_printerOptions'] as PrintToolOptions;
    if (this._printerOptions && this._printerOptions['data']) {
      if (this._printerOptions['data'][0]) {
        this._contentData = this._printerOptions['data'][0];
      } else {
        this._contentData = this._printerOptions['data'];
      }
    }

    // Set Cover Data
    this._coverData = {
      clientLogo: this._authService._sessionUser ? this._authService._sessionUser['companyPdfLogo'] : '',
      clientBanner: this._authService._sessionUser['pdfBackground'],
      coverTitle: 'Personal Development Plan',
      coverSub: this._contentData['personalDetails']['sEmployeeName']
    };

    this.isPageVisible = true;
    document.body.classList.add('ptViewer');
  }
  //

  //  INTEGRATED PDP REPORT  //
  viewIntegratedPdpReportLayout() {
    this.showBackButton = false;
    // Set PDF Data
    this._printerOptions = this._printToolService['_printerOptions'] as PrintToolOptions;
    if (this._printerOptions && this._printerOptions['data']) {
      if (this._printerOptions['data'][0]) {
        this._contentData = this._printerOptions['data'][0];
      } else {
        this._contentData = this._printerOptions['data'];
      }
    }

    // Set Cover Data
    this._coverData = {
      clientLogo: this._authService._sessionUser ? this._authService._sessionUser['companyPdfLogo'] : '',
      clientBanner: this._authService._sessionUser['pdfBackground'],
      coverTitle: 'Integrated Personal Development Plan',
      coverSub: this._contentData['personalDetails']['sEmployeeName']
    };

    this.isPageVisible = true;
    document.body.classList.add('ptViewer');
  }
  //

  //  SELF ASSESSMENT REPORT  //
  viewSelfAssessmentLayout() {
    // Set PDF Data
    let pdfLogo = '';
    let pdfBackground = '';
    this.showBackButton = false;

    if (typeof this._authService._sessionUser !== 'undefined') {
      pdfBackground = this._authService._sessionUser['pdfBackground'];
      pdfLogo = this._authService._sessionUser ? this._authService._sessionUser['companyPdfLogo'] : '';
    } else {
      // pdfBackground = this._authService._pdfBackground;
      // pdfLogo = this._authService._pdfLogo;
    }

    this._printerOptions = this._printToolService['_printerOptions'] as PrintToolOptions;
    if (this._printerOptions && this._printerOptions['data']) {
      if (this._printerOptions['data'][0]) {
        this._contentData = this._printerOptions['data'][0];
      } else {
        this._contentData = this._printerOptions['data'];
      }
    }
    // Set Cover Data
    this._coverData = {
      clientLogo: pdfLogo,
      clientBanner: pdfBackground,
      coverTitle: this._contentData['details'][0]['sAssessmentName'],
      coverSub: this._contentData['details'][0]['sAssesseeName']
    };

    this.isPageVisible = true;
    document.body.classList.add('ptViewer');
  }
  //

  //  EXPERTISE REVIEW REPORT  //
  viewExpertiseReviewReportLayout() {
    this.showBackButton = false;
    // Set PDF Data
    this._printerOptions = this._printToolService['_printerOptions'] as PrintToolOptions;
    if (this._printerOptions && this._printerOptions['data']) {
      if (this._printerOptions['data'][0]) {
        this._contentData = this._printerOptions['data'][0];
      } else {
        this._contentData = this._printerOptions['data'];
      }
      this._contentData['bShowFullScreen'] = this._printerOptions['bShowFullScreen'];
    }
    // Set Cover Data
    this._coverData = {
      clientLogo: this._authService._sessionUser ? this._authService._sessionUser['companyPdfLogo'] : '',
      clientBanner: this._authService._sessionUser['pdfBackground'],
      coverTitle: this._contentData['details']['sAssessmentName'],
      coverSub: this._contentData['details']['sAssesseeName']
    };
    this.isPageVisible = true;
    document.body.classList.add('ptViewer');
  }
  //

  //  COACH REPORT  //
  viewConversationFeedLayout() {
    this.showBackButton = false;
    // Set PDF Data
    this._printerOptions = this._printToolService['_printerOptions'] as PrintToolOptions;
    if (this._printerOptions && this._printerOptions['data']) {
      if (this._printerOptions['data'][0]) {
        this._contentData = this._printerOptions['data'][0];
      } else {
        this._contentData = this._printerOptions['data'];
      }
      this._contentData['bShowFullScreen'] = true;
    }
    // Set Cover Data
    this._coverData = {
      clientLogo: this._authService._sessionUser ? this._authService._sessionUser['companyPdfLogo'] : '',
      clientBanner: this._authService._sessionUser['pdfBackground'],
      coverTitle: this._contentData['sSubject'],
      coverSub: this._contentData['sCategoryName'] + ' Conversation Feed - ' + this._authService._sessionUser.sFirstname
    };

    this.isPageVisible = true;
    document.body.classList.add('ptViewer');

  }
  //

  //  CONTRIBUTION SCORECARD REPORT  //
  viewContributionScoreCardReport() {
    this.showBackButton = false;
    // Set PDF Data
    this._printerOptions = this._printToolService['_printerOptions'] as PrintToolOptions;
    if (this._printerOptions && this._printerOptions['data']) {
      if (this._printerOptions['data'][0]) {
        this._contentData = this._printerOptions['data'][0];
      } else {
        this._contentData = this._printerOptions['data'];
      }
      this._contentData['bShowFullScreen'] = this._printerOptions['bShowFullScreen'];
    }
    // Set Cover Data
    this._coverData = {
      clientLogo: this._authService._sessionUser ? this._authService._sessionUser['companyPdfLogo'] : '',
      clientBanner: this._authService._sessionUser['pdfBackground'],
      coverTitle: 'Monthly Scorecard',
      coverSub: ''
    };
    this.isPageVisible = true;
    document.body.classList.add('ptViewer');
  }
  // 

  //  COMPANY SCORECARD REPORT  //
  viewCompanyScoreCardReport() {
    this.showBackButton = false;
    // Set PDF Data
    this._printerOptions = this._printToolService['_printerOptions'] as PrintToolOptions;
    if (this._printerOptions && this._printerOptions['data']) {
      if (this._printerOptions['data'][0]) {
        this._contentData = this._printerOptions['data'][0];
      } else {
        this._contentData = this._printerOptions['data'];
      }
      this._contentData['bShowFullScreen'] = this._printerOptions['bShowFullScreen'];
    }
    // Set Cover Data
    this._coverData = {
      clientLogo: this._authService._sessionUser ? this._authService._sessionUser['companyPdfLogo'] : '',
      clientBanner: this._authService._sessionUser['pdfBackground'],
      coverTitle: 'Monthly Scorecard',
      coverSub: ''
    };
    this.isPageVisible = true;
    document.body.classList.add('ptViewer');
  }
  //

  //  SAFETY METRIC REPORT  //
  viewSafetyMetricReport() {
    this.showBackButton = false;
    // Set PDF Data
    this._printerOptions = this._printToolService['_printerOptions'] as PrintToolOptions;
    if (this._printerOptions && this._printerOptions['data']) {
      if (this._printerOptions['data'][0]) {
        this._contentData = this._printerOptions['data'][0];
      } else {
        this._contentData = this._printerOptions['data'];
      }
      this._contentData['bShowFullScreen'] = this._printerOptions['bShowFullScreen'];
    }
    // Set Cover Data
    this._coverData = {
      clientLogo: this._authService._sessionUser ? this._authService._sessionUser['companyPdfLogo'] : '',
      clientBanner: this._authService._sessionUser['pdfBackground'],
      coverTitle: 'Safety Metric',
      coverSub: ''
    };
    this.isPageVisible = true;
    document.body.classList.add('ptViewer');
  }
  //

  // PERSONAL PORTFOLIO //
  viewPersonalPorfolio() {
    this.showBackButton = false;
    // Set PDF Data
    this._printerOptions = this._printToolService['_printerOptions'] as PrintToolOptions;
    if (this._printerOptions && this._printerOptions['data']) {
      if (this._printerOptions['data'][0]) {
        this._contentData = this._printerOptions['data'][0];
      } else {
        this._contentData = this._printerOptions['data'];
      }
      this._contentData['bShowFullScreen'] = this._printerOptions['bShowFullScreen'];
    }
    // Set Cover Data
    this._coverData = {
      clientLogo: this._authService._sessionUser ? this._authService._sessionUser['companyPdfLogo'] : '',
      clientBanner: this._authService._sessionUser['pdfBackground'],
      coverTitle: 'Personal Portfolio',
      coverSub: ''
    };
    this.isPageVisible = true;
    document.body.classList.add('ptViewer');
  }
  //

  //  RECRUITMENT REPORT  //
  viewRecruitmentReportLayout() {
    this.showBackButton = false;
    // Set PDF Data
    this._printerOptions = this._printToolService['_printerOptions'] as PrintToolOptions;
    if (this._printerOptions && this._printerOptions['data']) {
      if (this._printerOptions['data'][0]) {
        this._contentData = this._printerOptions['data'][0];
      } else {
        this._contentData = this._printerOptions['data'];
      }
      this._contentData['bShowFullScreen'] = this._printerOptions['bShowFullScreen'];
    }
    // Set Cover Data
    this._coverData = {
      clientLogo: this._authService._sessionUser ? this._authService._sessionUser['companyPdfLogo'] : '',
      clientBanner: this._authService._sessionUser['pdfBackground'],
      coverTitle: this._contentData['details']['sAssessmentName'],
      coverSub: this._contentData['details']['sAssesseeName']
    };
    this.isPageVisible = true;
    document.body.classList.add('ptViewer');
  }
  //

  ptViewHide() {
    if (this._printerOptions['layout'] === 'ChooseQuestionnaireReport') {
      this._router.navigate(['choose'], { replaceUrl: true });
    }
    document.body.classList.remove('ptViewer');
    this.isPageVisible = false;
  }
}

