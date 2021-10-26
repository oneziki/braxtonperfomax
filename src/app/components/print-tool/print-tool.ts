export class PrintToolOptions {
  data: any;
  bShowFullScreen: boolean = true;
  constructor () {
  }
}

export class PrintToolCover {
  data: object;
  constructor (data: object) {
    this.data = data;
  }
}

export class PrintToolContent {
  data: any;
  pdfData: any;
  personalDetails: any;
  PersonalDetails: any; // duplicate variable but needed
  details: any;
  bShowFullScreen: boolean = true;
  sCoverTitle: string = '';
  sEmployeeFullName: string = '';
  sSubject: string = '';
  sCategoryName: string = '';

  constructor () {
  }
}