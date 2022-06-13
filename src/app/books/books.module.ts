import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { BooksComponent } from './books.component';

@NgModule({
  declarations: [
    BooksComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: BooksComponent }])
  ]
})
export class BooksModule { }
