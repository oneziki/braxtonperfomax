import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../../components/shared.module';

import { IonicModule } from '@ionic/angular';

import { LivePageRoutingModule } from './live-routing.module';

import { LivePage } from './live.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    LivePageRoutingModule
  ],
  declarations: [LivePage]
})
export class LivePageModule { }
