export class ExitInterviewAssessmentAssessee {

    public exitInterviewAssessmentUID: string;
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
    constructor() { }
}

export class ExitInterviewAssessmentAssessors {

    constructor(
        public exitInterviewAssessmentUID: string,
        public assesseeUUID: string,
        public sAssessorEmail: string,
        public sAssessorFullName: string) { }
}

export class ExitInterviewAssessment {

    public exitInterviewAssessmentUID = '';
    public sAssessmentName = '';
    public bIsComplete = false;
    public bCompulsory = false;
    public dDateCompleted = '';
    public sAssessorInternal_fkUserUUID = '';
    public sAssessorTypeDescription = '';
    public exitInterviewAssessmentAssessorsUID = '';
    public sDescription = '';


    constructor() { }
}

export class ExitInterviewAssessmentQuestionnaire {

    constructor(public exitInterviewAssessmentUID: string,
        public exitInterviewAssessmentAssessorsUID: string,
        public title: string,
        public pages: any[]) { }
}

// SETUP CLASSES

