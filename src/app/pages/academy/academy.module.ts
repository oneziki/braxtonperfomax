import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../components/shared.module';

import { IonicModule } from '@ionic/angular';

import { AcademyPageRoutingModule } from './academy-routing.module';

import { AcademyPage } from './academy.page';
import { AcademyModalPageModule } from './academy-modal/academy-modal.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AcademyPageRoutingModule,
    AcademyModalPageModule
  ],
  declarations: [AcademyPage]
})
export class AcademyPageModule { }
