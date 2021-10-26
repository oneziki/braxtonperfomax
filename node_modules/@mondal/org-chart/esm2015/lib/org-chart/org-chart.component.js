/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
export class OrgChartComponent {
    constructor() {
        this.hasManager = false;
        this.direction = 'vertical';
        this.itemClick = new EventEmitter();
    }
    /**
     * @return {?}
     */
    get hostClass() {
        return this.direction === 'vertical' ? 'column' : '';
    }
}
OrgChartComponent.decorators = [
    { type: Component, args: [{
                selector: 'mui-org-chart',
                template: "<mui-employee *ngIf=\"topEmployee\" ngClass=\"mui-oc-{{direction}}\" [employee]=\"topEmployee\" [hasManager]=\"hasManager\"\n  [direction]=\"direction\" (itemClick)=\"itemClick.emit($event)\">\n</mui-employee>\n<div *ngIf=\"topEmployee?.subordinates?.length\" ngClass=\"mui-oc-reports-{{direction}}\" class=\"mui-oc-reports\">\n  <ng-container *ngFor=\"let employee of topEmployee?.subordinates; first as isFirst; last as isLast\">\n    <div ngClass=\"mui-oc-org-container-{{direction}}\" class=\"mui-oc-org-container\">\n      <div ngClass=\"mui-oc-connector-container-{{direction}}\" class=\"mui-oc-connector-container\">\n        <div class=\"mui-oc-connector mui-oc-border\" [style.border-color]=\"isFirst?'transparent':''\"></div>\n        <div class=\"mui-oc-border\"></div>\n        <div class=\"mui-oc-connector mui-oc-border\" [style.border-color]=\"isLast?'transparent':''\"></div>\n      </div>\n      <mui-org-chart [topEmployee]=\"employee\" [hasManager]=\"true\" [direction]=\"direction\"\n        (itemClick)=\"itemClick.emit($event)\">\n      </mui-org-chart>\n    </div>\n  </ng-container>\n</div>",
                styles: [":host{display:flex;align-items:center;flex:1}.mui-oc-vertical{flex-direction:column}.mui-oc-org-container{display:flex}.mui-oc-org-container-vertical{flex-direction:column}.mui-oc-connector{flex:1}.mui-oc-connector-container{display:flex}.mui-oc-connector-container-horizontal{flex-direction:column}.mui-oc-reports{display:flex;flex:1}.mui-oc-reports-horizontal{flex-direction:column}"]
            }] }
];
OrgChartComponent.propDecorators = {
    topEmployee: [{ type: Input }],
    hasManager: [{ type: Input }],
    direction: [{ type: Input }],
    itemClick: [{ type: Output }],
    hostClass: [{ type: HostBinding, args: ['style.flex-direction',] }]
};
if (false) {
    /** @type {?} */
    OrgChartComponent.prototype.topEmployee;
    /** @type {?} */
    OrgChartComponent.prototype.hasManager;
    /** @type {?} */
    OrgChartComponent.prototype.direction;
    /** @type {?} */
    OrgChartComponent.prototype.itemClick;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JnLWNoYXJ0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Btb25kYWwvb3JnLWNoYXJ0LyIsInNvdXJjZXMiOlsibGliL29yZy1jaGFydC9vcmctY2hhcnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQVNwRixNQUFNLE9BQU8saUJBQWlCO0lBTDlCO1FBT1csZUFBVSxHQUFHLEtBQUssQ0FBQztRQUNuQixjQUFTLEdBQThCLFVBQVUsQ0FBQztRQUVqRCxjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQWEsQ0FBQztJQU10RCxDQUFDOzs7O0lBSkMsSUFDSSxTQUFTO1FBQ1gsT0FBTyxJQUFJLENBQUMsU0FBUyxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDdkQsQ0FBQzs7O1lBZkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxlQUFlO2dCQUN6QixzbUNBQXlDOzthQUUxQzs7OzBCQUVFLEtBQUs7eUJBQ0wsS0FBSzt3QkFDTCxLQUFLO3dCQUVMLE1BQU07d0JBRU4sV0FBVyxTQUFDLHNCQUFzQjs7OztJQU5uQyx3Q0FBZ0M7O0lBQ2hDLHVDQUE0Qjs7SUFDNUIsc0NBQTJEOztJQUUzRCxzQ0FBb0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSG9zdEJpbmRpbmcsIElucHV0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgSUVtcGxveWVlIH0gZnJvbSAnLi4vZW1wbG95ZWUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtdWktb3JnLWNoYXJ0JyxcbiAgdGVtcGxhdGVVcmw6ICcuL29yZy1jaGFydC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL29yZy1jaGFydC5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIE9yZ0NoYXJ0Q29tcG9uZW50IHtcbiAgQElucHV0KCkgdG9wRW1wbG95ZWU6IElFbXBsb3llZTtcbiAgQElucHV0KCkgaGFzTWFuYWdlciA9IGZhbHNlO1xuICBASW5wdXQoKSBkaXJlY3Rpb246ICd2ZXJ0aWNhbCcgfCAnaG9yaXpvbnRhbCcgPSAndmVydGljYWwnO1xuXG4gIEBPdXRwdXQoKSBpdGVtQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPElFbXBsb3llZT4oKTtcblxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLmZsZXgtZGlyZWN0aW9uJylcbiAgZ2V0IGhvc3RDbGFzcygpIHtcbiAgICByZXR1cm4gdGhpcy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcgPyAnY29sdW1uJyA6ICcnO1xuICB9XG59XG4iXX0=