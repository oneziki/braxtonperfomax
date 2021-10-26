import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Performance Development Plan',
    },
    children: [
      {
        path: 'assessment',
        loadChildren: () => import('./assessment/assessment.module').then( m => m.AssessmentPageModule)
      },
      {
        path: 'design',
        loadChildren: () => import('./design/design.module').then( m => m.DesignPageModule)
      },
      {
        path: 'list',
        loadChildren: () => import('./list/list.module').then( m => m.ListPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntegratedPageRoutingModule {}
