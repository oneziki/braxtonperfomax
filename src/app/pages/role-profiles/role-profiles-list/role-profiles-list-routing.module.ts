import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoleProfilesListPage } from './role-profiles-list.page';

const routes: Routes = [
  {
    path: '',
    component: RoleProfilesListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoleProfilesListPageRoutingModule {}
