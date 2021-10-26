import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EsurveyQuestionnairePage } from './esurvey-questionnaire.page';

const routes: Routes = [
  {
    path: '',
    component: EsurveyQuestionnairePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EsurveyQuestionnairePageRoutingModule {}
