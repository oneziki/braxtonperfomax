export class SurveyAssessment {

    constructor(public surveyCategoryUID: string,
                public sCategoryName: string,
                public sProduct: string,
                public sAssessorInternal_fkUserUUID: string,
                public iYear: string,
                public iMonth: string,
                public sStatus: string,
                public bCompulsory: boolean,
                // Esurvey Specific
                public pkiSurveyID: string,
                public sSurveyName: string,
                public fkiSurveyTypeId: string,
                public statusDate: string,
                public sSurveyTypeName: string,
                public fkiUserID: string,
                // three-sixty
                public compAssessmentUID: string,
                public sAssessmentName: string,

                public totalCompleted: number
            ) {}
}

export class SurveyAssessmentAssessee {

    constructor(
               public SurveyHrURPRoleUID: string,
               public assesseeUID: string,
               public dDateCreated: string,
               public sAssesseeName: string,
               public sSurveyRoleName: string,
               public surveyCategoryUID: string,
               public months: any[],
               public totalMonths: number
           ) {}

}

export class SurveyAssessmentQuestionnaire {

    constructor(public compAssessmentUID: string,
                public compAssessmentAssessorsUID: string,
                public assesseeUID: string,
                public sAssesseeName: string,
                public SurveyAssessorTypeUID: string,
                public SurveyHrURPRoleUID: string,
                public sAssessorInternal_fkUserUUID: string,
                public surveyCategoryUID: string,
                public iMonth: string,
                public sMonth: string,
                public iYear: string,
                public sPeriod: string,
                public title: string,
                public pages: any[],
                public data: object,
                public bCompulsory: boolean) {}
}

export class SurveyAssessmentAssessorDetails {

        surveyAssessorTypeUID = '';
        surveyHrURPRoleUID = '';
        assesseeUID = '';
        surveyAssessmentAssessorsUID = '';
        sAssessorInternal_fkUserUUID = '';
        constructor() {}
}

export class SurveyAssessmentDetails {
        surveyHrURPRoleUID = '';
        surveyHrPLIBRoleUID = '';
        surveyAssessmentAssessorsUID = '';
        constructor() {}
}

export class CompletedSurveyAssessments {
        assesseeUID = '';
        assessorUID = '';
        surveyAssessorTypeUID = '';
        surveyHrURPRoleUID = '';
    constructor() {}
}

export class AllUserSurveyAssessments {
    sSurveyRoleName = '';
    sAssessee_fkUserUUID = '';
    surveyAssessorType_fkSurveyAssessorTypeUID = '';
    SurveyHrURPRoleUID = '';
    dDateNormalUserSigned = '';
    bIsComplete = 0;
constructor() {}
}

export class SurveyDetails {
    bCompulsory = 0;
    iTotalInvitations = 0;
    UserInvitedList = [];
    surveyAssessmentAssessorsUID = '';
}

export class SurveyEmployeeInviteData {
    EmployeeList = [];
    AssessorTypes = [];
    surveyDetails = [new SurveyDetails()];
}

