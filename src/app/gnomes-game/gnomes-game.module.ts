import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameBodyComponent } from './components/game-body/game-body.component';
import { SceneComponent } from './components/scene/scene.component';
import { GnomeComponent } from './components/gnome/gnome.component';
import {SharedModule} from '../shared/shared.module';
import { SurpriseAnimationComponent } from './components/scene/surprise-animation/surprise-animation.component';
import { TutorialComponent } from './components/tutorial/tutorial.component';
import { TutorialButtonComponent } from './components/tutorial/tutorial-button/tutorial-button.component';



@NgModule({
  declarations: [GameBodyComponent, SceneComponent, GnomeComponent, SurpriseAnimationComponent, TutorialComponent, TutorialButtonComponent],
  exports: [
    SceneComponent,
    TutorialComponent,
    GameBodyComponent
  ],
  imports: [
    SharedModule
  ]
})
export class GnomesGameModule { }
