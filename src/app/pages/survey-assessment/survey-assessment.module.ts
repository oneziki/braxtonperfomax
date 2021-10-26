import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SurveyAssessmentPageRoutingModule } from './survey-assessment-routing.module';

import { SurveyAssessmentPage } from './survey-assessment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SurveyAssessmentPageRoutingModule
  ],
  declarations: [SurveyAssessmentPage]
})
export class SurveyAssessmentPageModule {}
