import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Section1Page } from './section1.page';

const routes: Routes = [
  {
    path: '',
    component: Section1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Section1PageRoutingModule {}
