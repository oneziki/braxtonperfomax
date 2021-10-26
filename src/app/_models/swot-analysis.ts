export class SWOTAnalysisScales {

    constructor(public SWOTscaleUID: string,
                public sName: string,
                public iOrder: number
                ) {}
}

export class SWOTAnalysis {
    constructor(
                public compAssessmentUID: string,
                public sAssessee_fkUserUUID: string,
                public SWOT: SWOTArray[] = [],
                public userUUID: string,
                public sManualURPCompetency: string,
                public SWOTAnalysisObjectivesUID: string,
                public sSWOT3monthsObjectiveComment: string,
                public sSWOT6monthsObjectiveComment: string,
                public sSWOT12monthsObjectiveComment: string,
                public sSWOT2to3YearsObjectiveComment: string) {}
}


export class SWOTAnalysisManual {
    public userUUID: string;
    public SWOTAnalysisManualObjectivesUID: string;
    public sSWOT3monthsManualObjectiveComment: string;
    public sSWOT6monthsManualObjectiveComment: string;
    public sSWOT12monthsManualObjectiveComment: string;
    public sSWOT2to3YearsManualObjectiveComment: string;
    public iMonth: string;
    public iYear: string;
    public SWOT: SWOTArray[] = [];
    constructor() {}
}


export class SWOTArray {
    public SWOTAnalysisUID: string;
    public SWOTscaleUID: string;
    public ScaleName: string;
    public competencyHrURPCompetencyUID: string;
    public sCompetencyName: string;
    public sSWOTAnalysis: string;
    public Questions: any[];
    constructor() {}
}




