import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExpertiseReviewPage } from './expertise-review.page';

const routes: Routes = [
  {
    path: '',
    component: ExpertiseReviewPage
  },
  {
    path: 'assessee',
    loadChildren: () => import('./assessee/assessee.module').then( m => m.AssesseePageModule)
  },
  {
    path: 'questionnaire',
    loadChildren: () => import('./questionnaire/questionnaire.module').then( m => m.QuestionnairePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpertiseReviewPageRoutingModule {}
