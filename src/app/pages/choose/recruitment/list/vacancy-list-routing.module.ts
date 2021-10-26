import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VacancyListPage } from './vacancy-list.page';

const routes: Routes = [
  {
    path: '',
    component: VacancyListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VacancyListPageRoutingModule { }
