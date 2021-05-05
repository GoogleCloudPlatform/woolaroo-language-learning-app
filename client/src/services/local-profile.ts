import { IProfileService } from './profile';
import { Profile } from './entities/profile';
import { Injectable } from '@angular/core';
import {getLogger} from 'util/logging';

const logger = getLogger('LocalProfileService');

@Injectable()
export class LocalProfileService implements IProfileService {
  public loadProfile(): Promise<Profile> {
    const serializedProfile = window.localStorage.getItem('profile');
    let profile: Profile|null = null;
    if (serializedProfile) {
      try {
       profile = JSON.parse(serializedProfile);
      } catch (err) {
        logger.warn('Error parsing profile', err);
      }
    }
    if (!profile) {
      profile = {
        termsAgreed: false,
        introViewed: false,
        language: null,
        endangeredLanguage: null
      };
    }
    return Promise.resolve(profile);
  }

  public saveProfile(profile: Profile): Promise<any> {
    window.localStorage.setItem('profile', JSON.stringify(profile));
    return Promise.resolve(null);
  }
}
