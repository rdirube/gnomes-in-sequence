import {Injectable} from '@angular/core';
import {AnswerService, GameActionsService, MicroLessonMetricsService} from 'micro-lesson-core';
import {TimeToLoseService} from './time-to-lose.service';
import {GnomesChallengeService} from './gnomes-challenge.service';
import {CorrectablePart, PartCorrectness, UserAnswer} from 'ox-types';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GnomeAnswerService extends AnswerService {
  constructor(private gameActionsService: GameActionsService<any>,
              m: MicroLessonMetricsService<any>,
              private timeToLose: TimeToLoseService, private challenge: GnomesChallengeService) {
    super(gameActionsService, m);
    this.gameActionsService.showNextChallenge.subscribe(value => {
      this.currentAnswer = {parts: []};
    });
    this.gameActionsService.finishedTimeOfExercise.subscribe(() => {
      console.log('finishedTimeOfExercise');
      this.onTryAnswer();
    });
  }

  public addPartialAnswer(clickedGnomeId: number): void {
    // this.timeToLose.restart();
    const correctAnswerGnomes = this.challenge.currentExercise.value.exerciseData.sequenceGnomeIds;
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
    /*
        if (answerGnomes.length === this.currentAnswer.sequence.length) {
          this.gameActions.tryAnswer.emit(this.currentAnswer);
          // todo hago 'answerGnomes.length - 1 ' en caso de inversos, eso lo tengo que scar en caso de comun
        } else if (answerGnomes[answerGnomes.length - this.currentAnswer.sequence.length] !== gnomeIndex) {
          this.gameActions.tryAnswer.emit(this.currentAnswer);
        }
    */
  }

  protected checkAnswer(answer: UserAnswer): Observable<PartCorrectness> {
    console.log('hehe');
    return super.checkAnswer(answer);
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
