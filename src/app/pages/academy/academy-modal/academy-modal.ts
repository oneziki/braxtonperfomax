import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'academy-modal-page',
  styleUrls: ['../academy.page.scss'],
  templateUrl: './academy-modal.page.html',
})
export class AcademyModalPage implements OnInit {



  @Input() resUpload;
  type = '';

  constructor (private modalController: ModalController) {

  }

  ngOnInit(): void {
    let str = this.resUpload['sDocumentUploadName'];
    let strSearc = str.search('youtube');

    if (strSearc !== -1) {
      this.resUpload['sDocumentUploadName'] = this.resUpload['sDocumentUploadName'].replace('/watch?v=', '/embed/');
      this.type = 'embed';
    } else {
      this.type = 'video';
    }
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true,
    });
  }
}