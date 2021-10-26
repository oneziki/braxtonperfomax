import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../components/shared.module';

import { IonicModule } from '@ionic/angular';

import { ChoosePageRoutingModule } from './choose-routing.module';

import { ChoosePage } from './choose.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ChoosePageRoutingModule
  ],
  declarations: [ChoosePage]
})
export class ChoosePageModule { }
