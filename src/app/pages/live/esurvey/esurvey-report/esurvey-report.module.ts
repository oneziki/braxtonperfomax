import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EsurveyReportPageRoutingModule } from './esurvey-report-routing.module';

import { EsurveyReportPage } from './esurvey-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EsurveyReportPageRoutingModule
  ],
  declarations: [EsurveyReportPage]
})
export class EsurveyReportPageModule {}
