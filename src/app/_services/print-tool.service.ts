import { Injectable, EventEmitter } from '@angular/core';
import { EventManager } from '@angular/platform-browser';


@Injectable()
export class PrintToolService {

  _printerChanged = new EventEmitter();
  _triggerAdminGeneric = new EventEmitter();
  _triggerPerformanceReviews = new EventEmitter();
  _triggerPerformanceReviewsView = new EventEmitter();
  _triggerPerformanceAgreements = new EventEmitter();
  _triggerPerformanceAgreementsView = new EventEmitter();
  _triggerEsurveyAssessment = new EventEmitter();
  _triggerEsurveyAssessmentView = new EventEmitter();
  _triggerThreesixtyReport = new EventEmitter();
  _triggerThreesixtyReportView = new EventEmitter();
  _triggerChooseQuestionnaireReport = new EventEmitter();
  _triggerChooseQuestionnaireReportView = new EventEmitter();
  _triggerSwotReport = new EventEmitter();
  _triggerSwotReportView = new EventEmitter();
  _triggerPeriodSummaryReport = new EventEmitter();
  _triggerPeriodSummaryReportView = new EventEmitter();
  _triggerPDPReport = new EventEmitter();
  _triggerPDPReportView = new EventEmitter();
  _triggerIntegratedPDPReport = new EventEmitter();
  _triggerIntegratedPDPReportView = new EventEmitter();
  _triggerExpertiseReviewReport = new EventEmitter();
  _triggerExpertiseReviewReportView = new EventEmitter();
  _triggerSelfAssessmentReportView = new EventEmitter();
  _triggerSelfAssessmentReport = new EventEmitter();
  _triggerClosingView = new EventEmitter();

  _triggerConversationFeedReportView = new EventEmitter();

  _triggerContributionScorecardView = new EventEmitter();
  _triggerCompanyScorecardView = new EventEmitter();
  _triggerSafetyMetricView = new EventEmitter();

  _triggerPersonalPortfolioView = new EventEmitter();

  _triggerExitInterviewReportView = new EventEmitter();
  _triggerExitInterviewReport = new EventEmitter();

  _triggerRecruitmentReportView = new EventEmitter();
  _triggerRecruitmentReport = new EventEmitter();

  _debugger = false;
  _printerOptions = {};

  constructor () { }

  //////////////////
  // PRINTER ///////
  //////////////////

  closePrintView() {
    this._triggerClosingView.emit();
  }

  initPrintAdminGeneric(data) {
    this._printerOptions['layout'] = 'AdminGeneric';
    this._printerOptions['data'] = data;
    this._triggerAdminGeneric.emit();
    if (this._debugger) {
      console.log('~ initPrintAdminGeneric:: ', this._printerOptions['layout'], this._printerOptions['data']);
    }
  }

  initPerformanceReviewsLayout(data) {
    this._printerOptions['layout'] = 'PerformanceReviews';
    this._printerOptions['data'] = data;
    this._triggerPerformanceReviews.emit();
    if (this._debugger) {
      console.log('~ initPerformanceReviewsLayout:: ', this._printerOptions['layout'], this._printerOptions['data']);
    }
  }

  initPerformanceReviewsView(data: object, bShowFullScreen: boolean) {
    this._printerOptions['layout'] = 'PerformanceReviews';
    this._printerOptions['data'] = data;
    this._printerOptions['bShowFullScreen'] = bShowFullScreen;
    this._triggerPerformanceReviewsView.emit();
    if (this._debugger) {
      console.log('~ initPerformanceReviewsView:: ', this._printerOptions['layout'], this._printerOptions['data']);
    }
  }

  initPerformanceAgreementsLayout(data) {
    this._printerOptions['layout'] = 'PerformanceAgreements';
    this._printerOptions['data'] = data;
    this._triggerPerformanceAgreements.emit();
    if (this._debugger) {
      console.log('~ initPerformanceAgreementsLayout:: ', this._printerOptions['layout'], this._printerOptions['data']);
    }
  }

  initPerformanceAgreementsView(data: object, bShowFullScreen: boolean) {
    this._printerOptions['layout'] = 'PerformanceAgreements';
    this._printerOptions['data'] = data;
    this._printerOptions['bShowFullScreen'] = bShowFullScreen;
    this._triggerPerformanceAgreementsView.emit();
    if (this._debugger) {
      console.log('~ initPerformanceAgreementsView:: ', this._printerOptions['layout'], this._printerOptions['data']);
    }
  }

  initPrintEsurveyAssessmentReport(data) {
    this._printerOptions['layout'] = 'EsurveyAssessment';
    this._printerOptions['data'] = data;
    this._triggerEsurveyAssessment.emit();
    if (this._debugger) {
      console.log('~ initPrintEsurveyAssessmentReport:: ', this._printerOptions['layout'], this._printerOptions['data']);
    }
  }

