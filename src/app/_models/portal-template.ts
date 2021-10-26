export class PortalTemplate {
    portalSetupTemplateUID = '';
    sName = '';
    sDescription = '';
    sCompanyColor = '';
    bLogoImage = '';
    bBackgroundImage = '';
    sPersonalTabName = '';
    sTeamTabName = '';
    sOverdueStatusName = '';
    sOverdueStatusColor = '';
    bShowOverdueStatus = true;
    sDraftStatusName = '';
    sDraftStatusColor = '';
    bShowDraftStatus = true;
    sToCompleteName = '';
    sToCompleteColor = '';
    bShowToCompleteStatus = true;
    sComingUpName = '';
    sComingUpColor = '';
    bShowComingUpStatus = true;
    sCompletedName = '';
    sCompletedColor = '';
    bShowCompletedStatus = true;
    sApproveStatusName = '';
    sApproveStatusColor = '';
    bShowFeedbackStatus = true;
    sFeedbackStatusName = '';
    sFeedbackStatusColor = '';
    bShowApproveStatus = true;
    sEmployeeDirectoryName = '';
    sOptionalStatusName = '';
    sOptionalStatusColor = '';
    bShowOptionalStatus = true;
    sInformation = '';
    linkedMenuGroups = [];
    linkedTiles = [];

    bShowResourcesLink = true;
    bShowMyMaxLink = true;
    bShowSupportLink = true;
    bShowEmployeeDirectory = true;
    bHasMenuGroups = true;
    bShowHomePageLink = true;
    bShowPerformLink = true;
    bShowBanner = true;
    bShowNotifications = true;
    bShowClock = true;
    bShowActivitySummary = true;
    bShowPortalMenu = true;
    bShowKraViewSwitch = true;
    bShowProfilePage = true;
    bShowKraContractPeriodOnStatusPage = false;
    bShowAppStoreLink = true;
    bShowPDPLink = true;
    bShowPersonalDocuments = true;
    constructor() {}
}

export class PortalTemplateTile {

    portalTemplateTileUID = '';
    sName = '';
    sDescription = '';
    sDisplayDescription = '';
    sLearnMoreName = '';
    sLearnMoreInformation = '';
    sIconName = '';
    sIconColor = '';
    bDisplay = '';
    bActive = '';
    iOrder = 0;
    portalSetupTemplate_fkPortalSetupTemplateUID = '';
    linkedPortalName = '';
    linkedCategories = [];
    linkedCategoryNames = '';
    linkedCategoryUIDs = '';

    constructor() {}
}


