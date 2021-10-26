import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoleProfilesPageRoutingModule } from './role-profiles-routing.module';

import { RoleProfilesPage } from './role-profiles.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoleProfilesPageRoutingModule
  ],
  declarations: [RoleProfilesPage]
})
export class RoleProfilesPageModule {}
