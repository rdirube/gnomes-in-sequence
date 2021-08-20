import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {ScreenTypeOx} from 'ox-types';
import {Subscription, timer} from 'rxjs';
import {GameActionsService, SoundOxService} from 'micro-lesson-core';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-count-down',
  templateUrl: './count-down.component.html',
  styleUrls: ['./count-down.component.scss']
})
export class CountDownComponent implements OnInit, OnDestroy {
  public remainingTime: number;
  public timerSubscription: Subscription;
  @Output() started: EventEmitter<void> = new EventEmitter<void>();
  constructor(private sound: SoundOxService, private gameActions: GameActionsService<any>) {
    this.remainingTime = 4;
  }

  ngOnInit(): void {
    this.timerSubscription = timer(0, 1000).pipe(take(4)).subscribe(value => {
      this.remainingTime--;
      this.sound.playBubble(ScreenTypeOx.Game);
    }, error1 => {
    }, () => {
      this.onClickStart();
    });
  }

  public onClickStart(): void {
    this.sound.playWoosh(ScreenTypeOx.Game);
    this.timerSubscription.unsubscribe();
    this.started.emit();
  }


  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
