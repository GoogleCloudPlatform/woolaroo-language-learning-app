export enum FeedbackType {
  IncorrectTranslation = 'IncorrectTranslation',
  OffensiveTranslation = 'OffensiveTranslation',
  AlternateTranslation = 'AlternateTranslation',
  Other = 'Other'
}

export interface Feedback {
  types: FeedbackType[];
  content: string;
}
