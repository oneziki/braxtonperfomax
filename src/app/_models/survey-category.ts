import { SurveyAssessment } from './index';

export class SurveyCategory {

    constructor(public surveyCategoryUID: string,
                public sCategoryName: string,
                public sIntroduction: string,
                public sConclusion: string,
                public isAllocated: number,
                public sDescription: string,
                public bCompulsory: boolean,
                public compulsory: SurveyAssessment[] = [],
                public optional: SurveyAssessment[] = []
            ) {}
}
