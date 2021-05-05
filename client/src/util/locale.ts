export const DEFAULT_LOCALE = 'en';

export function getBaseLocale(locale:string): string {
  return (locale || DEFAULT_LOCALE).split('-')[0];
}
