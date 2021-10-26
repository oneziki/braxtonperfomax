import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LivePage } from './live.page';

const routes: Routes = [
  {
    path: '',
    component: LivePage
  },
  {
    path: 'exit-interview-assessment',
    loadChildren: () => import('./exit-interview-assessment/exit-interview-assessment.module').then( m => m.ExitInterviewAssessmentPageModule)
  },  {
    path: 'esurvey',
    loadChildren: () => import('./esurvey/esurvey.module').then( m => m.EsurveyPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LivePageRoutingModule {}
