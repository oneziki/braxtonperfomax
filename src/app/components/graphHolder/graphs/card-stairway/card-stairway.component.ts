import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { MyMaxFilter } from '../../../../_models';
import { ModalController } from '@ionic/angular';
import { ModalsPage } from '../../../modals/modals.page';
@Component({
  selector: 'app-card-stairway',
  templateUrl: './card-stairway.component.html',
  styleUrls: ['./card-stairway.component.scss'],
  encapsulation: ViewEncapsulation.None
})
// '../../../../../assets/icon/icofont.min.scss'
export class CardStairwayComponent {

  @Input() data;
  @Input() filter: MyMaxFilter;
  @Output() graphClickHandler: EventEmitter<any> = new EventEmitter<any>();

  _mouseOveredPre = -1;
  _mouseOveredPost = -1;
  _noData = false;

  // private modalService: NgbModal
  constructor(
    public modalController: ModalController
  ) { }

  ngOnInit() {
    if (this.data['data'].length < 2 ) {
      this._noData = true;
    }
  }

  async open(listItem) {
    const modal = await this.modalController.create({
      component: ModalsPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'modalData': listItem['sModalData'][0],
        'type' : 'cardStairway'
      }
    });

    modal.onDidDismiss()
      .then((data) => {
      });

    return await modal.present();
  }

  chartClick(item) {
    if(this.data['visualSettings'][ this.filter['viewPrefix'] + 'bGraphClickThrough']) {
      this.filter.detailed_stepThroughValue = ''; // ensure this value is empty for the graph click through
      this.filter.summary_stepThroughValue = item[0];
      const componentData = {'currentViewSection': 'detailed', 'MymaxTemplateMenuComponentUID': this.data.MymaxTemplateMenuComponentUID};
      this.graphClickHandler.emit(componentData);
    }
  }
}
