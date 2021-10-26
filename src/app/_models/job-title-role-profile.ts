export class JobTitleRoleProfile {

    JobTitleRoleUID = '';
    sJobTitleRoleName = '';
    JobTitleUUID = '';
    sJobTitleDescription = '';
    ReportToJobTitleUUID = '';
    sReportToJobTitleName= '';
    sReportIntoJobTitleName= '';
    ReportIntoJobTitleUUID = '';
    FoundationJobTitleRoleUUID = '';
    sFoundationJobTitleName= '';
    PotentialJobTitleRoleUUID = '';
    sPotentialJobTitleJobTitleName='';
    OrganisationTiersUUID = '';
    sOrganisationTierName = '';
    CompetencyHrPLIBRoleUID = '';
    KraHrPLIBRoleUID = '';
    sKraRoleName= '';
    sJobTitlePurpose = '';
    sJobResponsibilities = '';
    sJobKnowledgeAndSkills = '';
    sJobEssentialExperience = '';
    sLocation = '';
    sLevel= '';
    iRevision = 0;
    sWorkingConditions= '';
    sPhysicalRequirements='';
    sRegulatoryRequirements='';
    sMinimumTime= '';
    qualifications : JobTitleRoleQualifications []=[];
    skillsAndKnowledgeDimensions : RoleProfileSkillsAndKnowledgeDimension []=[];
    experience : RoleProfileExperience []= [];
    constructor() { }
}

export class JobTitleRoleQualifications {
    JobTitleRoleQualificationsUID = '';
    JobTitleRole_fkJobTitleRoleUID = '';
    sQualificationName ='';
    bEssential = false
}

export class RoleProfileExperience {
    JobTitleRoleExperienceUID = '';
    JobTitleRole_fkJobTitleRoleUID = '';
    sExperienceName ='';
    AssessmentScales_fkAssessmentScalesUUID ='';
    fBenchMark = 0;
}

export class RoleProfileSkillsAndKnowledgeDimension {
    sSkillsKnowledgeDimensionName = '';
    sSkillsKnowledgeDimensionUID = '';
    JobTitleRole_fkJobTitleRoleUID = '';
    AssessmentScales_fkAssessmentScalesUUID = '';
    skillsAndKnowledgeIndicator: RoleProfileSkillsAndKnowledgeIndicator []=[];
}

export class RoleProfileSkillsAndKnowledgeIndicator {
    sSkillsKnowledgeIndicatorName = '';
    sSkillsKnowledgeIndicatorUID = '';
    fBenchMark = 0;
    skillsAndKnowledgeDimension_fkSkillsKnowledgeDimensionUID = '';
   
}



