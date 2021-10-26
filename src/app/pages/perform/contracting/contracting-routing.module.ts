import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Contract Page',
      status: true
    },
    children: [
      {
        path: 'period',
        loadChildren: () => import('./period/period.module').then( m => m.PeriodPageModule)
      },
      {
        path: 'design',
        loadChildren: () => import('./design/design.module').then( m => m.DesignPageModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContractingPageRoutingModule {}
