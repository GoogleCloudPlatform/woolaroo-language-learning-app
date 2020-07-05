import { Component } from '@angular/core';
import { I18nService } from 'i18n/i18n.service';
import { EndangeredLanguage, EndangeredLanguageService } from 'services/endangered-language';
import { Router } from '@angular/router';
import { AppRoutes } from 'app/routes';

@Component({
  selector: 'app-list-languages',
  templateUrl: './list-languages.html',
  styleUrls: ['./list-languages.scss']
})
export class ListLanguagesPageComponent {
  public get endangeredLanguages():EndangeredLanguage[] { return this.endangeredLanguageService.languages; }

  public currentLanguageIndex = 0;

  constructor(private router: Router,
              private i18nService: I18nService,
              private endangeredLanguageService: EndangeredLanguageService) {
  }

  onLanguageChanged(index: number) {
    this.currentLanguageIndex = index;
  }

  onCloseClick(ev: MouseEvent) {
    ev.stopPropagation();
    history.back();
  }

  onLanguageClick(code: string) {
    this.router.navigate([AppRoutes.ListLanguages, code]);
  }
}
