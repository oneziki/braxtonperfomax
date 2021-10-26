import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoleProfilesViewPageRoutingModule } from './role-profiles-view-routing.module';

import { RoleProfilesViewPage } from './role-profiles-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoleProfilesViewPageRoutingModule
  ],
  declarations: [RoleProfilesViewPage]
})
export class RoleProfilesViewPageModule {}
