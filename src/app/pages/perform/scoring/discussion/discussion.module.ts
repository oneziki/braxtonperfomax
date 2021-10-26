import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FileUploadModule } from 'ng2-file-upload';
import { IonicModule } from '@ionic/angular';

import { DiscussionPageRoutingModule } from './discussion-routing.module';

import { DiscussionPage } from './discussion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FileUploadModule,
    DiscussionPageRoutingModule
  ],
  declarations: [DiscussionPage]
})
export class DiscussionPageModule {}
