import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EsurveyListPageRoutingModule } from './esurvey-list-routing.module';

import { EsurveyListPage } from './esurvey-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EsurveyListPageRoutingModule
  ],
  declarations: [EsurveyListPage]
})
export class EsurveyListPageModule {}
