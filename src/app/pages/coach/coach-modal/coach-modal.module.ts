import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../../components/shared.module';
import { CoachModalPage } from './coach-modal';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    FileUploadModule
  ],
  declarations: [CoachModalPage]
})
export class CoachModalPageModule { }
