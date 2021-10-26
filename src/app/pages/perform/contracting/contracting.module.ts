import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContractingPageRoutingModule } from './contracting-routing.module';

import { ContractingPage } from './contracting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContractingPageRoutingModule
  ],
  declarations: [ContractingPage]
})
export class ContractingPageModule {}
