import { Component } from '@angular/core';
import { I18nService } from 'i18n/i18n.service';
import { EndangeredLanguage, EndangeredLanguageService } from 'services/endangered-language';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AppRoutes } from '../../../app/routes';

@Component({
  selector: 'app-view-language',
  templateUrl: './view-language.html',
  styleUrls: ['./view-language.scss']
})
export class ViewLanguagePageComponent {
  public get endangeredLanguages():EndangeredLanguage[] { return this.endangeredLanguageService.languages; }

  public language: EndangeredLanguage|null;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private i18nService: I18nService,
              private endangeredLanguageService: EndangeredLanguageService) {
    this.language = null;
    this.route.paramMap.subscribe(
      (params: ParamMap) => {
        this.language = this.endangeredLanguageService.languages.find(lang => lang.code === params.get('id')) || null;
      }
    );
  }

  onLanguageClick(code: string) {
    this.router.navigate([AppRoutes.ListLanguages, code]);
  }

  onBackClick(ev:MouseEvent) {
    ev.stopPropagation();
    history.back();
  }
}
