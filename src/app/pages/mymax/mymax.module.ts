import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MyMaxPage } from './mymax.page';
import { SharedModule } from '../../components/shared.module';
import { MyMaxSharedModule } from './mymaxShared.module';
import { FilterModalPageModule } from './filter-modal/filter-modal.module'

import { GridsterModule } from 'angular-gridster2';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SharedModule,
    MyMaxSharedModule,
    FilterModalPageModule,
    GridsterModule,
    RouterModule.forChild([{ path: '', component: MyMaxPage }])
  ],
  declarations: [MyMaxPage]
})
export class MyMaxPageModule { }
