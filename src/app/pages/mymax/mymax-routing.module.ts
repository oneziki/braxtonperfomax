import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyMaxPage } from './mymax.page';

const routes: Routes = [
  {
    path: '',
    component: MyMaxPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyMaxPageRoutingModule {}
