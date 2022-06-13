import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AlbumsComponent } from './albums.component';

@NgModule({
  declarations: [
    AlbumsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: AlbumsComponent }])
  ]
})
export class AlbumsModule { }
