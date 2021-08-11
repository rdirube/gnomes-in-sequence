export interface GnomeInfo {
  color: string;
}

export interface GnomesExercise {
  gnomes: GnomeInfo[];
  timeBetweenSounds: number;
  secondsToStartAnswer: number;
  maxSecondsBetweenAnswers: number;
  soundDuration: number;
}

export interface GnomesNivelation {
  gnomeMinCount: number;
  gnomeMaxCount: number;

  timeBetweenSounds: number;
  secondsToStartAnswer: number;
  maxSecondsBetweenAnswers: number;

  startSoundCount: number; // how much sounds are set at the beggining
  stepCount: number; // number of sounds added when a challenge is completed.

  gnomePositionStrategy: 'random' | 'symetric' | 'asymetric';
  gnomeSimilarColorDifficulty: 'different' | 'similar' | 'very-similar';
  gnomeSimilarSoundDifficulty: 'different' | 'similar' | 'very-similar';

  sameGnomeInDifferentLocationCount: number;
}
