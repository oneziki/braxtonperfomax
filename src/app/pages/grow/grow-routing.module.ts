import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GrowPage } from './grow.page';

const routes: Routes = [
  {
    path: '',
    component: GrowPage
  },
  {
    path: 'pdp',
    loadChildren: () => import('./pdp/pdp.module').then(m => m.PdpPageModule)
  },
  {
    path: 'swot-analysis',
    loadChildren: () => import('./swot-analysis/swot-analysis.module').then(m => m.SwotAnalysisPageModule)
  },
  {
    path: 'three-sixty',
    loadChildren: () => import('./three-sixty/three-sixty.module').then(m => m.ThreeSixtyPageModule)
  },  {
    path: 'expertise-review',
    loadChildren: () => import('./expertise-review/expertise-review.module').then( m => m.ExpertiseReviewPageModule)
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GrowPageRoutingModule { }
