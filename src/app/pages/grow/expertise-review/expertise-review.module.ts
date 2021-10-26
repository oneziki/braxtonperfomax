import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExpertiseReviewPageRoutingModule } from './expertise-review-routing.module';

import { ExpertiseReviewPage } from './expertise-review.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExpertiseReviewPageRoutingModule
  ],
  declarations: [ExpertiseReviewPage]
})
export class ExpertiseReviewPageModule {}
