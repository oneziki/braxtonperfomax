export class Task {

    constructor(public arrears: any[] = [],
                public current: any[] = [],
                public upcoming: any[] = [],
                public draft: any[] = [],
                public approveInvites: any[] = [],
                public provideFeedback: any[] = [],
                public completed: any[] = [],
                public optional: any[] = [],
                public totalTasks: number = 0
    ) {}
}
