import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PdpPageRoutingModule } from './pdp-routing.module';

import { PdpPage } from './pdp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PdpPageRoutingModule
  ],
  declarations: [PdpPage]
})
export class PdpPageModule {}
