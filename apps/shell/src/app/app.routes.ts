import { Route } from '@angular/router';
import { Home } from '../ui/home/home';
import { RepositoriesTable } from '@frontend/repositories';

export const appRoutes: Route[] = [
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
