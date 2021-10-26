import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssesseePageRoutingModule } from './assessee-routing.module';

import { AssesseePage } from './assessee.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssesseePageRoutingModule
  ],
  declarations: [AssesseePage]
})
export class AssesseePageModule {}
