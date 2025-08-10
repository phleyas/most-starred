import { RepositoriesTable } from './domains/repositories/ui/repositories-table/repositories-table';
import { Routes } from '@angular/router';
import { Home } from './shell/home/home';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'trending-repositories',
  },
  {
    path: 'home',
    component: Home,
  },
  {
    path: 'trending-repositories',
    component: RepositoriesTable,
  },
];
