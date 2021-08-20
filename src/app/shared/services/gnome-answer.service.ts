import { Injectable } from '@angular/core';
import {AnswerService, GameActionsService, MicroLessonMetricsService} from 'micro-lesson-core';
import {TimeToLoseService} from './time-to-lose.service';
import {GnomesChallengeService} from './gnomes-challenge.service';
import {UserAnswer} from 'ox-types';

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
      this.onTryAnswer();
    });
  }

  // public addPartialAnswer(gnomeIndex: number) {
  //   this.timeToLose.restart();
  //   this.currentAnswer.sequence.push(gnomeIndex);
  //   // todo ver como accedo al ejercicio actual
  //   const answerGnomes = this.challenge.currentExercise.value.exerciseData.gnomes;
  //   if (answerGnomes.length === this.currentAnswer.sequence.length) {
  //     this.onTryAnswer();
  //   } else if (answerGnomes[this.currentAnswer.sequence.length - 1] !== gnomeIndex) {
  //     this.onTryAnswer();
  //   }
  //
  //   /*
  //       if (answerGnomes.length === this.currentAnswer.sequence.length) {
  //         this.gameActions.tryAnswer.emit(this.currentAnswer);
  //         // todo hago 'answerGnomes.length - 1 ' en caso de inversos, eso lo tengo que scar en caso de comun
  //       } else if (answerGnomes[answerGnomes.length - this.currentAnswer.sequence.length] !== gnomeIndex) {
  //         this.gameActions.tryAnswer.emit(this.currentAnswer);
  //       }
  //   */
  // }

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
