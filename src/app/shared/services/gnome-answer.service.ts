import {Injectable} from '@angular/core';
import {AnswerService, GameActionsService, MicroLessonMetricsService} from 'micro-lesson-core';
import {TimeToLoseService} from './time-to-lose.service';
import {GnomesChallengeService} from './gnomes-challenge.service';
import {PartCorrectness, UserAnswer} from 'ox-types';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GnomeAnswerService extends AnswerService {
  constructor(private gameActionsService: GameActionsService<any>,
              m: MicroLessonMetricsService<any>,
              private timeToLose: TimeToLoseService, private challenge: GnomesChallengeService) {
    super(gameActionsService, m);
    this.gameActionsService.showNextChallenge.subscribe(value => {
      this.cleanAnswer();
    });
    this.gameActionsService.finishedTimeOfExercise.subscribe(() => {
      console.log('finishedTimeOfExercise');
      // this.currentAnswer.parts.push({correctness: 'wrong', parts: []});
      this.onTryAnswer();
    });
  }

  public cleanAnswer(): void {
    this.currentAnswer = {parts: []};
  }

  public addPartialAnswer(clickedGnomeId: number): void {
    // this.timeToLose.restart();
    const correctAnswerGnomes = this.challenge.exerciseConfig.invertedGnomes ?
        this.challenge.currentExercise.value.exerciseData.sequenceGnomeIds.filter( z => z !== undefined).reverse()
        : this.challenge.currentExercise.value.exerciseData.sequenceGnomeIds;
    const correctness: PartCorrectness = correctAnswerGnomes[this.currentAnswer.parts.length] === clickedGnomeId ? 'correct' : 'wrong';
    this.currentAnswer.parts.push({correctness, parts: [{value: clickedGnomeId, format: 'number'}]});
    // todo ver como accedo al ejercicio actual
    if (correctAnswerGnomes.length === this.currentAnswer.parts.length) {
      console.log('trying answer');
      this.onTryAnswer();
    } else if (correctness !== 'correct') {
      console.log('trying wrong answer');
      this.onTryAnswer();
    }
  }

  protected checkAnswer(answer: UserAnswer): Observable<PartCorrectness> {
    return of(answer.parts.length === this.challenge.exercise.sequenceGnomeIds.length
    && answer.parts.every(z => z.correctness === 'correct') ? 'correct' : 'wrong');
  }

//   protected checkAnswer(answer: UserAnswer): Observable<boolean> {
//     /*  // todo chequear segun sea el id del juego
//   return this.equalsGnomeArray(this.currentExercise.value.exerciseData.gnomes, answer.sequence.reverse());
// */
//     return of(this.equalsGnomeArray(this.challenge.currentExercise.value.exerciseData.gnomes, answer.sequence));
//   }

  protected isValidAnswer(answer: UserAnswer): boolean {
    return false;
  }
}
