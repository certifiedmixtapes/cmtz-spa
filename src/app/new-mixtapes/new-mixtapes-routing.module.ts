import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewMixtapesComponent } from './new-mixtapes.component';


const routes: Routes = [
  {
    path: '',
    component: NewMixtapesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewMixtapesRoutingModule { }