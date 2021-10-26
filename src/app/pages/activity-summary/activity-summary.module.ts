import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../components/shared.module';
import { IonicModule } from '@ionic/angular';

import { ActivitySummaryPageRoutingModule } from './activity-summary-routing.module';

import { ActivitySummaryPage } from './activity-summary.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ActivitySummaryPageRoutingModule
  ],
  declarations: [ActivitySummaryPage]
})
export class ActivitySummaryPageModule {}
