import { Route } from '@angular/router';
import { Home } from '../ui/home/home';

export const appRoutes: Route[] = [
  {
    path: 'home',
    title: 'Ignacio Köstner - Home',
    component: Home,
  },
  {
    path: 'trending-repositories',
    title: 'Köstner - Trending GitHub Repositories',
    loadComponent: () => import('@frontend/repositories').then(m => m.RepositoriesTable),
  },
  {
    path: 'air-quality',
    children: [
      {
        path: '',
        loadChildren: () => import('@frontend/air-quality').then(m => m.airQualityRoutes),
      },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'air-quality',
  },
  { path: '**', redirectTo: '/home' },
];
