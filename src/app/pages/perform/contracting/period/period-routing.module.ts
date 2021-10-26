import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PeriodPage } from './period.page';

const routes: Routes = [
  {
    path: '',
    component: PeriodPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeriodPageRoutingModule {}
