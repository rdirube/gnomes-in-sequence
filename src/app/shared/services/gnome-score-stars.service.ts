import {Injectable} from '@angular/core';
import {ScoreStarsService} from 'micro-lesson-core';
import {MiniLessonMetrics} from 'ox-types';
import {numberArrayRange, sum} from 'ox-core';

@Injectable({
  providedIn: 'root'
})
export class GnomeScoreStarsService extends ScoreStarsService<any> {
  calculateScore(metrics: MiniLessonMetrics, minScore?: number, maxScore?: number): void {
    metrics.pointsScore = 0;
    console.log('Calculating score');
    const n = 5;
    const m = 9;
    metrics.expandableInfo.exercisesData.forEach((z, i) => {
      const gnomeValue = i <= n ? 6000 / sum(numberArrayRange(1, n))
        : 4000 / sum(numberArrayRange(m - n, m));
      z.userInput.answers.forEach(ans => {
        metrics.pointsScore += ans.parts.filter(part => part.correctness === 'correct').length * gnomeValue;
      });
    });
    metrics.pointsScore = Math.max(500, metrics.pointsScore);
    metrics.score = metrics.pointsScore;
    // En los primeros n (5) ejercicios cada gnomo vale la sumatoria 6000/(1 a n) = valorGnomo (400).
    //   En los siguientes m a infinito ejercicios (9-5 = 4) cada gnomo vale 4000/=

  }
}

// function numberArrayRange(start, end): number[] {
//   return Array.from(Array(end + 1 - start).keys()).map(z => z + start);
// }
