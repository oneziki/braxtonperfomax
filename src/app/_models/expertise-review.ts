export class ExpertiseReviewAssessee {

    public SkillsAssessmentUID: string;
    public assesseeUUID: string;
    public assessorUUID: string;
    public sFirstName: string;
    public sLastName: string;
    public sAssesseeFullName: string;
    public sInverseTypeDescription: string;
    public skillsAssessorTypeUID: string;
    public bShowAssessorType: string;
    public sAssessmentName: string;
    public dDateCompleted: string;
    public initials: string;
    public bIsDraft: boolean;
    constructor() { }
}

export class ExpertiseReviewAssessors {

    constructor(public CompAssessmentInvitesUID: string,
        public compAssessmentUID: string,
        public assesseeUUID: string,
        public sAssessorEmail: string,
        public sAssessorFullName: string,
        public sApprovalStatus: string) { }
}

export class ExpertiseReview {

    public SkillsAssessmentUID = '';
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
    // SETUP PROPS -- END

    constructor() { }
}

export class ExpertiseReviewQuestionnaire {

    constructor(public skillsAssessmentUID: string,
        public skillsAssessmentAssessorsUID: string,
        public title: string,
        public pages: any[]) { }
}

// SETUP CLASSES

