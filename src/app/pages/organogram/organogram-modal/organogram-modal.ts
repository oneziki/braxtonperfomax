import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'organogram-modal-page',
  styleUrls: ['../organogram.page.scss'],
  templateUrl: './organogram-modal.page.html',
})


export class OrganogramModalPage {
  @Input() listUserModal = [];
  @Input() listJobTitleModal = [];

  _view = 'Members';


  constructor (private modalController: ModalController,
  ) {
    this._view = 'Members'
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true,
    });
  }

}