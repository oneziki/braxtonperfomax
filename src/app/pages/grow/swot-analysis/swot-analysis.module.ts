import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../components/shared.module';

import { IonicModule } from '@ionic/angular';

import { SwotAnalysisPageRoutingModule } from './swot-analysis-routing.module';

import { SwotAnalysisPage } from './swot-analysis.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    SwotAnalysisPageRoutingModule
  ],
  declarations: [SwotAnalysisPage]
})
export class SwotAnalysisPageModule {}
