import { default as loadImage, MetaData } from 'blueimp-load-image';

const EXIF_ORIENTATION = 0x0112;

export async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
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
      console.warn('Converting canvas to blob failed', err);
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
  return new Blob([ab], {type: mimeString});
}


export async function resizeImage(imageData: Blob, maxWidth: number, maxHeight: number): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    loadImage(imageData, canvas => {
      canvasToBlob(canvas as HTMLCanvasElement).then(resolve, reject);
    }, { maxWidth, maxHeight, canvas: true });
  });
}

function addRotateTransform(radians: number, context: CanvasRenderingContext2D) {
  const sin = Math.sin(radians);
  const cos = Math.cos(radians);
  context.transform(cos, sin, -sin, cos, 0, 0);
}

function addOrientationTransforms(orientation: number, context: CanvasRenderingContext2D) {
  switch (orientation) {
    case 2:
      // flip horizontal
      context.transform(-1, 0, 0, 1, 0, 0);
      break;
    case 3:
      // 180 rotation
      addRotateTransform(Math.PI, context);
      break;
    case 4:
      // flip vertical
      context.transform(1, 0, 0, -1, 0, 0);
      break;
    case 5:
      // 90 rotation, horizontal flip
      addRotateTransform(-Math.PI * 0.5, context);
      context.transform(-1, 0, 0, 1, 0, 0);
      break;
    case 6:
      // -90 rotation
      addRotateTransform(Math.PI * 0.5, context);
      break;
    case 7:
      // -90 rotation, horizontal flip
      addRotateTransform(Math.PI * 0.5, context);
      context.transform(-1, 0, 0, 1, 0, 0);
      break;
    case 8:
      // 90 rotation
      addRotateTransform(-Math.PI * 0.5, context);
      break;
  }
}


export async function removeImageTransform(imageData: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    loadImage.parseMetaData(imageData, (metadata: MetaData) => {
      if (!metadata.exif) {
        reject(new Error('No metadata found on image'));
        return;
      }
      const orientation = metadata.exif[EXIF_ORIENTATION] as number;
      if (orientation === undefined) {
        reject(new Error('No orientation found in image metadata'));
        return;
      }
      if (orientation < 2 || orientation > 8) {
        // no transform needed
        resolve(imageData);
        return;
      }
      const img = document.createElement('img');
      img.onload = () => {
        const originalWidth = img.naturalWidth;
        const originalHeight = img.naturalHeight;
        let newWidth = originalWidth;
        let newHeight = originalHeight;
        if (orientation >= 5) {
          // image is rotated +-90 degrees
          newWidth = originalHeight;
          newHeight = originalWidth;
        }
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        const context = canvas.getContext('2d');
        if (!context) {
          reject(new Error('Failed to create canvas context'));
          return;
        }
        // center image (to avoid complications with rotation and scaling)
        context.transform(1, 0, 0, 1, newWidth * 0.5, newHeight * 0.5);
        addOrientationTransforms(orientation, context);
        // move image back to origin
        context.transform(1, 0, 0, 1, -originalWidth * 0.5, -originalHeight * 0.5);
        context.drawImage(img, 0, 0);
        URL.revokeObjectURL(img.src);
        canvasToBlob(canvas).then(resolve, reject);
      };
      img.onerror = err => {
        URL.revokeObjectURL(img.src);
        console.warn('Failed loading image', err);
        reject(err);
      };
      img.src = URL.createObjectURL(imageData);
    });
  });
}
