import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import anime from 'animejs';
import {TimeToLoseService} from '../../services/time-to-lose.service';
import {SubscriberOxDirective} from 'micro-lesson-components';
import {interval, Subscription} from 'rxjs';

@Component({
  selector: 'app-time-left',
  templateUrl: './time-left.component.html',
  styleUrls: ['./time-left.component.scss']
})
export class TimeLeftComponent extends SubscriberOxDirective implements OnInit {

  @ViewChild('movingBackground') movingBackground: ElementRef;

  secondsIntervalSubs: Subscription;
  public currentTime: number;


  constructor(private timeToLoseService: TimeToLoseService) {
    super();
    this.addSubscription(this.timeToLoseService.timerStart, x => {
      this.playAnimation(x);
    });
  }

  ngOnInit(): void {
  }

  private playAnimation(seconds: number): void {
    anime.remove(this.movingBackground);
    this.removeSecondsIntervalSubs();
    this.currentTime = seconds;
    this.secondsIntervalSubs = interval(1000).subscribe(x => {
      this.currentTime = Math.max(0, this.currentTime - 1);
    });
    // this.movingBackground.nativeElement.style.backgroundColor = 'red';
    anime({
      targets: this.movingBackground.nativeElement,
      backgroundColor: ['#00ff00', '#ff0000'],
      translateY: [0, '100%'],
      easing: 'linear',
      duration: seconds * 1000
    });
    // anime({
    //   targets: '.timer',
    //   easing: 'linear',
    //   duration: 10000
    // });
  }

  private removeSecondsIntervalSubs(): void {
    if (this.secondsIntervalSubs) {
      this.secondsIntervalSubs.unsubscribe();
      this.secondsIntervalSubs = undefined;
    }
  }
}
