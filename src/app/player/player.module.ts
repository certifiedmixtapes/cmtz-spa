import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { CdkTableModule } from '@angular/cdk/table';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PlayerComponent } from './player.component';
import { MatCardModule } from '@angular/material/card';


@NgModule({
  imports: [
    CommonModule,
    CdkTableModule,
    CdkTableModule,
    DragDropModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatListModule,
  ],
  bootstrap: [PlayerComponent],
  declarations: [
    PlayerComponent,
  ],
  exports: [PlayerComponent]
})
export class PlayerModule { }
