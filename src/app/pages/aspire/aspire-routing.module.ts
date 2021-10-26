import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AspirePage } from './aspire.page';

const routes: Routes = [
  {
    path: '',
    component: AspirePage
  },
  {
    path: 'trainers-tool',
    loadChildren: () => import('./trainers-tool/trainers-tool.module').then(m => m.TrainersToolPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AspirePageRoutingModule { }
