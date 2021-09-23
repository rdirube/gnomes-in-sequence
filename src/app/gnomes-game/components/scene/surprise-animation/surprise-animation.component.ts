import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {SurpriseAnimationInfo} from '../../../models/types';
import {SoundOxService} from 'micro-lesson-core';
import {ScreenTypeOx} from 'ox-types';
import {interval, Subscription} from 'rxjs';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-surprise-animation',
  templateUrl: './surprise-animation.component.html',
  styleUrls: ['./surprise-animation.component.scss']
})
export class SurpriseAnimationComponent implements OnInit, OnDestroy {


  @Input() surpriseAnimationInfo: SurpriseAnimationInfo;
  @Input() sequencePlaying: boolean;
  private currentSvgIndex: number;
  private playingIntervalSvgSequence: boolean;
  private intervalSubs: Subscription;

  constructor(private soundService: SoundOxService) {
    this.currentSvgIndex = 0;
  }

  ngOnInit(): void {
    console.log('this.animation ifnfo', this.surpriseAnimationInfo);
  }

  onClickSvgAnimation(): void {
    if (this.surpriseAnimationInfo.type === 'svg-sequence') {
      this.playAnimationSound();
      this.increaseSvgIndex();
    } else if (!this.playingIntervalSvgSequence) {
      this.deleteIntervalSubscription();
      this.playingIntervalSvgSequence = true;
      this.playAnimationSound();
      this.intervalSubs = interval(this.surpriseAnimationInfo.intervalTime)
        .pipe(take(this.surpriseAnimationInfo.svgList.length)).subscribe(z => {
          this.increaseSvgIndex();
          if (z === this.surpriseAnimationInfo.svgList.length - 1) {
            this.playingIntervalSvgSequence = false;
          }
        });

    }
  }

  increaseSvgIndex(): void {
    this.currentSvgIndex++;
    if (this.currentSvgIndex >= this.surpriseAnimationInfo.svgList.length) {
      this.currentSvgIndex = 0;
    }
  }

  playAnimationSound(): void {
    if (!this.sequencePlaying) {
      this.soundService.playSoundEffect(this.surpriseAnimationInfo.animationSound, ScreenTypeOx.Game);
    }
  }

  ngOnDestroy(): void {
    this.deleteIntervalSubscription();
  }

  private deleteIntervalSubscription(): void {
    if (this.intervalSubs !== undefined) {
      this.intervalSubs.unsubscribe();
      this.intervalSubs = undefined;
    }
  }
}

