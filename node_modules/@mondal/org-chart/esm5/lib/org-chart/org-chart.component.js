/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
var OrgChartComponent = /** @class */ (function () {
    function OrgChartComponent() {
        this.hasManager = false;
        this.direction = 'vertical';
        this.itemClick = new EventEmitter();
    }
    Object.defineProperty(OrgChartComponent.prototype, "hostClass", {
        get: /**
         * @return {?}
         */
        function () {
            return this.direction === 'vertical' ? 'column' : '';
        },
        enumerable: true,
        configurable: true
    });
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
    return OrgChartComponent;
}());
export { OrgChartComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JnLWNoYXJ0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Btb25kYWwvb3JnLWNoYXJ0LyIsInNvdXJjZXMiOlsibGliL29yZy1jaGFydC9vcmctY2hhcnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUlwRjtJQUFBO1FBT1csZUFBVSxHQUFHLEtBQUssQ0FBQztRQUNuQixjQUFTLEdBQThCLFVBQVUsQ0FBQztRQUVqRCxjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQWEsQ0FBQztJQU10RCxDQUFDO0lBSkMsc0JBQ0ksd0NBQVM7Ozs7UUFEYjtZQUVFLE9BQU8sSUFBSSxDQUFDLFNBQVMsS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ3ZELENBQUM7OztPQUFBOztnQkFmRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLGVBQWU7b0JBQ3pCLHNtQ0FBeUM7O2lCQUUxQzs7OzhCQUVFLEtBQUs7NkJBQ0wsS0FBSzs0QkFDTCxLQUFLOzRCQUVMLE1BQU07NEJBRU4sV0FBVyxTQUFDLHNCQUFzQjs7SUFJckMsd0JBQUM7Q0FBQSxBQWhCRCxJQWdCQztTQVhZLGlCQUFpQjs7O0lBQzVCLHdDQUFnQzs7SUFDaEMsdUNBQTRCOztJQUM1QixzQ0FBMkQ7O0lBRTNELHNDQUFvRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBIb3N0QmluZGluZywgSW5wdXQsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBJRW1wbG95ZWUgfSBmcm9tICcuLi9lbXBsb3llZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ211aS1vcmctY2hhcnQnLFxuICB0ZW1wbGF0ZVVybDogJy4vb3JnLWNoYXJ0LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vb3JnLWNoYXJ0LmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgT3JnQ2hhcnRDb21wb25lbnQge1xuICBASW5wdXQoKSB0b3BFbXBsb3llZTogSUVtcGxveWVlO1xuICBASW5wdXQoKSBoYXNNYW5hZ2VyID0gZmFsc2U7XG4gIEBJbnB1dCgpIGRpcmVjdGlvbjogJ3ZlcnRpY2FsJyB8ICdob3Jpem9udGFsJyA9ICd2ZXJ0aWNhbCc7XG5cbiAgQE91dHB1dCgpIGl0ZW1DbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8SUVtcGxveWVlPigpO1xuXG4gIEBIb3N0QmluZGluZygnc3R5bGUuZmxleC1kaXJlY3Rpb24nKVxuICBnZXQgaG9zdENsYXNzKCkge1xuICAgIHJldHVybiB0aGlzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJyA/ICdjb2x1bW4nIDogJyc7XG4gIH1cbn1cbiJdfQ==