  initPrintEsurveyAssessmentReportView(data) {
    this._printerOptions['layout'] = 'EsurveyAssessment';
    this._printerOptions['data'] = data;
    this._triggerEsurveyAssessmentView.emit();
    if (this._debugger) {
      console.log('~ initPrintEsurveyAssessmentReportView:: ', this._printerOptions['layout'], this._printerOptions['data']);
    }
  }

  initPrintThreesixtyReport(data) {
    this._printerOptions['layout'] = 'ThreesixtyReport';
    this._printerOptions['data'] = data;
    this._triggerThreesixtyReport.emit();
    if (this._debugger) {
      console.log('~ initPrintThreesixtyReport:: ', this._printerOptions['layout'], this._printerOptions['data']);
    }
  }

  initPrintThreesixtyReportView(data: object, bShowFullScreen: boolean) {
    this._printerOptions['layout'] = 'ThreesixtyReport';
    this._printerOptions['data'] = data;
    this._printerOptions['bShowFullScreen'] = bShowFullScreen;
    this._triggerThreesixtyReportView.emit();
    if (this._debugger) {
      console.log('~ initPrintThreesixtyReportView:: ', this._printerOptions['layout'], this._printerOptions['data']);
    }
  }

  initPrintChooseQuestionnaireReportView(data: object) {
    this._printerOptions['layout'] = 'ChooseQuestionnaireReport';
    this._printerOptions['data'] = data;
    this._triggerChooseQuestionnaireReportView.emit();
    if (this._debugger) {
      console.log('~ initPrintChooseQuestionnaireReportView:: ', this._printerOptions['layout'], this._printerOptions['data']);
    }
  }

  initPrintSWOTReport(data) {
    this._printerOptions['layout'] = 'SwotReport';
    this._printerOptions['data'] = data;
    this._triggerSwotReport.emit();
    if (this._debugger) {
      console.log('~ initPrintSWOTReport:: ', this._printerOptions['layout'], this._printerOptions['data']);
    }
  }

  initPrintSWOTReportView(data) {
    this._printerOptions['layout'] = 'SwotReport';
    this._printerOptions['data'] = data;
    this._triggerSwotReportView.emit();
    if (this._debugger) {
      console.log('~ initPrintSWOTReportView:: ', this._printerOptions['layout'], this._printerOptions['data']);
    }
  }

  initPrintContributionScorecardReportView(data: object, bShowFullScreen: boolean) {
    this._printerOptions['layout'] = 'ContributionScorecard';
    this._printerOptions['data'] = data;
    this._printerOptions['bShowFullScreen'] = bShowFullScreen;
    this._triggerContributionScorecardView.emit();
    if (this._debugger) {
      console.log('~ initPrintContributionScorecardReportView:: ', this._printerOptions['layout'], this._printerOptions['data']);
    }
  }

  initPrintCompanyScorecardReportView(data: object, bShowFullScreen: boolean) {
    this._printerOptions['layout'] = 'CompanyScorecard';
    this._printerOptions['data'] = data;
    this._printerOptions['bShowFullScreen'] = bShowFullScreen;
    this._triggerCompanyScorecardView.emit();
    if (this._debugger) {
      console.log('~ initPrintCompanyScorecardReportView:: ', this._printerOptions['layout'], this._printerOptions['data']);
    }
  }

  initPrintSafetyMetricReportView(data: object, bShowFullScreen: boolean) {
    this._printerOptions['layout'] = 'SafetyMetric';
    this._printerOptions['data'] = data;
    this._printerOptions['bShowFullScreen'] = bShowFullScreen;
    this._triggerSafetyMetricView.emit();
    if (this._debugger) {
      console.log('~ initPrintSafetyMetricReportView:: ', this._printerOptions['layout'], this._printerOptions['data']);
    }
  }

  initPrintPeriodSummaryReport(data) {
    this._printerOptions['layout'] = 'PeriodSummary';
    this._printerOptions['data'] = data;
    this._triggerPeriodSummaryReport.emit();
    if (this._debugger) {
      console.log('~ initPrintPeriodSummaryReport:: ', this._printerOptions['layout'], this._printerOptions['data']);
    }
  }

  initPrintPeriodSummaryReportView(data: object, bShowFullScreen: boolean) {
    this._printerOptions['layout'] = 'PeriodSummary';
    this._printerOptions['data'] = data;
    this._printerOptions['bShowFullScreen'] = bShowFullScreen;
    this._triggerPeriodSummaryReportView.emit();
    if (this._debugger) {
      console.log('~ initPrintPeriodSummaryReportView:: ', this._printerOptions['layout'], this._printerOptions['data']);
    }
  }

  initPrintPDPReport(data) {
    this._printerOptions['layout'] = 'PDP';
    this._printerOptions['data'] = data;
    this._triggerPDPReport.emit();
    if (this._debugger) {
      console.log('~ initPrintPDPReportView:: ', this._printerOptions['layout'], this._printerOptions['data']);
    }
  }

