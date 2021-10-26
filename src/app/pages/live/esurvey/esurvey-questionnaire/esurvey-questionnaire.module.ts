import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EsurveyQuestionnairePageRoutingModule } from './esurvey-questionnaire-routing.module';

import { EsurveyQuestionnairePage } from './esurvey-questionnaire.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EsurveyQuestionnairePageRoutingModule
  ],
  declarations: [EsurveyQuestionnairePage]
})
export class EsurveyQuestionnairePageModule {}
