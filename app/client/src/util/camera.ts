import { AppRoutes } from '../app/routes';

export function cameraStreamIsAvailable() {
  return navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
}

export function getCapturePageURL() {
  return cameraStreamIsAvailable() ? AppRoutes.CaptureImage : AppRoutes.ImageSource;
}
