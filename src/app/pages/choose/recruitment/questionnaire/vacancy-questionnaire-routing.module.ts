import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VacancyQuestionnairePage } from './vacancy-questionnaire.page';

const routes: Routes = [
  {
    path: '',
    component: VacancyQuestionnairePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VacancyQuestionnairePageRoutingModule { }
