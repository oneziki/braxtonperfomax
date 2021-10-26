import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssesseeListPageRoutingModule } from './assessee-list-routing.module';

import { AssesseeListPage } from './assessee-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssesseeListPageRoutingModule
  ],
  declarations: [AssesseeListPage]
})
export class AssesseeListPageModule {}
