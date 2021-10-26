import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Section1PageRoutingModule } from './section1-routing.module';

import { Section1Page } from './section1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Section1PageRoutingModule
  ],
  declarations: [Section1Page]
})
export class Section1PageModule {}
