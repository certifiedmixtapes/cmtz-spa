import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { MatIconModule } from '@angular/material/icon';
import { ImageLazyLoadModule } from '../img-lazy-load/image-lazy-load.module';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ImageLazyLoadModule,
    MatDividerModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    HomeRoutingModule,
  ],
  declarations: [
    HomeComponent,
  ]
})
export class HomeModule { }
