import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiscussionManualPage } from './discussion-manual.page';

const routes: Routes = [
  {
    path: '',
    component: DiscussionManualPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiscussionManualPageRoutingModule {}
