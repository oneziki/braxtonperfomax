export class IntergratedPdpCompetencies {
    public IntergratedPdpCompetenciesUID: string;
    public sIndicatorName: string;
    public sOutcomeName: string;
    public competencyHrURPOutomeUID: string;
    public competencyHrURPIndicatorUID: string;
    public fScoreValue: number;
    public iPriority: number;
    public sPriority: string;
    public sAcceptStatus: string;
    public dPeriodOfImprovementEnd: string;
    public comments: any[];
    constructor() { }
}

export class IntergratedPdpDevelopmentNeeds {
    public IntergratedPdpOwnDevelopementUID: string;
    public sDevelopmentPriority: string;
    public sDevelopmentActivity: string;
    public iPriority: number;
    public sPriority: string;
    public sAcceptStatus: string;
    public dPeriodOfImprovementEnd: string;
    public comments: any[];
    constructor() { }
}

export class IntergratedPDP {
    IntergratedPDPUID = '';
    bDraft = 1;
    userUUID = '';
    CompAssessmentUID = '';
    sShortTermGoals = '';
    sMediumTermGoals = '';
    sLongTermGoals = '';
    sManagerOverAllComment = '';
    sDateAdminSigned = '';
    pdpCompetencies = [];
    pdpDevelopmentNeeds = [];
    constructor() { }
}







