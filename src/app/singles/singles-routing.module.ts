import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SinglesComponent } from './singles.component';


const routes: Routes = [
  {
    path: '',
    component: SinglesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SinglesRoutingModule { }