import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VacancyViewPageRoutingModule } from './vacancy-view-routing.module';

import { VacancyViewPage } from './vacancy-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VacancyViewPageRoutingModule
  ],
  declarations: [VacancyViewPage]
})
export class VacancyViewPageModule { }
