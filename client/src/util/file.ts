export function downloadFile(fileContent: Blob, fileName: string) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(fileContent);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}
