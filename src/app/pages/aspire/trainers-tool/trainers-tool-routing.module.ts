import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainersToolPage } from './trainers-tool.page';

const routes: Routes = [
  {
    path: '',
    component: TrainersToolPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainersToolPageRoutingModule {}
