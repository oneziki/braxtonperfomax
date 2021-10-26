import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrganogramPage } from './organogram.page';

const routes: Routes = [
  {
    path: '',
    component: OrganogramPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganogramPageRoutingModule {}
