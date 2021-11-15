import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import anime from 'animejs';
import {TimeToLoseService} from '../../services/time-to-lose.service';
import {SubscriberOxDirective} from 'micro-lesson-components';
import {interval, Subscription} from 'rxjs';

@Component({
  selector: 'app-time-left',
  templateUrl: './time-left.component.html',
  styleUrls: ['./time-left.component.scss']
})
export class TimeLeftComponent extends SubscriberOxDirective implements OnInit, AfterViewInit {


  @ViewChild('movingBackground') movingBackground: ElementRef;

  secondsIntervalSubs: Subscription;
  public currentTime: number;
  private animation: any;


  constructor(private timeToLoseService: TimeToLoseService, private elementRef: ElementRef) {
    super();
    // this.addSubscription(this.timeToLoseService.timerStart, x => {
    //   this.timerOut(() => this.playAnimation(x));
    // });
  }

  ngOnInit(): void {
  }


  public timerOut(complete = () => {
  }): void {
    anime.remove('.timer');
    this.animation = undefined;
    this.removeSecondsIntervalSubs();
    anime({
      targets: '.timer',
      translateY: '-20vh',
      duration: 0,
      complete
    });
  }

  public playAnimation(seconds: number): void {
    const showWhen = 5;
    anime.remove('.timer');
    this.animation = undefined;
    this.removeSecondsIntervalSubs();
    this.currentTime = seconds;
    this.secondsIntervalSubs = interval(1000).subscribe(x => {
      this.currentTime = Math.max(0, this.currentTime - 1);
      if (this.currentTime < showWhen && !this.animation) {
        this.animation = anime({
          targets: '.timer',
          backgroundColor: {value: ['#dcd247', '#d54639'], easing: 'linear', duration: Math.min(showWhen, this.currentTime) * 1000},
          translateY: {
            value: ['-20vh', '50%'],
            duration: 2000,
          },
          duration: Math.min(showWhen, this.currentTime) * 1000
        });
      }
    });
    // this.movingBackground.nativeElement.style.backgroundColor = 'red';

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

  ngAfterViewInit(): void {
    this.timerOut();
  }

}
