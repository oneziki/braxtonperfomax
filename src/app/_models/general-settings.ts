export class GeneralSettings {

                 organisationlbuuuid = '';
                 logicalbusinessunitname = '';
                 bShowPerspective = false;
                 bShowEmployeeNameOnPersonalTab= false;
                 bHideBusinessUnitObjective = false;
                 bShowKraDescription = false ;
                 bShowBudgetLine = false ;
                 bShowCRPs = false ;
                 sKraNameChange = '';
                 sKpiNameChange = '';
                 sKpiDescriptionNameChange = '';
                 sKpiBudgetLineNameChange = '';
                 sPerspectiveNameChange = '';
                 sBusinessUnitObjective = '';
                 sKpiCommentsNameChange = '';
                 sKpiTargetsNameChange = '';
                 sKpiActualNameChange = '';
                 sKpiKeyResultsNameChange = '';

                // PerformanceReview
                 bShowPreliminaryResults = false;
                 bShowWeightingsOnReview = false;
                 bEmployeeCompleteKraReviews = false;
                 bAllowExternalAssessors = false;
                 bKraManagerCommentsCompulsory = false;
                 bLockModeration = false;
                 iReportDecimals = 0;
                 iKraExternalAssessors = 0;
                 sEmployeeReviewMonths = '';
                 sShowOverallScoreAsPercentage = '';
                 sModerationMonths = '';
                 sEmployeeInviteOthersInst = '';
                 sManagerKraReviewInst = '';
                 sEmployeeKraReviewInst = '';
                 sSecondManagerKraReviewInst = '';
                 sModerateKraReviewInst = '';
                // PerformanceAgreement
                 bLockAgreementEndDate = false ;
                 bManagerLockAgreementDates = false ;
                 iAgreementEndDayDate   = 0;
                 iAgreementEndMonthDate = 0;
                 iMinimumTotalKras  = 0;
                 iMaximumTotalKras  = 0;
                 bAllowLimitedKraProfileTotals = false ;
                 bShowWeightingsOnAgreement = false ;
                 bKraManagerContractCommentsCompulsory = false;
                 sEmployeeGeneralAgreementInst = '';
                 sManagerGeneralAgreementInst = '';
                 sSecondManagerGeneralAgreementInst = '';


                 bShowKRAAgreementInstructions = false;
                 bShowKRAMidYearReviewInstructions = false;
                 bShowPDPInstructions = false;
                 bShowKRAReviewInstructions = false;
                 bShowSWOTanalysisInstructions = false;
                 sScaleNameChange = '';
                // PDP
                sPDPDevelopmentNeedChange = '';
                sPDPCategoryChange = '';
                sPDPActivitiesChange = '';
                sPDPActivityDescriptionChange = '';
                sPDPDueDateChange = '';
                sPDPPriorityChange = '';
                sPDPEmployeeStatusChange = '';
                sPDPManagerStatusChange = '';
                sPDPEmployeeCommentsChange = '';
                sPDPManagerCommentsChange = '';
                sEmployeePDPInst = '';
                sManagerPDPInst  = '';
                sEmployeePDPTab = '';
                sManagerPDPTab = '';
                bShowLearningLibraryOnPDP = false ;
                bShowDevelopmentNeedOnPDP = false ;
                bShowPDP = false ;
                bMakePDPMandatory = false ;
                legendItems: Legend [] = [];
                constructor() {}
}

export class Legend {
    KraOrgScaleLegendUID = '';
    sOrgScaleLegend = '';
    fLegendFrom = 0;
    fLegendTo = 0;
    sColor = '';
    iOrder = 0;

}   
    

