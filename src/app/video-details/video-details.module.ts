import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { VideoDetailsRoutingModule } from './video-details-routing.module';
import { VideoDetailsComponent } from './video-details.component';
import { NgxYoutubePlayerModule  } from "ngx-youtube-player";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    HttpClientJsonpModule,
    VideoDetailsRoutingModule,
    NgxYoutubePlayerModule.forRoot()
  ],
  declarations: [
        VideoDetailsComponent,
  ]
})
export class VideoDetailsModule { }
