export class ThreeSixtyAssessee {

    public compAssessmentUID: string;
    public assesseeUUID: string;
    public assessorUUID: string;
    public sFirstName: string;
    public sLastName: string;
    public sAssesseeFullName: string;
    public sInverseTypeDescription: string;
    public compAssessorTypeUID: string;
    public bShowAssessorType: string;
    public sAssessmentName: string;
    public dDateCompleted: string;
    public initials: string;
    public bIsDraft: boolean;
    constructor() {}
}

export class ThreeSixtyAssessors {

    constructor(public CompAssessmentInvitesUID: string,
                public compAssessmentUID: string,
                public assesseeUUID: string,
                public sAssessorEmail: string,
                public sAssessorFullName: string,
                public sApprovalStatus: string) {}
}

export class ThreeSixtyAssessment {

    public compAssessmentUID = '';
    public sAssessmentName = '';
    public sMonthName = '';
    public bIsComplete = false;
    public bCompulsory = false;
    public dDateCompleted = '';
    public sAssessorInternal_fkUserUUID = '';
    public sAssessorTypeDescription = '';
    public compAssessmentAssessorsUID = '';
    public sDescription = '';

    // SETUP PROPS -- START
    public bIncludeAssessment = false;
    public bEnableRestrictedRecords = false;
    public bShowBenchMark = false;
    public fBenchMark = '';
    public restrictedRecords: ThreeSixtyRestrictedRecords[] = [];
    // SETUP PROPS -- END

    constructor( ) {}
}

export class ThreeSixtyQuestionnaire {

    constructor(public compAssessmentUID: string,
                public compAssessmentAssessorsUID: string,
                public title: string,
                public pages: any[]) {}
}

// SETUP CLASSES
export class ThreeSixtyRestrictedRecords {

    public compAssessorTypeUID = '';
    public sAssessorTypeDescription = '';
    public iRestrictedRecord = 0;
    constructor( ) {}
}

