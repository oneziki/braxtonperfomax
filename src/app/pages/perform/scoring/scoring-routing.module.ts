import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Scoring Page',
      status: true
    },
    children: [
      {
        path: 'assessment',
        loadChildren: () => import('./assessment/assessment.module').then( m => m.AssessmentPageModule)
      },
      {
        path: 'discussion-manual',
        loadChildren: () => import('./discussion-manual/discussion-manual.module').then( m => m.DiscussionManualPageModule)
      },
      {
        path: 'discussion',
        loadChildren: () => import('./discussion/discussion.module').then( m => m.DiscussionPageModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScoringPageRoutingModule {}
