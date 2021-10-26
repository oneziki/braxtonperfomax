import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../components/shared.module';
import { CoachPageRoutingModule } from './coach-routing.module';
import { CoachPage } from './coach.page';
import { CoachModalPageModule } from './coach-modal/coach-modal.module'
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CoachPageRoutingModule,
    CoachModalPageModule,
    FileUploadModule
  ],
  declarations: [CoachPage]
})
export class CoachPageModule { }
