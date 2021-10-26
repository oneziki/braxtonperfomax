export class KraReview {
  constructor(public sScoringYear: string,
    public sScoringMonth: string,
    public sFullName: string,
    public sEmail1: string,
    public performanceAgreement: object) { }
}

export class DiscussionNotes {
  sCommentBy_fkUserUID = '';
  kraHrURPRoleUID = '';
  sComment = '';
  dDateDiscussion = {
    year: 0,
    month: 0,
    day: 0
  };
  selectedDateCreated = '';
  portalUserDocumentUploadsUUID = '';
  sStrengths = '';
  sImprovements = '';
  sGoals = '';
  sRating = '';
  yearNumber = '';
  monthNumber = '';
  constructor() { }
}


export class DiscussionRating {
  KraHrURPRoleDiscussionRatingUID = '';
  kraHrURPRoleUID = '';
  PerformanceDiscussionScaleUID = '';
  PerformanceAccuracyScaleUID = '';
  bShowPerformanceDiscussionRating = 0;
  constructor() { }
}
