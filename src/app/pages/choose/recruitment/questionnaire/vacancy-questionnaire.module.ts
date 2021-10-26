import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VacancyQuestionnairePageRoutingModule } from './vacancy-questionnaire-routing.module';

import { VacancyQuestionnairePage } from './vacancy-questionnaire.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VacancyQuestionnairePageRoutingModule
  ],
  declarations: [VacancyQuestionnairePage]
})
export class VacanyQuestionnairePageModule { }
