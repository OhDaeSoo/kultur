import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ListReviewComponent } from './list-review.component';

@NgModule({
  declarations: [
    ListReviewComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: ListReviewComponent }])
  ]
})
export class AccountListReviewModule { }
