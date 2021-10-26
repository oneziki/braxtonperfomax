import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ThreeSixtyPage } from './three-sixty.page';

const routes: Routes = [
  {
    path: '',
    component: ThreeSixtyPage
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'report',
    loadChildren: () => import('./report/report.module').then( m => m.ReportPageModule)
  },  {
    path: 'questionnaire',
    loadChildren: () => import('./questionnaire/questionnaire.module').then( m => m.QuestionnairePageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThreeSixtyPageRoutingModule {}
