import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivitySummaryPage } from './activity-summary.page';

const routes: Routes = [
  {
    path: '',
    component: ActivitySummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivitySummaryPageRoutingModule {}
