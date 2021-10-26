import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { CookiePolicyPageRoutingModule } from './cookie-policy-routing.module';

import { CookiePolicyPage } from './cookie-policy.page';

@NgModule({
  imports: [ 
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: CookiePolicyPage }]),
    CookiePolicyPageRoutingModule
  ],
  declarations: [CookiePolicyPage]
})
export class CookiePolicyPageModule {}
