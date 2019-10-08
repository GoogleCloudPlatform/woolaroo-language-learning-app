/// <reference types="@types/dom-mediacapture-record" />

export interface AudioStream {
  stop(): void;
}

export interface PlaybackStream extends AudioStream {
  onended: (() => void)|null;
  getDuration(): number;
  getCurrentTime(): number;
}

type RecordingEndedListener = (buffer: Blob) => void;

export interface RecordingStream extends AudioStream {
  onended: RecordingEndedListener|null;
}

function getSupportedMimeType(mimeTypes: string[]): string|null {
  for (const type of mimeTypes) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return null;
}

export function startRecording(bufferSize: number, mimeTypes?: string[]): Promise<RecordingStream> {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return Promise.reject(new Error('Browser does not support audio recording'));
  }
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.getUserMedia({video: false, audio: true}).then(
      (stream) => {
        const options: MediaRecorderOptions = {};
        if (mimeTypes) {
          const type = getSupportedMimeType(mimeTypes);
          if (type) {
            options.mimeType = type;
          } else {
            console.warn('No supported mime type found - using default type');
          }
        }
        const recorder = new MediaRecorder(stream, options);
        const recordingStream: RecordingStream = {
          onended: null,
          stop: () => {
            recorder.stop();
          }
        };
        recorder.onstart = () => {
          console.log('Recording started');
          resolve(recordingStream);
        };
        recorder.onerror = (ev) => {
          console.warn('Recording error', ev.error);
          reject(ev.error);
        };
        recorder.ondataavailable = (dataEvent: BlobEvent) => {
          console.log('Recording data available');
          if (recordingStream.onended) {
            recordingStream.onended(dataEvent.data);
          }
        };
        recorder.onstop = () => {
          console.log('Recording stopped');
        };
        recorder.start();
      },
      (err) => {
        console.warn('Error creating audio stream', err);
        reject(err);
      }
    );
  });
}

export function play(buffer: Blob): Promise<PlaybackStream> {
  return new Promise<any>((resolve, reject) => {
    const audio = new Audio();
    const stream: PlaybackStream = {
      onended: null,
      getCurrentTime: () => {
        return audio.currentTime;
      },
      getDuration: () => {
        return audio.duration;
      },
      stop: () => {
        audio.pause();
        if (stream.onended) {
          stream.onended();
        }
    }};
    audio.src = URL.createObjectURL(buffer);
    audio.addEventListener('ended', () => {
      URL.revokeObjectURL(audio.src);
      if (stream.onended) {
        stream.onended();
      }
    });
    audio.play().then(
      () => resolve(stream),
      reject
    );
  });
}
