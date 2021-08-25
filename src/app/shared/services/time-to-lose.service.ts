import {EventEmitter, Injectable} from '@angular/core';
import {GameActionsService} from 'micro-lesson-core';
import {Subscription, timer} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeToLoseService {
  public timerStart = new EventEmitter<number>();
  private timerToLoseSubscription: Subscription;
  public timeToAnswer: number;

  constructor(private gameActions: GameActionsService<any>) {
    this.gameActions.exitFromGame.subscribe(() => {
      this.stop();
    });
    this.gameActions.microLessonCompleted.subscribe(() => {
      this.stop();
    });

  }

  public restart(totalSeconds: number): void {
    this.stop();
    this.start(totalSeconds);
  }

  public stop(): void {
    this.timeToAnswer = 0.00001;
    if (this.timerToLoseSubscription) {
      this.timerToLoseSubscription.unsubscribe();
    }
  }

  public start(totalSeconds: number): void {
    this.timerStart.emit(totalSeconds);
    this.timerToLoseSubscription = timer(0, 100).subscribe(value => {
      if (!this.timeToAnswer) {
        this.timeToAnswer = 0.00001;
      }
      this.timeToAnswer += 0.1 / totalSeconds;
      if (this.timeToAnswer >= 1) {
        this.timerToLoseSubscription.unsubscribe();
        this.gameActions.finishedTimeOfExercise.emit();
      }
      console.log('this.timeToAnswer', this.timeToAnswer);
    });
  }
}
