import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { InfiniteScrollModule } from '../infinitescroll/infinitescroll.module';
import { MatCardModule } from '@angular/material/card';
import { SinglesRoutingModule } from './singles-routing.module';
import { SinglesComponent } from './singles.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';




@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    HttpClientJsonpModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    InfiniteScrollModule,
    SinglesRoutingModule,
  ],
  declarations: [
    SinglesComponent,
  ]
})
export class SinglesModule { }
