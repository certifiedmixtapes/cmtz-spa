import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import {MatDividerModule} from '@angular/material/divider';
import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    HttpClientJsonpModule,
    MatDividerModule,
    MatIconModule,
    SearchRoutingModule,
  ],
  declarations: [
    SearchComponent,
  ]
})
export class SearchModule { }
