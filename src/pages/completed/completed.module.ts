import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompletedPage } from './completed';

@NgModule({
  declarations: [
    CompletedPage,
  ],
  imports: [
    IonicPageModule.forChild(CompletedPage),
  ],
  exports: [
    CompletedPage
  ]
})
export class CompletedPageModule {}
