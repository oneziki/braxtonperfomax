import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../../components/shared.module';
import { OrganogramModalPage } from './organogram-modal';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule
  ],
  declarations: [OrganogramModalPage]
})
export class OrganogramModalPageModule { }
