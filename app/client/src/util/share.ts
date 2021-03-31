import {NotSupportedError} from './errors';


export async function share(shareData: {url?: string, text?: string, title?: string, files?:Blob[]}): Promise<void> {
  const nav: any = navigator;
  if(!nav.share || !nav.canShare) {
    throw new NotSupportedError("Sharing not supported");
  } else if(shareData.files && !nav.canShare({files: shareData.files})) {
    throw new NotSupportedError("Sharing files not supported");
  } else {
    await nav.share(shareData);
  }
}
