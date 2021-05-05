import { AppRoutes } from '../app/routes';

export function cameraStreamIsAvailable() {
  return navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
}

export async function loadCapturePageURL(): Promise<string> {
  if (!cameraStreamIsAvailable()) {
    return Promise.resolve(AppRoutes.ImageSource);
  } else if (await loadDeviceHasCamera() === false) {
    return Promise.resolve(AppRoutes.ImageSource);
  } else {
    return Promise.resolve(AppRoutes.CaptureImage);
  }
}

export async function loadDeviceHasCamera(): Promise<boolean|null> {
  if (!navigator || !navigator.mediaDevices.enumerateDevices) {
    // unable to determine if camera is present
    return Promise.resolve(null);
  }
  return navigator.mediaDevices.enumerateDevices().then(
    devices => !!devices.find(d => d.kind === 'videoinput')
  );
}
