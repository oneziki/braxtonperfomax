export class ChooseQuestionnaire {
    UserChooseQuestionnaireUID: string;
    userUUID: '';
    sEmployeeFullName: '';
    sEmployeeInitials: '';
    sJobTitleName: '';
    sInterests: '';
    sLengthOfService: '';
    sImmediateTermRole: '';
    sImmediateTermRoleUID: '';
    sShortTermRole: '';
    sShortTermRoleUID: '';
    sLongTermRole: '';
    sLongTermRoleUID: '';
    bIsComplete: 0;
    displayDateUserCompleted: '';
    displayTimeUserCompleted: '';
    sCoverTitle: '';
    languages: LanguagePreference[] = [];
    experience: Experience[] = [];
    mobilities: Mobility[] = [];
    constructor() { }
}

export class Experience {
    sDepartmentName = '';
    sMonths = '';
    constructor() { }
}

export class Mobility {
    MobilityUID = '';
    sMobilityName = '';
    MobilityCategoriesUID = '';
    sCategoryName = '';
    constructor() { }
}

export class LanguagePreference {
    ChooseQuestionnaireLanguageUID = '';
    sLanguage = '';
    sConversing = '';
    sReading = '';
    sWriting = '';
    constructor() { }
}


