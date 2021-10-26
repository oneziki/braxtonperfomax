import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrgChartModule } from '@mondal/org-chart';
import { IonicModule } from '@ionic/angular';

import { OrganogramPageRoutingModule } from './organogram-routing.module';
import { OrganogramPage } from './organogram.page';
import { OrganogramModalPageModule } from './organogram-modal/organogram-modal.module'

@NgModule({
  imports: [
    CommonModule,
    OrgChartModule,
    FormsModule,
    IonicModule,
    RouterModule,
    OrganogramModalPageModule,
    OrganogramPageRoutingModule
  ],
  declarations: [OrganogramPage]
})
export class OrganogramPageModule { }
