import * as loadImage from 'blueimp-load-image';
import { getLogger } from './logging';

const logger = getLogger('image');

export async function canvasToBlob(canvas: HTMLCanvasElement, quality: number = 0.8): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    try {
      if (canvas.toBlob) {
        canvas.toBlob(b => b ? resolve(b) : reject('Unable to convert canvas to blob'), 'image/jpeg', quality);
      } else {
        // canvas.toBlob not implemented on this platform - default to manual deserialization
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataURItoBlob(dataUrl));
      }
    } catch (err) {
      logger.warn('Converting canvas to blob failed', err);
      reject(err);
    }
  });
}

function dataURItoBlob(dataURI: string): Blob {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}


export async function resizeImage(imageData: Blob, maxWidth: number, maxHeight: number, quality: number = 0.8): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    loadImage(imageData, canvas => {
      canvasToBlob(canvas as HTMLCanvasElement, quality).then(resolve, reject);
    }, { maxWidth, maxHeight, canvas: true });
  });
}

// Validate that image data is able to load
// Images loaded from nav state can become invalid
export async function validateImageData(data: Blob): Promise<boolean> {
  const url = URL.createObjectURL(data);
  return new Promise((resolve, reject) => {
    const image = document.createElement('img');
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(true);
    };
    image.onerror = ex => {
      URL.revokeObjectURL(url);
      reject(ex);
    };
    image.src = url;
  });
}


// Validate that an image URL is able to load
// URLs created with URL.createObjectURL can become invalid after page
// refreshes, so need to validate them before usage
export async function validateImageURL(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = document.createElement('img');
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}
