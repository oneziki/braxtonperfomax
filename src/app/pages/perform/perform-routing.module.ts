import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerformPage } from './perform.page';

const routes: Routes = [
  {
    path: '',
    component: PerformPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerformPageRoutingModule {}
