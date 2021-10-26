import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoleProfilesPage } from './role-profiles.page';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Role Profiles',
      status: true
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./role-profiles-list/role-profiles-list.module').then( m => m.RoleProfilesListPageModule)
      },
      {
        path: 'role-profiles-view',
        loadChildren: () => import('./role-profiles-view/role-profiles-view.module').then( m => m.RoleProfilesViewPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoleProfilesPageRoutingModule {}
