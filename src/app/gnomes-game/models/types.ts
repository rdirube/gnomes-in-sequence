export interface GnomeInfo {
  color: string;
  sound: string;
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
  percentageTimeBetweenSounds: number;

  secondsToStartAnswer: number;

  maxSecondsBetweenAnswers: number;

  startSoundCount: number; // how much sounds are set at the beggining
  stepCount: number; // number of sounds added when a challenge is completed.
  // gnomePositionStrategy: 'random' | 'symetric' | 'asymetric';
  // gnomeSimilarColorDifficulty?: {case: 'different' | 'similar' | 'very-similar', count: number}[];
  // gnomeSimilarSoundDifficulty?: {case: 'different' | 'similar' | 'very-similar', count: number}[];
  forcedGnomes?: {possibleGnomes: string}[];
  // sameGnomeInDifferentLocationCount: number;
  soundDuration: number;
  percentageReduction: number;

  possibleScenes: GnomeScene[];
  invertedGnomes: boolean;
}

export interface GnomeScene {
  name: string;
  maxGnomes: number;
}
