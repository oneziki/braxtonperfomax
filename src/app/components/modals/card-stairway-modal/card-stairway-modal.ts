import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'card-stairway-modal-page',
  styleUrls: ['./card-stairway-modal.scss'],
  templateUrl: './card-stairway-modal.page.html',
})
export class CardStairwayModalPage implements OnInit {

  @Input() modalData;

  constructor (private modalController: ModalController) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true,
    });
  }

}