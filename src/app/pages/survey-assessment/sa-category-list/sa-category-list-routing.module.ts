import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SaCategoryListPage } from './sa-category-list.page';

const routes: Routes = [
  {
    path: '',
    component: SaCategoryListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SaCategoryListPageRoutingModule {}
