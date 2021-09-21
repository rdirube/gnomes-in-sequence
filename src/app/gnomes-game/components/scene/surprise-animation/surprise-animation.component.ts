import {Component, Input, OnInit} from '@angular/core';
import {SurpriseAnimationInfo} from '../../../models/types';
import {SoundOxService} from 'micro-lesson-core';

@Component({
  selector: 'app-surprise-animation',
  templateUrl: './surprise-animation.component.html',
  styleUrls: ['./surprise-animation.component.scss']
})
export class SurpriseAnimationComponent implements OnInit {

  @Input() surpriseAnimationInfo: SurpriseAnimationInfo;
  @Input() sequencePlaying: boolean;
  private currentSvgIndex: number;

  constructor(private soundService: SoundOxService) {
    this.currentSvgIndex = 0;
  }

  ngOnInit(): void {
    console.log('this.animation ifnfo', this.surpriseAnimationInfo);
  }

  onClickSvgAnimation(): void {
    this.playAnimationSound();
    this.currentSvgIndex++;
    if (this.currentSvgIndex >= this.surpriseAnimationInfo.svgList.length) {
      this.currentSvgIndex = 0;
    }
  }

  private playAnimationSound():  void {
    if (!this.sequencePlaying) {
      console.log('Update sounds in animatinos!');
      console.log('Update sounds in animatinos!');
      console.log('Update sounds in animatinos!');
      console.log('Update sounds in animatinos!');
      // this.soundService.playSoundEffect(this.surpriseAnimationInfo.animationSound, ScreenTypeOx.Game);
    }
  }
}
