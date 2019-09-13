export function canvasToBlob(canvas:HTMLCanvasElement):Promise<Blob> {
  console.log("ImageUtility.canvasToBlob(): entry point");
  return new Promise<Blob>((resolve, reject) => {
    try {
      if (canvas.toBlob) {
        console.log("ImageUtility.canvasToBlob(): canvas.toBlob == valid, return the observable of the Blob");
        canvas.toBlob(b => b ? resolve(b) : reject('Unable to convert canvas to blob'), 'image/jpeg', 0.8);
      } else {

        let dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        console.log("ImageUtility.canvasToBlob(): canvas.toBlob != valid, calling dataURItoBlob() method with parameter: " + dataUrl);
        resolve(dataURItoBlob(dataUrl));
      }
    } catch (err) {
      console.log("ImageUtility.canvasToBlob(): error!");
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
