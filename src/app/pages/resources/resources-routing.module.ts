import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Resources } from './resources';

const routes: Routes = [
  {
    path: '',
    component: Resources
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RescourcesRoutingModule { }
