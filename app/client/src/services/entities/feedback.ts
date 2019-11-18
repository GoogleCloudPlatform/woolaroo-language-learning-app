import { WordTranslation } from 'services/entities/translation';

export enum FeedbackType {
  IncorrectTranslation = 'IncorrectTranslation',
  OffensiveTranslation = 'OffensiveTranslation',
  AlternateTranslation = 'AlternateTranslation',
  Other = 'Other'
}

export interface AddedWord {
  nativeWord: string;
  englishWord: string;
  transliteration: string;
  recording: Blob|null;
}

export interface Feedback extends AddedWord {
  types: FeedbackType[];
  content: string;
}
