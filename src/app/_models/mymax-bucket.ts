import { DefaultProductComponentAttributes } from './default-product-component-attributes';

export class DefaultMyMaxProduct {

    MyMaxProductUID = '';
    sName = '';
    iOrder = 1;
    components: DefaultMyMaxProductComponent[] = [];

    constructor() { }
}

export class DefaultMyMaxProductComponent {

    MyMaxProductComponentUID = '';
    MyMaxProduct_fkMyMaxProductUID = '';
    sName = '';
    iOrder = 1;
    attributes: DefaultProductComponentAttributes[] = [];

    constructor() { }
}

export class BucketList {

    MyMaxBucketUID = '';
    sProductName = '';
    MyMaxProductUID = '';
    components: BucketListItem[] = [];

    constructor() {}
}

export class BucketListItem {

    MyMaxBucketItemUID = '';
    myMaxBucket_fkMymaxBucketUID = '';
    MyMaxProductComponentUID = '';
    sControlName = '';
    sControlType = '';
    iOrder = 0;
    bArchived = false;
    attributes: DefaultProductComponentAttributes;
    bCanDelete = true;
    sHeading = ''; // only for display purposes
    sDescription = ''; // only for display purposes
    sGraphTypes = ''; // only for display purposes
    isSelected = 0; // only for display purposes

    MymaxTemplateMenuComponentUID = ''; // we use this within mymax template
    MymaxTemplateUID = ''; // we use this within mymax template
    MymaxTemplateMenuUID = ''; // we use this within mymax template
    MyMaxProductUID = '';

    dataAttributes = {};

    rows = 1;
    cols = 1;
    x = -1;
    y = -1;

    constructor() {}
}

export class Scale {
    RptScalesUID = '';
    sScaleName = '';
    sTag = '';
    bCanDelete = 1;
    items: ScaleItem[] = [];
}

export class ScaleItem {
    RptScaleItemsUID = '';
    sItemLabel = '';
    iFromValue = 0;
    iToValue = 0;
    sColour = '';
    iOrder = 0;
}
