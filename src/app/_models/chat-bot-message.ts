export class KnowledgeBaseCategories {
  KnowledgeBaseCategoriesUID = '';
  sCategoryName = '';
  bDisplay = 1;
  bArchived = 0;
  categoryQuestions = [];
  constructor() { }
}

export class ChatBotMessage {
  SupportMessageUID = '';
  sMessage = '';
  sFirstName = '';
  dDateCreated = '';
  sSender_fkUserUUID = '';
  sReciever_fkUserUID = '00000000-0000-0000-0000000000000000';
  uploadedFiles = [];
  SupportMessageSubjectUID = '';
  sPosted = '';
  sSenderType = '';
  constructor() { }
}