  initPrintPDPReportView(data) {
    this._printerOptions['layout'] = 'PDP';
    this._printerOptions['data'] = data;
    this._triggerPDPReportView.emit();
    if (this._debugger) {
      console.log('~ initPrinPDPReport:: ', this._printerOptions['layout'], this._printerOptions['data']);
    }
  }

  initPrintIntegratedPDPReport(data) {
    this._printerOptions['layout'] = 'IntegratedPDP';
    this._printerOptions['data'] = data;
    this._triggerIntegratedPDPReport.emit();
    if (this._debugger) {
      console.log('~ initPrintIntegratedPDPReportView:: ', this._printerOptions['layout'], this._printerOptions['data']);
    }
  }

  initPrintIntegratedPDPReportView(data) {
    this._printerOptions['layout'] = 'IntegratedPDP';
    this._printerOptions['data'] = data;
    this._triggerIntegratedPDPReportView.emit();
    if (this._debugger) {
      console.log('~ initPrintIntegratedPDPReport:: ', this._printerOptions['layout'], this._printerOptions['data']);
    }
  }

  initPrintSelfAssessmentReportView(data) {
    this._printerOptions['layout'] = 'SelfAssessmentReportView';
    this._printerOptions['data'] = data;
    this._triggerSelfAssessmentReportView.emit();
    if (this._debugger) {
      console.log('~ initPrintSelfAssessmentReportView:: ', this._printerOptions['layout'], this._printerOptions['data']);
    }
  }

  initPrintExpertiseReviewReport(data) {
    this._printerOptions['layout'] = 'ExpertiseReviewReport';
    this._printerOptions['data'] = data;
    this._triggerExpertiseReviewReport.emit();
    if (this._debugger) {
      console.log('~ initPrintExpertiseReviewReport:: ', this._printerOptions['layout'], this._printerOptions['data']);
    }
  }

  initPrintExitInterviewReport(data) {
    this._printerOptions['layout'] = 'ExitInterviewReport';
    this._printerOptions['data'] = data;
    this._triggerExitInterviewReport.emit();
    if (this._debugger) {
      console.log('~ initPrintExitInterviewReport:: ', this._printerOptions['layout'], this._printerOptions['data']);
    }
  }

  initPrintExpertiseReviewReportView(data: object, bShowFullScreen: boolean) {
    this._printerOptions['layout'] = 'ExpertiseReviewReport';
    this._printerOptions['data'] = data;
    this._printerOptions['bShowFullScreen'] = bShowFullScreen;
    this._triggerExpertiseReviewReportView.emit();
    if (this._debugger) {
      console.log('~ initPrintExpertiseReviewReportView:: ', this._printerOptions['layout'], this._printerOptions['data']);
    }
  }

  initViewConversationFeedReportView(data) {
    this._printerOptions['layout'] = 'ConversationFeed';
    this._printerOptions['data'] = data;
    this._triggerConversationFeedReportView.emit();
    if (this._debugger) {
      console.log('~ initViewConversationFeedReportView:: ', this._printerOptions['layout'], this._printerOptions['data']);
    }
  }

  initPrintPersonalPortfolioReportView(data: object, bShowFullScreen: boolean) {
    this._printerOptions['layout'] = 'PersonalPortfolio';
    this._printerOptions['data'] = data;
    this._printerOptions['bShowFullScreen'] = bShowFullScreen;
    this._triggerPersonalPortfolioView.emit();
    if (this._debugger) {
      console.log('~ initPrintPersonalPortfolioReportView:: ', this._printerOptions['layout'], this._printerOptions['data']);
    }
  }

  initPrintExitInterviewReportView(data: object, bShowFullScreen: boolean) {
    this._printerOptions['layout'] = 'ExitInterviewReport';
    this._printerOptions['data'] = data;
    this._printerOptions['bShowFullScreen'] = bShowFullScreen;
    this._triggerExitInterviewReportView.emit();
    if (this._debugger) {
      console.log('~ initPrintExitInterviewReportView:: ', this._printerOptions['layout'], this._printerOptions['data']);
    }
  }


  initPrintRecruitmentReport(data) {
    this._printerOptions['layout'] = 'RecruitmentReport';
    this._printerOptions['data'] = data;
    this._triggerRecruitmentReport.emit();
    if (this._debugger) {
      console.log('~ initPrintRecruitmentReport:: ', this._printerOptions['layout'], this._printerOptions['data']);
    }
  }

  initPrintRecruitmentReportView(data: object, bShowFullScreen: boolean) {
    this._printerOptions['layout'] = 'RecruitmentReport';
    this._printerOptions['data'] = data;
    this._printerOptions['bShowFullScreen'] = bShowFullScreen;
    this._triggerRecruitmentReportView.emit();
    if (this._debugger) {
      console.log('~ initPrintRecruitmentReportView:: ', this._printerOptions['layout'], this._printerOptions['data']);
    }
  }

}
