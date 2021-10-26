import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MymaxReportingPageRoutingModule } from './mymax-reporting-routing.module';

import { MymaxReportingPage } from './mymax-reporting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MymaxReportingPageRoutingModule
  ],
  declarations: [MymaxReportingPage]
})
export class MymaxReportingPageModule {}
