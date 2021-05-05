export enum FeedbackType {
  IncorrectTranslation = 'IncorrectTranslation',
  OffensiveTranslation = 'OffensiveTranslation',
  AlternateTranslation = 'AlternateTranslation',
  Other = 'Other'
}

export interface AddedWord {
  word: string;
  language: string;
  englishWord: string;
  nativeWord: string;
  nativeLanguage: string;
  transliteration: string;
  recording: Blob|null;
}

export interface Feedback extends AddedWord {
  types: FeedbackType[];
  content: string;
}
