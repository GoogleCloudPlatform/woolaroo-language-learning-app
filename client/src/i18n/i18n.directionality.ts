import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { Direction } from '@angular/cdk/bidi';
import { I18nService, Language } from './i18n.service';

@Injectable({providedIn: 'root'})
export class I18nDirectionality implements OnDestroy {
  public get value(): Direction { return this.i18n.currentLanguage.direction; }
  public readonly change = new EventEmitter<Direction>();

  constructor(private i18n:I18nService) {
    this.i18n.currentLanguageChanged.subscribe((lang:Language) => {
      this.change.emit(lang.direction);
    });
  }

  ngOnDestroy() {
    this.change.complete();
  }
}
