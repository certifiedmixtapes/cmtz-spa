import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AlbumComponent } from './album/album.component';
import { TracksComponent } from './tracks/tracks.component';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search/search.component';
import { AlbumDetailsComponent } from './album-details/album-details.component';
import { NewMixtapesComponent } from './new-mixtapes/new-mixtapes.component';
import { PopularMixtapesComponent } from './popular-mixtapes/popular-mixtapes.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'music', component: HomeComponent },
  { path: 'mixtapes/newest', component: NewMixtapesComponent },
  { path: 'mixtapes/popular', component: PopularMixtapesComponent },
  { path: 'search/:name', component: SearchComponent },
  { path: 'album/:id', component: AlbumDetailsComponent },
  { path: ':id/:name', component: AlbumComponent },
  { path: ':id/:name/:colllection_id/:collection_name', component: TracksComponent },
  { path: '***', redirectTo: '/music', pathMatch: 'full' },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
