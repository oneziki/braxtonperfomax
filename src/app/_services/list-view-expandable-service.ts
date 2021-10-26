import { IService } from './IService';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ListViewExpandableService implements IService {

    constructor() { }

    getId = (): string => 'expandable';

    getTitle = (): string => 'Expandable';

    getAllThemes = (): Array<any> => {
        return [
            { 'url': 'expandable/0', 'title': 'Expandable', 'theme': 'layout1' }
        ];
    }
    
    //* Data Set for page 1
    getDataForLayout1 = (): any => {
        return {
            'toolbarTitle': 'Expandable',
            'items': [
                {
                    'id': 1,
                    'title': 'Followers',
                    'items': [
                        {
                            'id': 1,
                            'title': 'Alabama',
                            'avatar': 'assets/imgs/avatar/10.jpg',
                            'className': 'tertiary',
                            'text': 'Tertiary'
                        },
                        {
                            'id': 2,
                            'title': 'Paris',
                            'avatar': 'assets/imgs/avatar/11.jpg',
                            'className': 'secondary',
                            'text': 'Secondary'
                        },
                        {
                            'id': 3,
                            'title': 'Brooklyn',
                            'avatar': 'assets/imgs/avatar/12.jpg',
                            'className': 'primary',
                            'text': 'Primarye'
                        }
                    ]
                },
                {
                    'id': 2,
                    'title': 'Followers',
                    'items': [
                        {
                            'id': 1,
                            'title': 'Chelsea',
                            'avatar': 'assets/imgs/avatar/14.jpg',
                            'className': 'secondary',
                            'text': 'Secondary'
                        },
                        {
                            'id': 2,
                            'title': 'Florence',
                            'avatar': 'assets/imgs/avatar/15.jpg',
                            'className': 'primary',
                            'text': 'Primarye'
                        },
                        {
                            'id': 3,
                            'title': 'Ireland',
                            'avatar': 'assets/imgs/avatar/14.jpg',
                            'className': 'primary',
                            'text': 'Primarye'
                        },
                        {
                            'id': 4,
                            'title': 'Paris',
                            'avatar': 'assets/imgs/avatar/13.jpg',
                            'className': 'tertiary',
                            'text': 'Tertiary'
                        },
                        {
                            'id': 5,
                            'title': 'Alabama',
                            'avatar': 'assets/imgs/avatar/12.jpg',
                            'className': 'primary',
                            'text': 'Primarye'
                        },
                        {
                            'id': 6,
                            'title': 'Ireland',
                            'avatar': 'assets/imgs/avatar/11.jpg',
                            'className': 'secondary',
                            'text': 'Secondary'
                        }
                    ]
                },
                {
                    'id': 3,
                    'title': 'Discover users',
                    'items': [
                        {
                            'id': 1,
                            'title': 'Paris',
                            'avatar': 'assets/imgs/avatar/11.jpg',
                            'className': 'primary',
                            'text': 'Primary'
                        },
                        {
                            'id': 2,
                            'title': 'Chelsea',
                            'avatar': 'assets/imgs/avatar/12.jpg',
                            'className': 'secondary',
                            'text': 'Secondary'
                        },
                        {
                            'id': 3,
                            'title': 'Florence',
                            'avatar': 'assets/imgs/avatar/13.jpg',
                            'className': 'secondary',
                            'text': 'Secondary'
                        },
                        {
                            'id': 4,
                            'title': 'Ireland',
                            'avatar': 'assets/imgs/avatar/14.jpg',
                            'className': 'tertiary',
                            'text': 'Tertiary'
                        },
                        {
                            'id': 5,
                            'title': 'Brooklyn',
                            'className': 'tertiary',
                            'text': 'Tertiary'
                        }
                    ]
                },
                {
                    'id': 4,
                    'title': 'Discover users',
                    'items': [
                        {
                            'id': 1,
                            'title': 'Brooklyn',
                            'avatar': 'assets/imgs/avatar/0.jpg',
                            'className': 'secondary',
                            'text': 'Secondary'
                        },
                        {
                            'id': 2,
                            'title': 'Ireland',
                            'avatar': 'assets/imgs/avatar/1.jpg',
                            'className': 'primary',
                            'text': 'Primary'
                        },
                        {
                            'id': 3,
                            'title': 'Brooklyn',
                            'avatar': 'assets/imgs/avatar/2.jpg',
                            'className': 'secondary',
                            'text': 'Secondary'
                        },
                        {
                            'id': 4,
                            'title': 'Alabama',
                            'avatar': 'assets/imgs/avatar/3.jpg',
                            'className': 'primary',
                            'text': 'Primary'
                        }
                    ]
                },
                {
                    'id': 5,
                    'title': 'Followers',
                    'items': [
                        {
                            'id': 1,
                            'title': 'Alabama',
                            'avatar': 'assets/imgs/avatar/10.jpg',
                            'className': 'primary',
                            'text': 'Primary'
                        },
                        {
                            'id': 2,
                            'title': 'Paris',
                            'avatar': 'assets/imgs/avatar/11.jpg',
                            'className': 'tertiary',
                            'text': 'Tertiary'
                        },
                        {
                            'id': 3,
                            'title': 'Brooklyn',
                            'avatar': 'assets/imgs/avatar/12.jpg',
                            'className': 'tertiary',
                            'text': 'Tertiary'
                        }
                    ]
                },
                {
                    'id': 6,
                    'title': 'Discover users',
                    'items': [
                        {
                            'id': 1,
                            'title': 'Paris',
                            'avatar': 'assets/imgs/avatar/11.jpg',
                            'className': 'primary',
                            'text': 'Primary'
                        },
                        {
                            'id': 2,
                            'title': 'Chelsea',
                            'avatar': 'assets/imgs/avatar/12.jpg',
                            'className': 'tertiary',
                            'text': 'Tertiary'
                        },
                        {
                            'id': 3,
                            'title': 'Florence',
                            'avatar': 'assets/imgs/avatar/13.jpg',
                            'className': 'primary',
                            'text': 'Primary'
                        },
                        {
                            'id': 4,
                            'title': 'Ireland',
                            'avatar': 'assets/imgs/avatar/14.jpg',
                            'className': 'tertiary',
                            'text': 'Tertiary'
                        },
                        {
                            'id': 5,
                            'title': 'Brooklyn',
                            'avatar': 'assets/imgs/avatar/15.jpg',
                            'className': 'primary',
                            'text': 'Primary'
                        }
                    ]
                },
                {
                    'id': 7,
                    'title': 'Followers',
                    'items': [
                        {
                            'id': 1,
                            'title': 'Chelsea',
                            'avatar': 'assets/imgs/avatar/14.jpg',
                            'className': 'tertiary',
                            'text': 'Tertiary'
                        },
                        {
                            'id': 2,
                            'title': 'Florence',
                            'avatar': 'assets/imgs/avatar/15.jpg',
                            'className': 'secondary',
                            'text': 'Secondary'
                        },
                        {
                            'id': 3,
                            'title': 'Ireland',
                            'avatar': 'assets/imgs/avatar/14.jpg',
                            'className': 'secondary',
                            'text': 'Secondary'
                        },
                        {
                            'id': 4,
                            'title': 'Paris',
                            'avatar': 'assets/imgs/avatar/13.jpg',
                            'className': 'tertiary',
                            'text': 'Tertiary'
                        },
                        {
                            'id': 5,
                            'title': 'Alabama',
                            'avatar': 'assets/imgs/avatar/12.jpg',
                            'className': 'primary',
                            'text': 'Primary'
                        },
                        {
                            'id': 6,
                            'title': 'Ireland',
                            'avatar': 'assets/imgs/avatar/11.jpg',
                            'className': 'primary',
                            'text': 'Primary'
                        }
                    ]
                }
            ]
        };
    }

    load(): Observable<any> {
        return new Observable(observer => {
            observer.next(this.getDataForLayout1());
            observer.complete();
        });
    }
}
