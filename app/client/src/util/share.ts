
export async function share(shareData: {url?: string, text?: string, title?: string, files?:Blob[]}): Promise<void> {
  if(!navigator.share || !navigator.canShare) {
    throw new Error("Sharing not supported");
  } else if(shareData.files && !navigator.canShare({files: shareData.files})) {
    throw new Error("Sharing files not supported");
  } else {
    await navigator.share(shareData);
  }
}
