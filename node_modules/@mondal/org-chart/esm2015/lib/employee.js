/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
export function IEmployee() { }
if (false) {
    /** @type {?} */
    IEmployee.prototype.name;
    /** @type {?} */
    IEmployee.prototype.cssClass;
    /** @type {?} */
    IEmployee.prototype.imageUrl;
    /** @type {?} */
    IEmployee.prototype.designation;
    /** @type {?} */
    IEmployee.prototype.subordinates;
}
export class Employee {
    /**
     * @param {?} orgStructure
     * @param {?=} manager
     */
    constructor(orgStructure, manager) {
        this.manager = manager;
        const [name, ...reports] = orgStructure;
        this.name = name.split('(')[0].trim();
        /** @type {?} */
        const desigMatch = name.match(/\(([^)]+)\)/);
        this.designation = desigMatch && desigMatch[1].trim();
        this.subordinates = reports.map((/**
         * @param {?} r
         * @return {?}
         */
        r => r.substring(1)))
            .reduce((/**
         * @param {?} previous
         * @param {?} current
         * @return {?}
         */
        (previous, current) => {
            if (!current.startsWith(' ')) {
                previous.push([]);
            }
            previous[previous.length - 1].push(current);
            return previous;
        }), (/** @type {?} */ ([])))
            .map((/**
         * @param {?} r
         * @return {?}
         */
        r => new Employee(r, this)));
    }
}
if (false) {
    /** @type {?} */
    Employee.prototype.name;
    /** @type {?} */
    Employee.prototype.cssClass;
    /** @type {?} */
    Employee.prototype.imageUrl;
    /** @type {?} */
    Employee.prototype.designation;
    /** @type {?} */
    Employee.prototype.subordinates;
    /** @type {?} */
    Employee.prototype.manager;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1wbG95ZWUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbW9uZGFsL29yZy1jaGFydC8iLCJzb3VyY2VzIjpbImxpYi9lbXBsb3llZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUEsK0JBTUM7OztJQUxDLHlCQUFhOztJQUNiLDZCQUFpQjs7SUFDakIsNkJBQWlCOztJQUNqQixnQ0FBb0I7O0lBQ3BCLGlDQUEwQjs7QUFHNUIsTUFBTSxPQUFPLFFBQVE7Ozs7O0lBT25CLFlBQVksWUFBc0IsRUFBRSxPQUFrQjtRQUNwRCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztjQUNqQixDQUFDLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxHQUFHLFlBQVk7UUFDdkMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDOztjQUNoQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUM7UUFDNUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRXRELElBQUksQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLEdBQUc7Ozs7UUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUM7YUFDakQsTUFBTTs7Ozs7UUFBQyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsRUFBRTtZQUM1QixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDNUIsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUNuQjtZQUVELFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUU1QyxPQUFPLFFBQVEsQ0FBQztRQUNsQixDQUFDLEdBQUUsbUJBQUEsRUFBRSxFQUFjLENBQUM7YUFDbkIsR0FBRzs7OztRQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFDLENBQUM7SUFDckMsQ0FBQztDQUNGOzs7SUF6QkMsd0JBQWE7O0lBQ2IsNEJBQWlCOztJQUNqQiw0QkFBaUI7O0lBQ2pCLCtCQUFvQjs7SUFDcEIsZ0NBQXlCOztJQUN6QiwyQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgaW50ZXJmYWNlIElFbXBsb3llZSB7XG4gIG5hbWU6IHN0cmluZztcbiAgY3NzQ2xhc3M6IHN0cmluZztcbiAgaW1hZ2VVcmw6IHN0cmluZztcbiAgZGVzaWduYXRpb246IHN0cmluZztcbiAgc3Vib3JkaW5hdGVzOiBJRW1wbG95ZWVbXTtcbn1cblxuZXhwb3J0IGNsYXNzIEVtcGxveWVlIGltcGxlbWVudHMgSUVtcGxveWVlIHtcbiAgbmFtZTogc3RyaW5nO1xuICBjc3NDbGFzczogc3RyaW5nO1xuICBpbWFnZVVybDogc3RyaW5nO1xuICBkZXNpZ25hdGlvbjogc3RyaW5nO1xuICBzdWJvcmRpbmF0ZXM6IEVtcGxveWVlW107XG4gIG1hbmFnZXI/OiBFbXBsb3llZTtcbiAgY29uc3RydWN0b3Iob3JnU3RydWN0dXJlOiBzdHJpbmdbXSwgbWFuYWdlcj86IEVtcGxveWVlKSB7XG4gICAgdGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcbiAgICBjb25zdCBbbmFtZSwgLi4ucmVwb3J0c10gPSBvcmdTdHJ1Y3R1cmU7XG4gICAgdGhpcy5uYW1lID0gbmFtZS5zcGxpdCgnKCcpWzBdLnRyaW0oKTtcbiAgICBjb25zdCBkZXNpZ01hdGNoID0gbmFtZS5tYXRjaCgvXFwoKFteKV0rKVxcKS8pO1xuICAgIHRoaXMuZGVzaWduYXRpb24gPSBkZXNpZ01hdGNoICYmIGRlc2lnTWF0Y2hbMV0udHJpbSgpO1xuXG4gICAgdGhpcy5zdWJvcmRpbmF0ZXMgPSByZXBvcnRzLm1hcChyID0+IHIuc3Vic3RyaW5nKDEpKVxuICAgICAgLnJlZHVjZSgocHJldmlvdXMsIGN1cnJlbnQpID0+IHtcbiAgICAgICAgaWYgKCFjdXJyZW50LnN0YXJ0c1dpdGgoJyAnKSkge1xuICAgICAgICAgIHByZXZpb3VzLnB1c2goW10pO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJldmlvdXNbcHJldmlvdXMubGVuZ3RoIC0gMV0ucHVzaChjdXJyZW50KTtcblxuICAgICAgICByZXR1cm4gcHJldmlvdXM7XG4gICAgICB9LCBbXSBhcyBzdHJpbmdbXVtdKVxuICAgICAgLm1hcChyID0+IG5ldyBFbXBsb3llZShyLCB0aGlzKSk7XG4gIH1cbn1cbiJdfQ==