import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../components/shared.module';
import { IonicModule } from '@ionic/angular';

import { SaCategoryListPageRoutingModule } from './sa-category-list-routing.module';

import { SaCategoryListPage } from './sa-category-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    SaCategoryListPageRoutingModule
  ],
  declarations: [SaCategoryListPage]
})
export class SaCategoryListPageModule { }
