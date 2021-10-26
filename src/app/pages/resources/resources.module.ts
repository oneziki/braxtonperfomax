import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../../components/shared.module';
import { IonicModule } from '@ionic/angular';

import { RescourcesRoutingModule } from './resources-routing.module';

import { Resources } from './resources';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RescourcesRoutingModule
  ],
  declarations: [Resources]
})
export class ResourcesModule { }
