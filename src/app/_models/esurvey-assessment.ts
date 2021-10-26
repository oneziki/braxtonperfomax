export class EsurveyAssessment {

    pkiSurveyID = '';
    sSurveyName = '';
    sModuleType = '';
    fkiSurveyTypeId = '';
    sSurveyTypeName = '';
    fkiUserID = '';

    // SETUP PROPS -- START
    questions: EsurveyAssessmentQuestions[] = [];
    lenses: EsurveyAssessmentLense[] = [];

    dimensions: EsurveyAssessmentDimension[] = [];  // group dimensions and their questions
    feedBackCategories = []; // heading, dimension, linked questions
    dimensionHeadings = []; // heading, linked dimensions, linked questions
    bIncludeDimensionGrouping = false;

    fBenchMark = '';
    bShowBenchMark = false;

    bEnableRestrictedRecords = false;
    bGroupDimensions = false;
    bDisplayOverallResultsAgainstDepartmentResult = false;
    bDisplayParticipantsPerQuestion = false;
    bReplaceDimensionsWithPageBreaks = false;
    // SETUP PROPS -- END

    constructor() {}
}

export class EsurveyAssessmentLense {

    pkiLenseId = '';
    sLenseName = '';
    lenseOptions: EsurveyAssessmentLenseOption[] = [];

    constructor() {}
}

export class EsurveyAssessmentLenseOption {

    pkiLenseOptionId = '';
    sOptionValue = '';
    questions: EsurveyAssessmentQuestions[] = [];

    constructor() {}
}

export class EsurveyAssessmentQuestions {

    pkiSurveyQuestionId = '';
    sSurveyQuestionText = '';
    iOrder = 0;
    isSelected = 0;

    constructor() {}
}

export class EsurveyAssessmentDimension {

    pkiDimensionStructureId = '';
    sDimensionStructureName = '';
    questions: EsurveyAssessmentQuestions[] = [];
    isSelected = 0;

    constructor() {}
}


export class EsurveyQuestionnaire {

    constructor(public pkiSurveyID: string,
                public title: string,
                public pages: any[],
                public data: object,
                public Esurvey_userUID: string,
                public fkiSurveyTypeId: string,
                public sConclusion: string,
                public bAssessmentCompleted,
                public bIncludeReport,
                public surveyCategoryUID: string,
                public bAssessmentClosed,
                public sCategoryName: string ) {}
}

