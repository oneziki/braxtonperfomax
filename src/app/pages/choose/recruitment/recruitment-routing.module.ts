import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Vacancies',
      status: false
    },
  },
  {
    path: 'list',
    loadChildren: () => import('./list/vacancy-list.module').then(module => module.VacancyListPageModule)
  },
  {
    path: 'vacancy',
    loadChildren: () => import('./view/vacancy-view.module').then(module => module.VacancyViewPageModule)
  },
  {
    path: 'assessee',
    loadChildren: () => import('./assessee/vacancy-assessee.module').then(module => module.VacancyAssesseePageModule)
  },
  {
    path: 'questionnaire',
    loadChildren: () => import('./questionnaire/vacancy-questionnaire.module').then(module => module.VacanyQuestionnairePageModule)
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecruitmentPageRoutingModule { }
