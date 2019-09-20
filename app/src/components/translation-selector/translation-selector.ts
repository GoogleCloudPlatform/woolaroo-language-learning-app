import {Component, Input} from "@angular/core";
import {WordTranslation} from "../../services/entities/translation";

@Component({
  selector: 'translation-selector',
  templateUrl: './translation-selector.html',
  styleUrls: ['./translation-selector.scss']
})
export class TranslationSelectorComponent {
  @Input()
  public translations:WordTranslation[]|null = null;
}
