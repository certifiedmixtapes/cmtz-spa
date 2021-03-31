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
import {
  DEFAULT_BREAKPOINTS,
  ImageFormat,
  NgxPictureModule
} from 'ngx-picture';

//?width=350&webp.lossless=true
export function srcInterpolator(
  url: string,
  imageFormat: ImageFormat,
  breakpoint: string,
  breakpointValue: number
) {
  console.log("url: " + url);
  console.log(breakpointValue);
  return `${url}?width=${breakpointValue}&webp.lossless=true`;
}

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
    NgxPictureModule.forRoot({
      breakpoints: DEFAULT_BREAKPOINTS, //2. the break points to create sources for
      imageFormats: ['webp', 'jpeg'], //3. the image formats to create sources for. *
      srcInterpolator 
    }),
  ],
  declarations: [
    HomeComponent,
  ]
})
export class HomeModule { }
