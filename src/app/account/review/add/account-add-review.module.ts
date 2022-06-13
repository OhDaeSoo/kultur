import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AddReviewComponent } from './add-review.component';
import { ListResultComponent } from '../../../shared/components/list-result/list-result.component';
import { ReactiveFormsModule } from '@angular/forms';

import { MatSliderModule } from '@angular/material/slider';

@NgModule({
  declarations: [
    AddReviewComponent,
    ListResultComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSliderModule,
    RouterModule.forChild([{ path: '', component: AddReviewComponent }])
  ]
})
export class AccountAddReviewModule { }
