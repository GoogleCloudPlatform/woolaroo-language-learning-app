import * as EXIF from 'exif-js';

export interface ImageMetadata {
  width:number,
  height:number,
  orientation:number
}

export async function canvasToBlob(canvas:HTMLCanvasElement):Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    try {
      if (canvas.toBlob) {
        canvas.toBlob(b => b ? resolve(b) : reject('Unable to convert canvas to blob'), 'image/jpeg', 0.8);
      } else {
        // canvas.toBlob not implemented on this platform - default to manual deserialization
        let dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataURItoBlob(dataUrl));
      }
    } catch (err) {
      console.warn("Converting canvas to blob failed", err);
      reject(err);
    }
  });
}

function dataURItoBlob(dataURI:string):Blob {
  let byteString = atob(dataURI.split(',')[1]);
  let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  let ab = new ArrayBuffer(byteString.length);
  let ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], {type: mimeString});
}

export async function getImageMetadata(data:Blob):Promise<ImageMetadata> {
  return new Promise((resolve, reject) => {
    const tags = EXIF.readFromBinaryFile(data);
    let orientation = tags["Orientation"];
    let width:number = tags["PixelXDimension"];
    let height:number = tags["PixelYDimension"];
    if(width && height) {
      resolve({ width: width, height: height, orientation: orientation });
    } else {
      // fall back to using image element
      let img:HTMLImageElement = document.createElement('img');
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight, orientation: orientation });
        URL.revokeObjectURL(img.src);
        img.src = "";
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(data);
    }
  });
}


export async function resizeImage(imageData:Blob, width:number, height:number):Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    const img = document.createElement('img');
    img.onload = () => {
      const canvas:HTMLCanvasElement = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      context!.drawImage(img, 0, 0, width, height);
      canvasToBlob(canvas).then(resolve, reject);
      URL.revokeObjectURL(img.src);
      img.src = "";
    };
    img.onerror = err => {
      URL.revokeObjectURL(img.src);
      reject(err);
    };
    img.src = URL.createObjectURL(imageData);
  });
}
