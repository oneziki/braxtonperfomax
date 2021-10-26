import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssesseePage } from './assessee.page';

const routes: Routes = [
  {
    path: '',
    component: AssesseePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssesseePageRoutingModule {}
