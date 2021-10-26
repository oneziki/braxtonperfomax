import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Survey Assessment',
      status: true
    },
    children: [
      {
        path: 'sa-category-list',
        loadChildren: () => import('./sa-category-list/sa-category-list.module').then(m => m.SaCategoryListPageModule)
      },
      {
        path: 'invite-individuals',
        loadChildren: () => import('./invite-individuals/invite-individuals.module').then(m => m.InviteIndividualsPageModule)
      },
      {
        path: 'questionnaire',
        loadChildren: () => import('./questionnaire/questionnaire.module').then(m => m.QuestionnairePageModule)
      },
      {
        path: 'assessee-list',
        loadChildren: () => import('./assessee-list/assessee-list.module').then(m => m.AssesseeListPageModule)
      },
      {
        path: 'report',
        loadChildren: () => import('./report/report.module').then(m => m.ReportPageModule)
      }
    ]
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SurveyAssessmentPageRoutingModule { }
