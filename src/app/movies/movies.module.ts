import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MoviesComponent } from './movies.component';

@NgModule({
  declarations: [
    MoviesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: MoviesComponent }])
  ]
})
export class MoviesModule { }
