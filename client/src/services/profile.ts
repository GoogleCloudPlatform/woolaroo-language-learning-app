import { Profile } from './entities/profile';
import { InjectionToken } from '@angular/core';

export interface IProfileService {
  loadProfile(): Promise<Profile>;
  saveProfile(profile: Profile): Promise<any>;
}

export const PROFILE_SERVICE = new InjectionToken<IProfileService>('Profile service');
export const PROFILE_CONFIG = new InjectionToken<any>('Profile service config');
