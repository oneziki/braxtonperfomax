export interface IEmployee {
    name: string;
    cssClass: string;
    imageUrl: string;
    designation: string;
    subordinates: IEmployee[];
}
export declare class Employee implements IEmployee {
    name: string;
    cssClass: string;
    imageUrl: string;
    designation: string;
    subordinates: Employee[];
    manager?: Employee;
    constructor(orgStructure: string[], manager?: Employee);
}
