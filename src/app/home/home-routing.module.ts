import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}


//     children: [
//   {
//     path: 'folder',
//     children: [
//       {
//         path: '',
//         loadChildren: '../folder/folder.module#FolderPageModule'
//       }
//     ]
//   },
//   {
//     path: 'personal',
//     children: [
//       {
//         path: '',
//         loadChildren: './tabs/personal/personal.module#PersonalPageModule'
//       }
//     ]
//   },
//   {
//     path: 'team',
//     children: [
//       {
//         path: '',
//         loadChildren: './tabs/team/team.module#TeamPageModule'
//       }
//     ]
//   }
// ]