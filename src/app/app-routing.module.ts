import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'movies',
    loadChildren: () => import('./movies/movies.module').then(m => m.MoviesModule)
  },
  {
    path: 'books',
    loadChildren: () => import('./books/books.module').then(m => m.BooksModule)
  },
  {
    path: 'games',
    loadChildren: () => import('./games/games.module').then(m => m.GamesModule)
  },
  {
    path: 'albums',
    loadChildren: () => import('./albums/albums.module').then(m => m.AlbumsModule)
  },
  {
    path: 'account',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'review',
        children: [
          {
            path: 'add',
            loadChildren: () => import('./account/review/add/account-add-review.module').then(m => m.AccountAddReviewModule)
          },
          {
            path: 'list',
            loadChildren: () => import('./account/review/list/account-list-review.module').then(m => m.AccountListReviewModule)
          }
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
