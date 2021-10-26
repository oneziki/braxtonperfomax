import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ThreeSixtyPageRoutingModule } from './three-sixty-routing.module';

import { ThreeSixtyPage } from './three-sixty.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ThreeSixtyPageRoutingModule
  ],
  declarations: [ThreeSixtyPage]
})
export class ThreeSixtyPageModule {}
