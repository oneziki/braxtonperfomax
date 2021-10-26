export class Company {

    CompanyUID = '';
    sCompanyName = '';

    constructor() { }
}

export class CompanyProduct {

    companyProductUID = '';
    bDisplay = true;
    iOrder = 1;
    Company_fkCompanyUID = '';
    MyMaxProductUID = '';
    sName = '';
    components = [];

    constructor() { }
}

export class EsurveyClient {

    pkiClientId = 0;
    sClientName = '';

    constructor() { }
}

export class PeformaxClient {

    lbuID = '';
    lbuName = '';

    constructor() { }
}
