import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../components/shared.module';

import { IonicModule } from '@ionic/angular';

import { GrowPageRoutingModule } from './grow-routing.module';

import { GrowPage } from './grow.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    GrowPageRoutingModule
  ],
  declarations: [GrowPage]
})
export class GrowPageModule { }
