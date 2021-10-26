import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademyPage } from './academy.page';

const routes: Routes = [
  {
    path: '',
    component: AcademyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademyPageRoutingModule {}
