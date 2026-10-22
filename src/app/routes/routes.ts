import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./home/home').then(m => m.Home),
  },
  {
    path: 'components/select-virtual-scroll',
    loadComponent: () => import('./select-virtual-scroll/select-virtual-scroll').then(m => m.SelectVirtualScroll),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
