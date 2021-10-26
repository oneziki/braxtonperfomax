import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PeriodPageRoutingModule } from './period-routing.module';

import { PeriodPage } from './period.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PeriodPageRoutingModule
  ],
  declarations: [PeriodPage]
})
export class PeriodPageModule {}
