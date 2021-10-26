import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MymaxReportingPage } from './mymax-reporting.page';

const routes: Routes = [
  {
    path: '',
    component: MymaxReportingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MymaxReportingPageRoutingModule {}
