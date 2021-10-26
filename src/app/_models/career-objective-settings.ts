// Maybe add this with all the KRA settings into one model

// Career Objectives
export class CareerObjectivesSettings {
    careerPlanUID = '';
    goals: CareerObjectives[] = [];
    sComments = '';
    sManagerComments = '';
    s2ndManagerComments = '';
    sImmediateObjectives = '';
    sMediumObjectives = '';
    sMediumObjectives2 = '';
    sLongTermObjectives = '';
    sRelevancy = '';
    sOppertunities = '';
    sAgreement = '';
    bRelocate = '';
    sAnotherCountry = '' ;
    sCountryName = '';
    constructor() {}
}

export class CareerObjectives {
    careerPlanGoalsUID = '';
    comments: CareerObjectivesComments[] = [];
    dDateTimelines = '';
    formatedDateTimelines = {};
    sActivities = '';
    sCareerGoal = '';
    sAcceptStatus = '';
    constructor() {}
}

export class CareerObjectivesComments {
    sComment = '';
    constructor() {}
}
