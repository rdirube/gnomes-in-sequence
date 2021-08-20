import {Injectable} from '@angular/core';
import {GameActionsService} from 'micro-lesson-core';
import {Subscription, timer} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeToLoseService {
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

  public restart(): void {
    this.stop();
    this.start();
  }

  public stop(): void {
    this.timeToAnswer = 0.00001;
    if (this.timerToLoseSubscription) {
      this.timerToLoseSubscription.unsubscribe();
    }
  }

  public start(): void {
    this.timerToLoseSubscription = timer(0, 100).subscribe(value => {
      if (!this.timeToAnswer) {
        this.timeToAnswer = 0.00001;
      }
      this.timeToAnswer += 0.1 / 6;
      if (this.timeToAnswer >= 1) {
        this.timerToLoseSubscription.unsubscribe();
        this.gameActions.finishedTimeOfExercise.emit();
      }
    });
  }
}
