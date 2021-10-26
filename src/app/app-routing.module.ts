import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then((m) => m.AuthPageModule),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'personal',
    loadChildren: () =>
      import('./home/tabs/personal/personal.module').then((m) => m.PersonalPageModule),
  },
  {
    path: 'team',
    loadChildren: () =>
      import('./home/tabs/team/team.module').then((m) => m.TeamPageModule),
  },
  {
    path: 'perform',
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/perform/perform.module').then(module => module.PerformPageModule)
      },
      {
        path: 'scoring',
        loadChildren: () => import('./pages/perform/scoring/scoring.module').then(m => m.ScoringPageModule)
      },
      {
        path: 'contracting',
        loadChildren: () => import('./pages/perform/contracting/contracting.module').then(m => m.ContractingPageModule)
      },
    ]
  },
  {
    path: 'maintenance',
    children: [
      {
        path: 'privacy-policy',
        loadChildren: () => import('./pages/maintenance/privacy-policy/privacy-policy.module').then(module => module.PrivacyPolicyPageModule)
      },
      {
        path: 'cookie-policy',
        loadChildren: () => import('./pages/maintenance/cookie-policy/cookie-policy.module').then(module => module.CookiePolicyPageModule)
      }
    ]
  },
  {
    path: 'organogram',
    loadChildren: () => import('./pages/organogram/organogram.module').then(m => m.OrganogramPageModule)
  },
  {
    path: 'profile-library',
    loadChildren: () => import('./pages/role-profiles/role-profiles.module').then(m => m.RoleProfilesPageModule)
  },
  {
    path: 'support',
    loadChildren: () => import('./pages/support/support.module').then(m => m.SupportPageModule)
  },
  {
    path: 'academy',
    loadChildren: () => import('./pages/academy/academy.module').then(m => m.AcademyPageModule)
  },
  {
    path: 'survey-assessment',
    loadChildren: () => import('./pages/survey-assessment/survey-assessment.module').then(m => m.SurveyAssessmentPageModule)
  },
  {
    path: 'activity-summary',
    loadChildren: () => import('./pages/activity-summary/activity-summary.module').then(m => m.ActivitySummaryPageModule)
  },
  {
    path: 'grow',
    loadChildren: () => import('./pages/grow/grow.module').then(m => m.GrowPageModule)
  },
  {
    path: 'live',
    loadChildren: () => import('./pages/live/live.module').then(m => m.LivePageModule)
  },
  {
    path: 'choose',
    loadChildren: () => import('./pages/choose/choose.module').then(m => m.ChoosePageModule)
  },
  {
    path: 'aspire',
    loadChildren: () => import('./pages/aspire/aspire.module').then(m => m.AspirePageModule)
  },
  {
    path: 'coach',
    loadChildren: () => import('./pages/coach/coach.module').then(m => m.CoachPageModule)
  },
  {
    path: 'mymax',
    loadChildren: () => import('./pages/mymax/mymax.module').then(m => m.MyMaxPageModule)
  },
  {
    path: 'mymax-reporting',
    loadChildren: () => import('./pages/mymax-reporting/mymax-reporting.module').then(m => m.MymaxReportingPageModule)
  },
  {
    path: 'resources',
    loadChildren: () => import('./pages/resources/resources.module').then(m => m.ResourcesModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
