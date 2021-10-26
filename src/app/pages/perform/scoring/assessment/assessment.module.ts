import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';

import { IonicModule } from '@ionic/angular';

import { AssessmentPageRoutingModule } from './assessment-routing.module';

import { AssessmentPage } from './assessment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FileUploadModule,
    AssessmentPageRoutingModule
  ],
  declarations: [AssessmentPage]
})
export class AssessmentPageModule {}
