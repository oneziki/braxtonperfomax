import { BucketListItem, Menugroup } from '../_models/index';

export class MyMaxTemplateMenu {
    uuid = ''; // this is MymaxTemplateMenuUID
    name = '';
    subTitle = '';
    sParentNodeUID = '';
    bShowDateFilters = 1;
    bShowBusinessFilters = 1;
    bShowSingleViewFilters = 1;
    bShowTrendViewFilters = 1;
    bShowOnlyTrendView = 0;
    bShowPDFPrinting = 1;
    bShowIndividualGraphPrinting = 1;
    bShowQualitativeFeedbackPrinting = 0;
    bShowExcelPrinting = 1;
    bShowMonthRangeFilters = 0;
    children: MyMaxTemplateMenu[] = [];
    hasChildren = true;
    expanded = true;
    menuComponents: BucketListItem[] = [];
    menuAllocations: Menugroup[] = [];
    totalPods = 0;
    mymaxTemplateUID = '';
    bManualDate = 0;
    sManualDate = '';
    bSectionHeading = 0;
    iNotifications = 0

    // Filter: Switching between the normal modal window and displaying links ['Default', 'Links']
    sFilterType = 'Default';
    sFilterDateNameType = 'SurveyDate';

    constructor () { }
}

export class MyMaxFilter {

    currentView = 'Single View';
    currentViewSection = 'summary';
    viewPrefix = 'ss_';

    iFromMonth = '';
    iFromYear = '';
    iToMonth = '';
    iToYear = '';

    businessId = '';
    filter1Id = '';
    filter1Name = '';
    filter2Id = '';
    filter2Name = '';
    filter3Id = '';
    filter3Name = '';
    filter4Id = '';
    filter4Name = '';
    filter5Id = '';
    filter5Name = '';

    // data containers
    businessids = [];
    filter1 = [];
    filter2 = [];
    filter3 = [];
    filter4 = [];
    filter5 = [];

    from_dates = [];
    to_dates = [];

    from_months = [];
    from_years = [];
    to_months = [];
    to_years = [];

    // survey containers
    surveyIds = [];
    surveyId = '';

    // selected component variables
    node_bShowDateFilters = 1;
    node_bShowBusinessFilters = 1;
    node_bShowOnlyTrendView = 0;
    node_bShowSingleViewFilters = 1;
    node_bShowTrendViewFilters = 1;
    node_bShowMonthRangeFilters = 1;
    node_uuid = '';
    node_templateUID = '';

    summary_stepThroughValue = '';
    detailed_stepThroughValue = '';

    // Lens Distribution Hide Month Filter
    ss_bHideMonthFilter = false;
    sd_bHideMonthFilter = false;
    ts_bHideMonthFilter = false;
    td_bHideMonthFilter = false;

    // Filter: Switching between the normal modal window and displaying links ['Default', 'Filter Parent', 'None', 'Filter Item']
    sFilterType = 'Default';
    sFilterParentUID = '';
    sFilterDateNameType = 'SurveyDate';

    bManualDate = 0;
    sManualDate = '';
    bSectionHeading = 0;
    sHeading = '';
    sSubHeading = '';
}
export class MyMaxTemplate {

    mymaxTemplateUID = '';
    sTemplateName = '';
    Company_fkCompanyUID = '';
    sTemplateOption = '';
    name = '';
    sTemplateType = '';
    sTemplateTile = '';
    bArchived = false;
    menus: MyMaxTemplateMenu[] = [];

    constructor () { }
}

