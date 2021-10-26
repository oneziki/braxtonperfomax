import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VacancyAssesseePageRoutingModule } from './vacancy-assessee-routing.module';

import { VacancyAssesseePage } from './vacancy-assessee.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VacancyAssesseePageRoutingModule
  ],
  declarations: [VacancyAssesseePage]
})
export class VacancyAssesseePageModule { }
