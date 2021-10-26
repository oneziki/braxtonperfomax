import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssesseeListPage } from './assessee-list.page';

const routes: Routes = [
  {
    path: '',
    component: AssesseeListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssesseeListPageRoutingModule {}
