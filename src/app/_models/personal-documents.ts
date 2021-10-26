export class PersonalDocumentsCategories {
    ResourcesCategoryUID = '';
    sResourcesCategoryName = '';
    resourceDescription = '';
    sIconName = '';
    iOrder = '';
    userDocuments : PersonalDocuments[]=[];
    constructor() { }
}

export class PersonalDocuments {
    UserPersonalDocumentUID = '';
    UserUID = '';
    Uploadedby_fkiUserUID = '';
    sDocumentUploadName = '';
    sDescription = '';
    sDocumentPath= ''
    bShowDocumentOnPortal = true;
    iOrder= 0;
    sResourcesCategoryName = '';
    constructor() { }
}