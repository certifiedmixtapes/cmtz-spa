import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import {MatDividerModule} from '@angular/material/divider';
import { NewMixtapesRoutingModule } from './new-mixtapes-routing.module';
import { NewMixtapesComponent } from './new-mixtapes.component';
import { InfiniteScrollModule } from '../infinitescroll/infinitescroll.module';
import { InfiniteScrollComponent } from '../infinitescroll/infinitescroll.component';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { PlayerService } from '../shared/player.service';
import { AppRoutingModule } from '../app-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';




@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    HttpClientJsonpModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    //SharedModule,
    //RouterModule,
    InfiniteScrollModule,
    NewMixtapesRoutingModule,
  ],
  declarations: [
    NewMixtapesComponent,
  ]
})
export class NewMixtapesModule { }
