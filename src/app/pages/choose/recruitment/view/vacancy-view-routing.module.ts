import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VacancyViewPage } from './vacancy-view.page';

const routes: Routes = [
  {
    path: '',
    component: VacancyViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VacancyViewPageRoutingModule { }
