import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'components/select-virtual-scroll',
    loadComponent: () => import('./select-virtual-scroll/select-virtual-scroll').then(m => m.SelectVirtualScroll),
  },
];
