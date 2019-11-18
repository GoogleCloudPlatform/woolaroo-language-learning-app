
export function cameraStreamIsAvailable() {
  return navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
}
