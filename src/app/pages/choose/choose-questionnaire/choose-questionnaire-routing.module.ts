import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Choose Questionnaire',
      status: false
    },
  },
  {
    path: 'section1',
    loadChildren: () => import('./section1/section1.module').then( m => m.Section1PageModule)
  },
  {
    path: 'section2',
    loadChildren: () => import('./section2/section2.module').then( m => m.Section2PageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChooseQuestionnairePageRoutingModule {}
