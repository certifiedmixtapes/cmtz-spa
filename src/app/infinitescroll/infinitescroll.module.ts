import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollComponent } from './infinitescroll.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    InfiniteScrollComponent,
  ],
  exports: [InfiniteScrollComponent]
})
export class InfiniteScrollModule { }
