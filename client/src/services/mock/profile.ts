import { IProfileService } from '../profile';
import { Profile } from '../entities/profile';

export class MockProfileService implements IProfileService {
  private profile: Profile = { termsAgreed: false, introViewed: false };

  public loadProfile(): Promise<Profile> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.profile);
      }, 2000);
    });
  }

  public saveProfile(profile: Profile): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.profile = profile;
        resolve();
      }, 2000);
    });
  }
}
