import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CommonModule } from '@angular/common';
import { PreloadAllModules } from '@angular/router';

const routes: Routes = [
  //  { path: '', component: HomeComponent },
  { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule)},
  { path: 'music', loadChildren: () => import('./home/home.module').then(m => m.HomeModule)},
  { path: 'mixtapes/:sort', loadChildren: () => import('./new-mixtapes/new-mixtapes.module').then(m => m.NewMixtapesModule)},
  { path: 'mixtapes/:sort/:range', loadChildren: () => import('./new-mixtapes/new-mixtapes.module').then(m => m.NewMixtapesModule)}, 
  { path: ':genre/mixtapes/:sort/:range', loadChildren: () => import('./new-mixtapes/new-mixtapes.module').then(m => m.NewMixtapesModule)},
  { path: ':genre/mixtapes/:sort', loadChildren: () => import('./new-mixtapes/new-mixtapes.module').then(m => m.NewMixtapesModule)}, 
  { path: 'singles', loadChildren: () => import('./singles/singles.module').then(m => m.SinglesModule)},
  { path: 'search/:name', loadChildren: () => import('./search/search.module').then(m => m.SearchModule)},
  { path: 'album/:id', loadChildren: () => import('./album-details/album-details.module').then(m => m.AlbumDetailsModule)},
  { path: 'album/:id/:name', loadChildren: () => import('./album-details/album-details.module').then(m => m.AlbumDetailsModule)},
  { path: 'video/:id', loadChildren: () => import('./video-details/video-details.module').then(m => m.VideoDetailsModule)},
  { path: '***', redirectTo: '/music', pathMatch: 'full' },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes, { 
    useHash: false,
     scrollPositionRestoration: 'enabled',
      initialNavigation: 'enabled',
      preloadingStrategy: PreloadAllModules,
       relativeLinkResolution: 'legacy'
       })],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
