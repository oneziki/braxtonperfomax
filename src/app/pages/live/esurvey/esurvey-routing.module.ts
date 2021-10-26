import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Esurvey',
      status: false
    },
  },
  {
    path: 'esurvey-list',
    loadChildren: () => import('./esurvey-list/esurvey-list.module').then( m => m.EsurveyListPageModule)
  },
  {
    path: 'esurvey-questionnaire',
    loadChildren: () => import('./esurvey-questionnaire/esurvey-questionnaire.module').then( m => m.EsurveyQuestionnairePageModule)
  },  {
    path: 'esurvey-report',
    loadChildren: () => import('./esurvey-report/esurvey-report.module').then( m => m.EsurveyReportPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EsurveyPageRoutingModule {}
