import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav'
import { NgxYoutubePlayerModule  } from "ngx-youtube-player";
import { AppComponent } from './app.component';
import { ArtistComponent } from './artist/artist.component';
import { AlbumComponent } from './album/album.component';
import { TrackComponent } from './track/track.component';
import { PlayerComponent } from './player/player.component';
import { TrackControlComponent } from './track/track-control/track-control.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { TracksComponent } from './tracks/tracks.component';
import { SearchComponent } from './search/search.component';
import { AlbumDetailsComponent } from './album-details/album-details.component';
import { InfinitescrollComponent } from './infinitescroll/infinitescroll.component';
import { NewMixtapesComponent } from './new-mixtapes/new-mixtapes.component';
import { PopularMixtapesComponent } from './popular-mixtapes/popular-mixtapes.component';
import { VideoDetailsComponent } from './video-details/video-details.component';
import { CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommentboxComponent } from './commentbox/commentbox.component';
import { CommentsComponent } from './comments/comments.component';
import { ChildboxComponent } from './childbox/childbox.component';
import { DatacontainerDirective } from './comments/comments.component';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgBottomNavigationModule} from 'ng-bottom-navigation';
import { SinglesComponent } from './singles/singles.component';




@NgModule({
  declarations: [
    AppComponent,
    ArtistComponent,
    AlbumComponent,
    CommentboxComponent,
    CommentsComponent,
    ChildboxComponent,
    DatacontainerDirective,
    TrackComponent,
    PlayerComponent,
    TrackControlComponent,
    HomeComponent,
    TracksComponent,
    SearchComponent,
    AlbumDetailsComponent,
    InfinitescrollComponent,
    NewMixtapesComponent,
    PopularMixtapesComponent,
    VideoDetailsComponent,
    SinglesComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    DeviceDetectorModule.forRoot(),
    NgxYoutubePlayerModule.forRoot(),
    HttpClientModule,
    HttpClientJsonpModule,
    BrowserAnimationsModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    NgBottomNavigationModule,
    MatTableModule,
    MatListModule,
    MatToolbarModule,
    MatSidenavModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    AppRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [{ provide: LocationStrategy, useClass: PathLocationStrategy}],
  bootstrap: [AppComponent],
})
export class AppModule {}

