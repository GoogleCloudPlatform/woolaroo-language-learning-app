import {default as loadImage, MetaData} from 'blueimp-load-image';

export async function canvasToBlob(canvas:HTMLCanvasElement):Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    try {
      if (canvas.toBlob) {
        canvas.toBlob(b => b ? resolve(b) : reject('Unable to convert canvas to blob'), 'image/jpeg', 0.8);
      } else {
        // canvas.toBlob not implemented on this platform - default to manual deserialization
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataURItoBlob(dataUrl));
      }
    } catch (err) {
      console.warn("Converting canvas to blob failed", err);
      reject(err);
    }
  });
}

function dataURItoBlob(dataURI:string):Blob {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], {type: mimeString});
}


export async function resizeImage(imageData:Blob, maxWidth:number, maxHeight:number):Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    loadImage(imageData, canvas => {
      canvasToBlob(canvas as HTMLCanvasElement).then(resolve, reject);
    }, { maxWidth: maxWidth, maxHeight: maxHeight, canvas: true });
  });
}
