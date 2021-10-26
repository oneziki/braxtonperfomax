export class RecruitmentAssessee {

    public RecruitmentAssessorUID: string;
    public JobTitleRoleUID: string;
    public assesseeUUID: string;
    public assessorUUID: string;
    public sFirstName: string;
    public sLastName: string;
    public sAssesseeFullName: string;
    public sApplicantFullName: string;
    public compAssessorTypeUID: string;
    public sInverseTypeDescription: string;
    public recruitmentAssessorTypeUID: string;
    public bShowAssessorType: string;
    public sAssessmentName: string;
    public dDateCompleted: string;
    public initials: string;
    public profilePhoto: string;
    public bIsDraft: boolean;
    constructor() { }
}

export class RecruitmentAssessmentAssessors {

    constructor(public RecruitmentAssessmentInvitesUID: string,
        public RecruitmentAssessmentUID: string,
        public assesseeUUID: string,
        public sAssessorEmail: string,
        public sAssessorFullName: string,
        public sApprovalStatus: string) { }
}

export class RecruitmentAssessment {
    public SkillsAssessmentUID: string;
    public compAssessorTypeUID: string;
    public sAssessorTypeDescription: string;
    public bIsComplete: boolean;
    public jobTitleUUID: string;
    public JobTitleRoleUID: string;
    public dDateCompleted: string;
    public sAssessorInternal_fkUserUUID: string;
    public sAssessmentName: string;
    public RecruitmentAssessorUID: string;
    constructor() { }
}

export class RecruitmentQuestionnaire {

    constructor(public compAssessmentUID: string,
        public JobTitleRoleUID: string,
        public skillsAssessmentUID: string,
        public compAssessorTypeUID: string,
        public assessorUUID: string,
        public title: string,
        public pages: any[]) { }
}

// SETUP CLASSES

