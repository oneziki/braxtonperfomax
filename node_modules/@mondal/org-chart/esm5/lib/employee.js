/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
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
var Employee = /** @class */ (function () {
    function Employee(orgStructure, manager) {
        var _this = this;
        this.manager = manager;
        var _a = tslib_1.__read(orgStructure), name = _a[0], reports = _a.slice(1);
        this.name = name.split('(')[0].trim();
        /** @type {?} */
        var desigMatch = name.match(/\(([^)]+)\)/);
        this.designation = desigMatch && desigMatch[1].trim();
        this.subordinates = reports.map((/**
         * @param {?} r
         * @return {?}
         */
        function (r) { return r.substring(1); }))
            .reduce((/**
         * @param {?} previous
         * @param {?} current
         * @return {?}
         */
        function (previous, current) {
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
        function (r) { return new Employee(r, _this); }));
    }
    return Employee;
}());
export { Employee };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1wbG95ZWUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbW9uZGFsL29yZy1jaGFydC8iLCJzb3VyY2VzIjpbImxpYi9lbXBsb3llZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLCtCQU1DOzs7SUFMQyx5QkFBYTs7SUFDYiw2QkFBaUI7O0lBQ2pCLDZCQUFpQjs7SUFDakIsZ0NBQW9COztJQUNwQixpQ0FBMEI7O0FBRzVCO0lBT0Usa0JBQVksWUFBc0IsRUFBRSxPQUFrQjtRQUF0RCxpQkFrQkM7UUFqQkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDakIsSUFBQSxpQ0FBaUMsRUFBaEMsWUFBSSxFQUFFLHFCQUEwQjtRQUN2QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7O1lBQ2hDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQztRQUM1QyxJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFdEQsSUFBSSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsR0FBRzs7OztRQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBZCxDQUFjLEVBQUM7YUFDakQsTUFBTTs7Ozs7UUFBQyxVQUFDLFFBQVEsRUFBRSxPQUFPO1lBQ3hCLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUM1QixRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQ25CO1lBRUQsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRTVDLE9BQU8sUUFBUSxDQUFDO1FBQ2xCLENBQUMsR0FBRSxtQkFBQSxFQUFFLEVBQWMsQ0FBQzthQUNuQixHQUFHOzs7O1FBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxJQUFJLFFBQVEsQ0FBQyxDQUFDLEVBQUUsS0FBSSxDQUFDLEVBQXJCLENBQXFCLEVBQUMsQ0FBQztJQUNyQyxDQUFDO0lBQ0gsZUFBQztBQUFELENBQUMsQUExQkQsSUEwQkM7Ozs7SUF6QkMsd0JBQWE7O0lBQ2IsNEJBQWlCOztJQUNqQiw0QkFBaUI7O0lBQ2pCLCtCQUFvQjs7SUFDcEIsZ0NBQXlCOztJQUN6QiwyQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgaW50ZXJmYWNlIElFbXBsb3llZSB7XG4gIG5hbWU6IHN0cmluZztcbiAgY3NzQ2xhc3M6IHN0cmluZztcbiAgaW1hZ2VVcmw6IHN0cmluZztcbiAgZGVzaWduYXRpb246IHN0cmluZztcbiAgc3Vib3JkaW5hdGVzOiBJRW1wbG95ZWVbXTtcbn1cblxuZXhwb3J0IGNsYXNzIEVtcGxveWVlIGltcGxlbWVudHMgSUVtcGxveWVlIHtcbiAgbmFtZTogc3RyaW5nO1xuICBjc3NDbGFzczogc3RyaW5nO1xuICBpbWFnZVVybDogc3RyaW5nO1xuICBkZXNpZ25hdGlvbjogc3RyaW5nO1xuICBzdWJvcmRpbmF0ZXM6IEVtcGxveWVlW107XG4gIG1hbmFnZXI/OiBFbXBsb3llZTtcbiAgY29uc3RydWN0b3Iob3JnU3RydWN0dXJlOiBzdHJpbmdbXSwgbWFuYWdlcj86IEVtcGxveWVlKSB7XG4gICAgdGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcbiAgICBjb25zdCBbbmFtZSwgLi4ucmVwb3J0c10gPSBvcmdTdHJ1Y3R1cmU7XG4gICAgdGhpcy5uYW1lID0gbmFtZS5zcGxpdCgnKCcpWzBdLnRyaW0oKTtcbiAgICBjb25zdCBkZXNpZ01hdGNoID0gbmFtZS5tYXRjaCgvXFwoKFteKV0rKVxcKS8pO1xuICAgIHRoaXMuZGVzaWduYXRpb24gPSBkZXNpZ01hdGNoICYmIGRlc2lnTWF0Y2hbMV0udHJpbSgpO1xuXG4gICAgdGhpcy5zdWJvcmRpbmF0ZXMgPSByZXBvcnRzLm1hcChyID0+IHIuc3Vic3RyaW5nKDEpKVxuICAgICAgLnJlZHVjZSgocHJldmlvdXMsIGN1cnJlbnQpID0+IHtcbiAgICAgICAgaWYgKCFjdXJyZW50LnN0YXJ0c1dpdGgoJyAnKSkge1xuICAgICAgICAgIHByZXZpb3VzLnB1c2goW10pO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJldmlvdXNbcHJldmlvdXMubGVuZ3RoIC0gMV0ucHVzaChjdXJyZW50KTtcblxuICAgICAgICByZXR1cm4gcHJldmlvdXM7XG4gICAgICB9LCBbXSBhcyBzdHJpbmdbXVtdKVxuICAgICAgLm1hcChyID0+IG5ldyBFbXBsb3llZShyLCB0aGlzKSk7XG4gIH1cbn1cbiJdfQ==