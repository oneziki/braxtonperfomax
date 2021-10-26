import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoleProfilesViewPage } from './role-profiles-view.page';

const routes: Routes = [
  {
    path: '',
    component: RoleProfilesViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoleProfilesViewPageRoutingModule {}
