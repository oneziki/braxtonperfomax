import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TrainersToolPageRoutingModule } from './trainers-tool-routing.module';
import { TrainersToolPage } from './trainers-tool.page';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainersToolPageRoutingModule
  ],
  declarations: [TrainersToolPage]
})
export class TrainersToolPageModule { }
