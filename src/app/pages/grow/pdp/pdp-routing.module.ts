import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PdpPage } from './pdp.page';

const routes: Routes = [
  {
    path: '',
    component: PdpPage
  },
  {
    path: 'manual',
    loadChildren: () => import('./manual/manual.module').then( m => m.ManualPageModule)
  },
  {
    path: 'integrated',
    loadChildren: () => import('./integrated/integrated.module').then( m => m.IntegratedPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PdpPageRoutingModule {}
