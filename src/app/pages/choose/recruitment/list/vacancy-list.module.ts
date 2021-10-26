import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../../components/shared.module';

import { IonicModule } from '@ionic/angular';

import { VacancyListPageRoutingModule } from './vacancy-list-routing.module';

import { VacancyListPage } from './vacancy-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    VacancyListPageRoutingModule
  ],
  declarations: [VacancyListPage]
})
export class VacancyListPageModule { }
