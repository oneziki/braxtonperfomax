import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicSelectableModule } from 'ionic-selectable';
import { IonicModule } from '@ionic/angular';

import { Section2PageRoutingModule } from './section2-routing.module';

import { Section2Page } from './section2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Section2PageRoutingModule,
    IonicSelectableModule
  ],
  declarations: [Section2Page]
})
export class Section2PageModule {}
