import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameBodyComponent } from './components/game-body/game-body.component';
import { SceneComponent } from './components/scene/scene.component';
import {MicroLessonComponentsModule} from 'micro-lesson-components';
import {FlexModule} from '@angular/flex-layout';
import { GnomeComponent } from './components/gnome/gnome.component';
import {SharedModule} from '../shared/shared.module';



@NgModule({
  declarations: [GameBodyComponent, SceneComponent, GnomeComponent],
  exports: [
    SceneComponent,
    GameBodyComponent
  ],
  imports: [
    SharedModule
  ]
})
export class GnomesGameModule { }
