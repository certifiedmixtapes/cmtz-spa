import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumDetailsRoutingModule } from './album-details-routing.module';
import { AlbumDetailsComponent } from './album-details.component';
import { CommentboxComponent } from '../commentbox/commentbox.component';
import { CommentsComponent, DatacontainerDirective } from '../comments/comments.component';
import { ChildboxComponent } from '../childbox/childbox.component';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { MatListModule } from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PlayerModule } from '../player/player.module';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    MatTableModule,
    MatListModule,
    MatMenuModule,
    AlbumDetailsRoutingModule,
    //PlayerModule
  ],
  declarations: [
    DatacontainerDirective,
     CommentboxComponent,
        CommentsComponent,
        ChildboxComponent,
        AlbumDetailsComponent,
]
})
export class AlbumDetailsModule { }
