import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgoxPostMessageModule} from 'ngox-post-message';
import {FlexModule} from '@angular/flex-layout';
import {MicroLessonComponentsModule} from 'micro-lesson-components';
import {TypographyOxModule} from 'typography-ox';
import { CountDownComponent } from './components/count-down/count-down.component';
import { TimeLeftComponent } from './components/time-left/time-left.component';
import { StatusBannerComponent } from './components/status-banner/status-banner.component';



@NgModule({
  declarations: [CountDownComponent, TimeLeftComponent, StatusBannerComponent],
  imports: [
    CommonModule,
    NgoxPostMessageModule,
    FlexModule,
    MicroLessonComponentsModule,
    TypographyOxModule,
  ],
  exports: [
    CommonModule,
    NgoxPostMessageModule,
    FlexModule,
    MicroLessonComponentsModule,
    TypographyOxModule,
    CountDownComponent,
    TimeLeftComponent,
    StatusBannerComponent,
  ]
})
export class SharedModule { }
