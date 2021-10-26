import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InviteIndividualsPageRoutingModule } from './invite-individuals-routing.module';

import { InviteIndividualsPage } from './invite-individuals.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InviteIndividualsPageRoutingModule
  ],
  declarations: [InviteIndividualsPage]
})
export class InviteIndividualsPageModule {}
