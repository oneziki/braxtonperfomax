import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../../components/shared.module';
import { AcademyModalPage } from './academy-modal';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule
  ],
  declarations: [AcademyModalPage]
})
export class AcademyModalPageModule { }
