
export enum OperatingSystem {
  Android,
  iOS,
  MacOS,
  Windows,
  Linux,
  Other
}

export function getOperatingSystem(): OperatingSystem {
  const platform = navigator.platform;
  switch (platform) {
    case 'Macintosh':
    case 'MacIntel':
    case 'MacPPC':
    case 'Mac68K':
      return OperatingSystem.MacOS;
    case 'iPhone':
    case 'iPad':
    case 'iPod':
      return OperatingSystem.iOS;
    case 'Win32':
    case 'Win64':
    case 'Windows':
    case 'WinCE':
      return OperatingSystem.Windows;
  }
  const userAgent = navigator.userAgent;
  if (/Android/.test(userAgent)) {
    return OperatingSystem.Android;
  } else if (/Linux/.test(platform)) {
    return OperatingSystem.Linux;
  } else {
    return OperatingSystem.Other;
  }
}
