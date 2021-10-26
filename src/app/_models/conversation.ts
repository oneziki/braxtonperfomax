export class UserData {
  userManagers = [];
  userReportToEmployees = [];
  constructor () { }
}

export class Conversation {
  ConversationCategoryUID = '';
  sCategoryName = '';
  sSender_fkUserUUID = '';
  sReciever_fkUserUID = '';
  sSubject = '';
  ConversationSubjectsUID = '';
  constructor () { }
}


export class NewSubject {
  sSubject = '';
  sConversation = '';
  uploadedFiles = [];
  constructor () { }
}

export class Message {
  sSubject = '';
  sFirstName = '';
  dDateCreated = '';
  sConversation = '';
  sPosted = 'just now';
  ConversationSubjectsUID = '';
  uploadedFiles = [];
  constructor () { }
}


export class FileUpload {
  sFileName = '';
  sUrl = '';
  bShowDocument = 1;
  fileUuid = '';
  sDocumentUploadName = '';
  constructor () { }
}

export class ConversationFilterData {
  ConversationSubjectsUID = '';
  bFiltered = false;
  dFromDate = '';
  dToDate = '';
}

export class EditSubjectHeading {
  ConversationSubjectsUID = '';
  sSubject = '';
}

