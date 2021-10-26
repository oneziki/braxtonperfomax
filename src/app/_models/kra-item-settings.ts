export class KraItemSettings {
       constructor( public sScoringYear: string,
                    public sScoringMonth: string,
                    public sAgreementYears: string,
                    public performanceAgreement: object,
                    public kraURPData: object,
                    public crps: Array<object>,
                    public perspectives: Array<object>,
                    public businessObjectives: Array<object>,
                    public selectViewKras: Array<object>,
                    public employeeEmailDetails: object,
                    public companyFAQ: Array<object>
                ) {}

}
