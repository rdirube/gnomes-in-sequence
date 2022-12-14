import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import {GnomesGameModule} from './gnomes-game/gnomes-game.module';
import {HttpClientModule} from '@angular/common/http';
import { TranslocoRootModule } from './transloco/transloco-root.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ChallengeService, ScoreStarsService} from 'micro-lesson-core';
import {GnomesChallengeService} from './shared/services/gnomes-challenge.service';
import {SharedModule} from './shared/shared.module';
import {GnomeScoreStarsService} from './shared/services/gnome-score-stars.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    GnomesGameModule,
    TranslocoRootModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    SharedModule
  ],
  providers: [
    {
      provide: ChallengeService,
      useExisting: GnomesChallengeService
    },
    {
      provide: ScoreStarsService,
      useExisting: GnomeScoreStarsService
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
