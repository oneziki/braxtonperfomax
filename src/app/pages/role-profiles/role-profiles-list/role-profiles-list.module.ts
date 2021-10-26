import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../components/shared.module';
import { IonicModule } from '@ionic/angular';

import { RoleProfilesListPageRoutingModule } from './role-profiles-list-routing.module';

import { RoleProfilesListPage } from './role-profiles-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RoleProfilesListPageRoutingModule
  ],
  declarations: [RoleProfilesListPage]
})
export class RoleProfilesListPageModule {}
