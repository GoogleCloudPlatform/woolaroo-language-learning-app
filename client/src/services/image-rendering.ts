import { Inject, Injectable, InjectionToken } from '@angular/core';
import { WordTranslation } from './entities/translation';
import { canvasToBlob } from 'util/image';

interface ImageRenderingConfig {
  dropShadowDistance: number;
  dropShadowColor: string;
  foregroundColor: string;
  transliterationFont: string;
  transliterationBottom: number;
  translationFont: string;
  translationBottom: number;
  originalWordFont: string;
  originalWordBottom: number;
  lineTop: number;
  lineHeight: number;
  lineWidth: number;
}

export const IMAGE_RENDERING_CONFIG = new InjectionToken<ImageRenderingConfig>('Image rendering config');

@Injectable()
export class ImageRenderingService {
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
    if (word) {
      const scale = Math.min(width / window.innerWidth, height / window.innerHeight);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      if (word.transliteration) {
        context.font = this.config.transliterationFont;
        const transliterationMetrics = context.measureText(word.transliteration);
        this._renderText(context, word.transliteration,
          width * 0.5 / scale - transliterationMetrics.width * 0.5,
          height / scale - this.config.transliterationBottom);
      }
      if (word.translation) {
        context.font = this.config.translationFont;
        const translationMetrics = context.measureText(word.translation);
        this._renderText(context, word.translation,
          width * 0.5 / scale - translationMetrics.width * 0.5,
          height / scale - this.config.translationBottom);
      }
      context.fillStyle = this.config.dropShadowColor;
      context.fillRect(
        width * 0.5 / scale + this.config.dropShadowDistance,
        height / scale - this.config.lineTop + this.config.dropShadowDistance,
        this.config.lineWidth, this.config.lineHeight);
      context.fillStyle = this.config.foregroundColor;
      context.fillRect(
        width * 0.5 / scale,
        height / scale - this.config.lineTop,
        this.config.lineWidth, this.config.lineHeight);
      context.font = this.config.originalWordFont;
      const originalMetrics = context.measureText(word.original);
      this._renderText(context, word.original,
        width * 0.5 / scale - originalMetrics.width * 0.5,
        height / scale - this.config.originalWordBottom);
    }
    return canvasToBlob(canvas);
  }

  private _renderText(context: CanvasRenderingContext2D, text: string, x: number, y: number) {
    context.fillStyle = this.config.dropShadowColor;
    context.fillText(text, x + this.config.dropShadowDistance, y + this.config.dropShadowDistance);
    context.fillStyle = this.config.foregroundColor;
    context.fillText(text, x, y);
  }
}
