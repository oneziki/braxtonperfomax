export interface IEmployee {
     name: string;
     cssClass: string;
     imageUrl: string;
     designation: string;
     subordinates: IEmployee[];
}

export class Organogram implements IEmployee {
     name: string;
     cssClass: string;
     imageUrl: string;
     designation: string;
     subordinates: IEmployee[];
     // constructor() { }
}


