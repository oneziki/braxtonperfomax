import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EsurveyListPage } from './esurvey-list.page';

const routes: Routes = [
  {
    path: '',
    component: EsurveyListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EsurveyListPageRoutingModule {}
