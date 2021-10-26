import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../components/shared.module';

import { IonicModule } from '@ionic/angular';

import { AspirePageRoutingModule } from './aspire-routing.module';

import { AspirePage } from './aspire.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AspirePageRoutingModule
  ],
  declarations: [AspirePage]
})
export class AspirePageModule { }
