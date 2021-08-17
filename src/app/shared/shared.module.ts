import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgoxPostMessageModule} from 'ngox-post-message';
import {FlexModule} from '@angular/flex-layout';
import {MicroLessonComponentsModule} from 'micro-lesson-components';
import {TypographyOxModule} from 'typography-ox';



@NgModule({
  declarations: [],
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
  ]
})
export class SharedModule { }
