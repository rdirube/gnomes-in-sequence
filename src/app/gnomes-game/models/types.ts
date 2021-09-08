export type GnomeSceneStatus = 'ver' | 'jugar';

export interface GnomeInfo {
  reference: string;
  color: string;
  sound: string;
}

export interface GnomesExercise {
  sequenceGnomeIds: number[];
  scene: GnomeScene;
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
  forcedGnomes?: string[];
  // sameGnomeInDifferentLocationCount: number;
  soundDuration: number;
  soundDurationMultiplierPerExercise: number;

  possibleScenes: string[];
  invertedGnomes: boolean;
  shuffleAfterSequencePresentation: boolean;
  shuffleAfterUserAnswer: boolean;

  minCorrectExercisesTo6000: number;
  minCorrectExercisesTo10000: number;
  maxHintsPerExercise: number;

}

export interface GnomeScene {
  name: string;
  positions: { x: string, y: string }[];
}

export type GnomeAnswer = number[];
