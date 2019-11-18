import { Inject, Injectable, InjectionToken } from '@angular/core';
import { WordTranslation } from './entities/translation';
import { canvasToBlob } from 'util/image';

interface ImageRenderingConfig {
  dropShadowDistance: number;
  dropShadowColor: string;
  foregroundColor: string;
  transliteration: ImageRenderingTextConfig;
  translation: ImageRenderingTextConfig;
  originalWord: ImageRenderingTextConfig;
  line: { width: number, height: number, marginBottom: number };
  padding: number;
}

interface ImageRenderingTextConfig {
  font: string;
  lineHeight: number;
  lineSpacing: number;
  marginBottom: number;
}

export const IMAGE_RENDERING_CONFIG = new InjectionToken<ImageRenderingConfig>('Image rendering config');

@Injectable()
export class ImageRenderingService {
  private static _getTextLines(context: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const lines: string[] = [];
    let remainingText = text;
    while (remainingText) {
      const metrics = context.measureText(remainingText);
      if (metrics.width < maxWidth) {
        lines.push(remainingText);
        break;
      }
      let breakIndex = Math.floor(remainingText.length * maxWidth / metrics.width);
      if (breakIndex <= 0) {
        lines.push(remainingText);
        break;
      }
      const prevWhitespaceIndex = remainingText.lastIndexOf(' ', breakIndex);
      if (prevWhitespaceIndex >= 0) {
        breakIndex = prevWhitespaceIndex;
      }
      lines.push(remainingText.slice(0, breakIndex));
      remainingText = remainingText.slice(breakIndex).trim();
    }
    return lines;
  }

  constructor(@Inject(IMAGE_RENDERING_CONFIG) private config: ImageRenderingConfig) {
  }

  async renderImage(imageData: Blob, word: WordTranslation, width: number, height: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const image: HTMLImageElement = document.createElement('img');
      image.onload = () => {
        this._renderImage(image, word, width, height).then(
          (b) => {
            URL.revokeObjectURL(image.src);
            resolve(b);
          },
          (err) => {
            URL.revokeObjectURL(image.src);
            reject(err);
          }
        );
      };
      image.onerror = err => {
        URL.revokeObjectURL(image.src);
        reject(err);
      };
      image.src = URL.createObjectURL(imageData);
    });
  }

  private async _renderImage(image: HTMLImageElement, word: WordTranslation, width: number, height: number): Promise<Blob> {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const imageWidth = image.naturalWidth;
    const imageHeight = image.naturalHeight;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Unable to create canvas context');
    }
    // multiplier to scale canvas down to contain image dimensions
    const imageScale = Math.min(imageWidth / width, imageHeight / height);
    const croppedImageWidth = Math.round(width * imageScale);
    const croppedImageHeight = Math.round(height * imageScale);
    const croppedImageDx = (imageWidth - croppedImageWidth) * 0.5;
    const croppedImageDy = (imageHeight - croppedImageHeight) * 0.5;
    context.drawImage(image, croppedImageDx, croppedImageDy, croppedImageWidth, croppedImageHeight, 0, 0, width, height);
    if (!word) {
      return canvasToBlob(canvas);
    }
    const scale = Math.min(width / window.innerWidth, height / window.innerHeight);
    const centerX = width * 0.5 / scale;
    context.setTransform(scale, 0, 0, scale, 0, 0);
    let y = height / scale; // start at bottom
    const maxTextWidth = (width - 2 * this.config.padding) / scale;
    y = this._renderText(context, word.original, this.config.originalWord, centerX, y, maxTextWidth);
    y = this._renderLine(context, centerX, y);
    if (word.translation) {
      y = this._renderText(context, word.translation, this.config.translation, centerX, y, maxTextWidth);
    }
    if (word.transliteration) {
      this._renderText(context, word.transliteration, this.config.transliteration, centerX, y, maxTextWidth);
    }
    return canvasToBlob(canvas);
  }

  private _renderLine(context: CanvasRenderingContext2D, centerX: number, bottomY: number): number {
    const lineConfig = this.config.line;
    const y = bottomY - lineConfig.height - lineConfig.marginBottom;
    context.fillStyle = this.config.dropShadowColor;
    context.fillRect(centerX + this.config.dropShadowDistance, y + this.config.dropShadowDistance,
      lineConfig.width, lineConfig.height);
    context.fillStyle = this.config.foregroundColor;
    context.fillRect(centerX, y, lineConfig.width, lineConfig.height);
    return y;
  }

  private _renderText(context: CanvasRenderingContext2D, text: string, config: ImageRenderingTextConfig,
                      centerX: number, bottomY: number, maxWidth: number): number {
    context.font = config.font;
    let y = bottomY - config.marginBottom;
    const lines = ImageRenderingService._getTextLines(context, text, maxWidth);
    for (let k = lines.length - 1; k >= 0; k--) {
      const line = lines[k];
      const metrics = context.measureText(line);
      const x = centerX - Math.min(metrics.width, maxWidth) * 0.5;
      context.fillStyle = this.config.dropShadowColor;
      context.fillText(line, x + this.config.dropShadowDistance, y + this.config.dropShadowDistance, maxWidth);
      context.fillStyle = this.config.foregroundColor;
      context.fillText(line, x, y, maxWidth);
      y -= config.lineHeight;
      if (k > 0) {
        y -= config.lineSpacing;
      }
    }
    return y;
  }
}
