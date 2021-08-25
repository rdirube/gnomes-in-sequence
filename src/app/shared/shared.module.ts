import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgoxPostMessageModule} from 'ngox-post-message';
import {FlexModule} from '@angular/flex-layout';
import {MicroLessonComponentsModule} from 'micro-lesson-components';
import {TypographyOxModule} from 'typography-ox';
import { CountDownComponent } from './components/count-down/count-down.component';
import { TimeLeftComponent } from './components/time-left/time-left.component';



@NgModule({
  declarations: [CountDownComponent, TimeLeftComponent],
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
  ]
})
export class SharedModule { }
