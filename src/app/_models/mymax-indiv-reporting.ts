import { Menugroup } from './index';

export class MyMaxIndivReportingMenu {
    uuid = ''; // this is mymaxIndividualTemplateUID
    name = '';
    subTitle = '';
    bShowMenuItem = 0;
    bShowYearFilter = 1;
    bShowMonthFilter = 1;
    bShowEmployeeFilter = 0;
    bShowAssessmentFilter = 1;
    iOrder = 0;
    children: MyMaxIndivReportingMenu[] = [];
    hasChildren = true;
    expanded = true;
    menuAllocations: Menugroup[] = [];
    sIcon = '';
    sState = '';
    sMain_state = '';
    mymaxIndividualTemplateUID = '';

    constructor() { }
}
