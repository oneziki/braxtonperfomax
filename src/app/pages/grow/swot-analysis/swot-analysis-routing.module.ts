import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SwotAnalysisPage } from './swot-analysis.page';

const routes: Routes = [
  {
    path: '',
    component: SwotAnalysisPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SwotAnalysisPageRoutingModule {}
