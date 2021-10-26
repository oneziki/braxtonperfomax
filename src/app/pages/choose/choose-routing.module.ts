import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChoosePage } from './choose.page';

const routes: Routes = [
  {
    path: '',
    component: ChoosePage
  },
  {
    path: 'choose-questionnaire',
    loadChildren: () => import('./choose-questionnaire/choose-questionnaire.module').then(m => m.ChooseQuestionnairePageModule)
  },
  {
    path: 'recruitment',
    loadChildren: () => import('./recruitment/recruitment.module').then(m => m.RecrutimentPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChoosePageRoutingModule { }
