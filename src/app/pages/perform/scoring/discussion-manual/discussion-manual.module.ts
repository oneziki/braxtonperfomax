import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../../components/shared.module';
import { IonicModule } from '@ionic/angular';
import { FileUploadModule } from 'ng2-file-upload';
import { DiscussionManualPageRoutingModule } from './discussion-manual-routing.module';

import { DiscussionManualPage } from './discussion-manual.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    FileUploadModule,
    DiscussionManualPageRoutingModule
  ],
  declarations: [DiscussionManualPage]
})
export class DiscussionManualPageModule {}
