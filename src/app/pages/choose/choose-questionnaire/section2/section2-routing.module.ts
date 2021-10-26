import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Section2Page } from './section2.page';

const routes: Routes = [
  {
    path: '',
    component: Section2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Section2PageRoutingModule {}
