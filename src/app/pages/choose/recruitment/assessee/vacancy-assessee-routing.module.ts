import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VacancyAssesseePage } from './vacancy-assessee.page';

const routes: Routes = [
  {
    path: '',
    component: VacancyAssesseePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VacancyAssesseePageRoutingModule { }
