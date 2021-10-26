import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Exit Interview',
      status: false
    },
  },
  {
    path: 'questionnaire',
    loadChildren: () => import('./questionnaire/questionnaire.module').then( m => m.QuestionnairePageModule)
  },  {
    path: 'assessee',
    loadChildren: () => import('./assessee/assessee.module').then( m => m.AssesseePageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExitInterviewAssessmentPageRoutingModule {}
