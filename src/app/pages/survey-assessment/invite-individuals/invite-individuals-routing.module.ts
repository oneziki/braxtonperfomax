import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InviteIndividualsPage } from './invite-individuals.page';

const routes: Routes = [
  {
    path: '',
    component: InviteIndividualsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InviteIndividualsPageRoutingModule {}
