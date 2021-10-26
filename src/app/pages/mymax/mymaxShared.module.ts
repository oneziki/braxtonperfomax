import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/components/shared.module';

import { MyMaxCardPage } from './mymax-card/mymax-card.page';

@NgModule({
  imports: [CommonModule, IonicModule, SharedModule],
  declarations: [
    MyMaxCardPage
  ],
  exports: [
    MyMaxCardPage
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MyMaxSharedModule { }
